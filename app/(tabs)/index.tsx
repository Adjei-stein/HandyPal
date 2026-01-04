import { Menu } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatPage from '@/components/ChatPage';
import InboxPage from '@/components/InboxPage';
import Jobs from '@/components/Jobs';
import MarketPlace from '@/components/MarketPlace';
import UserSideNav from '@/components/userSideNav';
import "../../global.css";

const generateDummyProfile = () => {
  return {
    name: 'John Doe',
    bio: 'Handyman with 5 years of experience',
    location: 'New York, NY',
    skills: ['Plumbing', 'Electrical', 'Carpentry'],
    rating: 4.8,
    completedJobs: 42,
    profileImage: require('@/assets/images/adaptive-icon.png')
  };
};

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isMobile = width < 768;
  const dummyProfile = generateDummyProfile();
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  // Side nav state
  const sidebarTranslateX = useSharedValue(-width);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const gestureActive = useSharedValue(false);

  const openSideNav = () => {
    sidebarTranslateX.value = withSpring(0, { 
      damping: 20, 
      stiffness: 200 
    });
    setIsSideNavOpen(true);
  };

  const closeSideNav = () => {
    sidebarTranslateX.value = withSpring(-width, { 
      damping: 20, 
      stiffness: 200 
    });
    setIsSideNavOpen(false);
  };

  // Swipe gesture for side nav
  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // More lenient horizontal activation
    .failOffsetY([-15, 15])   // Strict vertical failure
    .onBegin((event) => {
      // Only activate if the gesture starts on the left edge
      if (event.absoluteX < 60) {
        gestureActive.value = true;
      }
    })
    .onUpdate((event) => {
      if (!gestureActive.value) return;

      if (!isSideNavOpen) {
        // Opening from the left edge
        const newX = -width + event.translationX;
        sidebarTranslateX.value = Math.min(Math.max(newX, -width), 0);
      } else {
        // Closing from anywhere
        const newX = event.translationX;
        sidebarTranslateX.value = Math.max(Math.min(newX, 0), -width);
      }
    })
    .onEnd((event) => {
      if (!gestureActive.value) return;

      // Simplified logic based on position threshold
      const shouldOpen = sidebarTranslateX.value > -width * 0.4;
      const targetX = shouldOpen ? 0 : -width;

      sidebarTranslateX.value = withSpring(targetX, {
        damping: 20,
        stiffness: 200,
      });
      runOnJS(setIsSideNavOpen)(shouldOpen);

      gestureActive.value = false;
    })
    .onFinalize(() => {
      gestureActive.value = false;
    });

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarTranslateX.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      sidebarTranslateX.value,
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
              <TouchableOpacity onPress={openSideNav} style={styles.menuButton}>
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
                    <UserSideNav 
                      avatarColor="bg-blue-500"
                      name={dummyProfile.name}
                      handle="handyman"
                    />
                  </View>
                  <View style={[styles.widthFiftyFive, styles.bordered]}>
                    <Jobs />
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
                  <Jobs />
                </View>
              )}
            </View>
          </GestureDetector>

          {/* Side Navigation */}
          {isMobile && (
            <Animated.View style={[styles.sideNav, sidebarStyle]}>
              <SafeAreaView style={{ flex: 1 }}>
                <UserSideNav
                  avatarColor="bg-blue-500"
                  name={dummyProfile.name}
                  handle="handyman"
                />
              </SafeAreaView>
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
    width: '75%',
    backgroundColor: '#18181b',
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