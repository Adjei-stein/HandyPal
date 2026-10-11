import { Menu } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { BackHandler, Image, Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import ChatPage, { Conversation } from '@/components/ChatPage';
import HomeFeed from '@/components/HomeFeed';
import InboxPage from '@/components/InboxPage';
import UserSideNav from '@/components/userSideNav';
import { currentUser } from '@/data/mockData';
import { useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const initialGroup = mode === 'market' ? 'market' : 'work';
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  
  // Side nav state
  const sidebarTranslateX = useSharedValue(-width);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const gestureActive = useSharedValue(false);

  const openSideNav = () => {
    sidebarTranslateX.set(withSpring(0, { 
      damping: 20, 
      stiffness: 200 
    }));
    setIsSideNavOpen(true);
  };

  const closeSideNav = () => {
    sidebarTranslateX.set(withSpring(-width, { 
      damping: 20, 
      stiffness: 200 
    }));
    setIsSideNavOpen(false);
  };

  // Android back button closes the drawer before leaving the screen.
  useEffect(() => {
    if (!isSideNavOpen) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      closeSideNav();
      return true;
    });
    return () => sub.remove();
  });

  // Swipe gesture for side nav
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // More lenient horizontal activation
    .failOffsetY([-15, 15])   // Strict vertical failure
    .onBegin((event) => {
      // Only activate if the gesture starts on the left edge
      if (event.absoluteX < 60) {
        gestureActive.set(true);
      }
    })
    .onUpdate((event) => {
      if (!gestureActive.get()) return;

      if (!isSideNavOpen) {
        // Opening from the left edge
        const newX = -width + event.translationX;
        sidebarTranslateX.set(Math.min(Math.max(newX, -width), 0));
      } else {
        // Closing from anywhere
        const newX = event.translationX;
        sidebarTranslateX.set(Math.max(Math.min(newX, 0), -width));
      }
    })
    .onEnd((event) => {
      if (!gestureActive.get()) return;

      // Simplified logic based on position threshold
      const shouldOpen = sidebarTranslateX.get() > -width * 0.4;
      const targetX = shouldOpen ? 0 : -width;

      sidebarTranslateX.set(withSpring(targetX, {
        damping: 20,
        stiffness: 200,
      }));
      runOnJS(setIsSideNavOpen)(shouldOpen);

      gestureActive.set(false);
    })
    .onFinalize(() => {
      gestureActive.set(false);
    });

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarTranslateX.get() }],
  }));

  const overlayStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      sidebarTranslateX.get(),
      [-width, 0],
      [0, 0.6],
      Extrapolate.CLAMP
    );

    return {
      opacity: progress,
      display: progress > 0 ? 'flex' : 'none',
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#18181b' }}>
          
          <View style={styles.header}>
            {isMobile && (
              <TouchableOpacity onPress={openSideNav} style={styles.menuButton} accessibilityLabel="Open menu">
                <Menu color="white" size={24} />
              </TouchableOpacity>
            )}
            <Image 
              source={require('@/assets/images/app-logos/handypal-high-resolution-logo-png-dark-mode.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>

          {/* Content with Swipe Detection */}
          <GestureDetector gesture={swipeGesture}>
            <View style={{ flex: 1, backgroundColor: 'transparent' }}>
              {isWeb && !isMobile ? (
                // Desktop Layout
                <View style={styles.desktopContainer}>
                  <View style={styles.widthTwenty}>
                    <UserSideNav user={currentUser} />
                  </View>
                  <View style={[styles.widthFiftyFive, styles.bordered]}>
                    <HomeFeed key={initialGroup} initialGroup={initialGroup} />
                  </View>
                  <View style={styles.widthTwentyFive}>
                    {selectedConversation ? (
                      <ChatPage conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
                    ) : (
                      <InboxPage onSelectConversation={setSelectedConversation} />
                    )}
                  </View>
                </View>
              ) : (
                // Mobile Layout
                <View style={{ flex: 1 }}>
                  <HomeFeed key={initialGroup} initialGroup={initialGroup} />
                </View>
              )}
            </View>
          </GestureDetector>

          {/* Side Navigation */}
          {isMobile && (
            <Animated.View style={[styles.sideNav, sidebarStyle]}>
              <UserSideNav user={currentUser} onNavigate={closeSideNav} onClose={closeSideNav} />
            </Animated.View>
          )}

          {/* Overlay */}
          {isMobile && (
            <Animated.View style={[styles.overlay, overlayStyle]}>
              <TouchableOpacity 
                style={{ flex: 1 }} 
                onPress={closeSideNav}
                activeOpacity={1}
              />
            </Animated.View>
          )}
        </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#18181b',
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
  },
  menuButton: {
    padding: 8,
    marginRight: 8,
  },
  logo: {
    width: 175,
    height: 50,
  },
  desktopContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  widthTwenty: {
    width: '20%',
  },
  widthFiftyFive: {
    width: '55%',
  },
  widthTwentyFive: {
    width: '25%',
  },
  bordered: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#3f3f46',
  },
  sideNav: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#18181b',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    zIndex: 999,
  },
});