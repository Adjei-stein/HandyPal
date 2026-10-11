import CustomTabBar from '@/components/CustomTabBar';
import { palette } from '@/constants/theme';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AppLayout() {
  return (
    // The tab bar handles the bottom inset itself.
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: palette.background }}>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="explore" />
        <Stack.Screen name="post" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="profile" />
      </Stack>
      <CustomTabBar />
    </SafeAreaView>
  );
}
