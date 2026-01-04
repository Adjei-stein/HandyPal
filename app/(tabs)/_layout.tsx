import CustomTabBar from '@/components/CustomTabBar';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
        <Stack.Screen name="jobs" options={{ headerShown: false }} />
      </Stack>
      <CustomTabBar />
    </SafeAreaView>
  );
}