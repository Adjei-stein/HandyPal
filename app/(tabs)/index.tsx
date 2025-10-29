import { Platform, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { 
  Gesture, 
  GestureDetector, 
  GestureHandlerRootView, 
  ScrollView
} from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Image, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Menu } from 'lucide-react-native';

import "../../global.css";
import ChatPage from '@/components/ChatPage';
import InboxPage from '@/components/InboxPage';
import Jobs from '@/components/Jobs';
import MarketPlace from '@/components/MarketPlace';
import UserSideNav from '@/components/userSideNav';

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

  // DEBUG: Add console logs to see what's happening
  React.useEffect(() => {
    console.log('Sidebar X position:', sidebarTranslateX.value);
    console.log('Is side nav open:', isSideNavOpen);
  }, [isSideNavOpen]);

  // Simple and direct real-time swipe gesture
  const swipeGesture = Gesture.Pan()
    .minDistance(5) // Minimum distance to activate
    .onBegin((event) => {
      console.log('Gesture began at X:', event.absoluteX);
      // Always allow gesture to start, we'll filter in onUpdate
      gestureActive.value = true;
    })
    .onUpdate((event) => {
      if (!gestureActive.value) return;
      
      console.log('Gesture updating - translationX:', event.translationX, 'absoluteX:', event.absoluteX);
      
      // For opening: start from left edge
      if (!isSideNavOpen && event.absoluteX < 50) {
        // Convert translation to sidebar position
        // Start from -width (fully closed) and move toward 0 (fully open)
        const newX = -width + event.translationX;
        sidebarTranslateX.value = Math.min(Math.max(newX, -width), 0);
      }
      // For closing: when sidebar is already open
      else if (isSideNavOpen) {
        // Start from 0 (fully open) and move toward -width (fully closed)
        const newX = event.translationX; // This will be negative when swiping left
        sidebarTranslateX.value = Math.max(Math.min(newX, 0), -width);
      }
    })
    .onEnd((event) => {
      console.log('Gesture ended - translationX:', event.translationX, 'velocityX:', event.velocityX);
      
      if (!gestureActive.value) return;
      
      const currentX = sidebarTranslateX.value;
      const threshold = width * 0.3; // 30% threshold
      const velocity = event.velocityX;
      
      let targetX;
      
      if (isSideNavOpen) {
        // Closing logic
        const shouldClose = currentX < -threshold || velocity < -300;
        targetX = shouldClose ? -width : 0;
        runOnJS(setIsSideNavOpen)(!shouldClose);
      } else {
        // Opening logic  
        const shouldOpen = currentX > -width + threshold || velocity > 300;
        targetX = shouldOpen ? 0 : -width;
        runOnJS(setIsSideNavOpen)(shouldOpen);
      }
      
      sidebarTranslateX.value = withSpring(targetX, { 
        damping: 20, 
        stiffness: 200 
      });
      
      gestureActive.value = false;
    })
    .onFinalize(() => {
      gestureActive.value = false;
    });

  // Sidebar animation style
  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sidebarTranslateX.value }],
  }));

  // Overlay animation - follows sidebar position
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
        
        {/* Main Content - Always stays in place */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            {isMobile && (
              <TouchableOpacity onPress={openSideNav} style={styles.menuButton}>
                <Menu color="white" size={24} />
              </TouchableOpacity>
            )}
            <Image 
              source={require('@/assets/images/app-logos/handypal-high-resolution-logo-png-dark-mode.png')} 
              style={styles.logo} 
            />
          </View>

          {/* Content Area with Swipe Detection - Make sure this covers the entire screen */}
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
                // Mobile Layout - MarketPlace
                <View style={{ flex: 1 }}>
                  <MarketPlace />
                </View>
              )}
            </View>
          </GestureDetector>
        </View>

        {/* Side Navigation - Slides OVER the content */}
        {isMobile && (
          <Animated.View style={[styles.sideNav, sidebarStyle]}>
            <UserSideNav
              avatarColor="bg-blue-500"
              name={dummyProfile.name}
              handle="handyman"
            />
          </Animated.View>
        )}

        {/* Overlay - Darkens based on sidebar position */}
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