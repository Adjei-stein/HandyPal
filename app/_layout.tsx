import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { useFonts } from 'expo-font';
import { NavigationBar } from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ListingsProvider } from '@/context/ListingsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const color = colorScheme === 'dark' ? '#18181b' : '#fff';
    SystemUI.setBackgroundColorAsync(color);
  }, [colorScheme]);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ListingsProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="listing/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        {/* Android is edge-to-edge: the system bars are transparent over the screen, so only their content colour is set. */}
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <NavigationBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </ListingsProvider>
  );
}