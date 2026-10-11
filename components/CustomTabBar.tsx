import { palette } from '@/constants/theme';
import { Href, useRouter, useSegments } from 'expo-router';
import { Compass, Home, MessageCircle, Plus, UserRound } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const tabs = [
  { name: 'index', href: '/', label: 'Home', icon: Home },
  { name: 'explore', href: '/explore', label: 'Explore', icon: Compass },
  { name: 'post', href: '/post', label: 'Post', icon: Plus },
  { name: 'messages', href: '/messages', label: 'Messages', icon: MessageCircle },
  { name: 'profile', href: '/profile', label: 'Profile', icon: UserRound },
] as const satisfies readonly { name: string; href: Href; label: string; icon: unknown }[];

const CustomTabBar = () => {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const last = segments[segments.length - 1];
  // The home route has no segment of its own inside the (tabs) group.
  const activeRoute = !last || last === '(tabs)' ? 'index' : last;

  // Desktop web uses the sidebar layout instead.
  if (Platform.OS === 'web' && width >= 768) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map(tab => {
        const isActive = activeRoute === tab.name;
        const color = isActive ? palette.primary : palette.textMuted;
        const isPost = tab.name === 'post';
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.navigate(tab.href)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            {isPost ? (
              <View style={styles.postButton}>
                <tab.icon color="white" size={24} />
              </View>
            ) : (
              <tab.icon color={color} size={24} />
            )}
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: palette.background,
    borderTopWidth: 1,
    borderTopColor: palette.surface,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'flex-end',
  },
  postButton: {
    backgroundColor: palette.primary,
    width: 40,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
});

export default CustomTabBar;
