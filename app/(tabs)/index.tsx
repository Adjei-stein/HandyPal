import { Platform, StyleSheet } from 'react-native';


import "../../global.css";


import ChatPage from '@/components/ChatPage';
import InboxPage from '@/components/InboxPage';
import Jobs from '@/components/Jobs';
import Posts from '@/components/Posts';
import NavigationBar from '@/components/Navigationbar';
import UserProfile from '@/components/userProfile';
import MarketPlace from '@/components/MarketPlace';
import UserSideNav from '@/components/userSideNav';
import { useState } from 'react';
import { Image, useWindowDimensions, View } from 'react-native';

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

  return (
    <View className='w-full flex-1 bg-zinc-900'>

      <View className="w-full my-2 p-2">
        <Image source={require('@/assets/images/app-logos/handypal-high-resolution-logo-png-dark-mode.png')} style={{width: 175, height: 50, margin: 10}} />
      </View>
      <View className="flex-1 " style={styles.mainContainer}>
        {isWeb && !isMobile ? (
          <View className="flex-row w-full justify-center">
            <View className="w-1/4" style={styles.widthTwentyFive}><UserSideNav 
              avatarColor="bg-blue-500"
              name={dummyProfile.name}
              handle="handyman"
              /* bio={dummyProfile.bio}
              location={dummyProfile.location}
              skills={dummyProfile.skills}
              followers={42}
              following={24}
              posts={15}
              joinDate="Jan 2023"
              status="Available"
              rate="$50/hr"
              availability="Weekdays" */
            /></View>
            <View className="w-2/4 border-solid border-l border-r border-zinc-700 border-b-0 border-t-0" style={[styles.widthFifty, {borderLeftWidth: 1, borderRightWidth: 1}]}><Jobs /></View>
            <View className="w-1/4" style={styles.widthTwentyFive}>
              {selectedConversation ? (
                <ChatPage conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
              ) : (
                <InboxPage onSelectConversation={setSelectedConversation} />
              )}
            </View>
          </View>
        ) : (
          <View className="w-full">
            <MarketPlace />
          </View>
        )}

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  widthTwentyFive: {
    width: '25%',
  },
  widthFifty: {
    width: '50%',
  }
});


/* export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
}); */