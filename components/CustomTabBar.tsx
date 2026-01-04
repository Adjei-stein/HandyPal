import { useRouter, useSegments } from 'expo-router';
import { Briefcase, Home, Search } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CustomTabBar = () => {
  const router = useRouter();
  const segments = useSegments();
  const activeRoute = segments[segments.length - 1];

  const tabs = [
    { name: 'index', label: 'Home', icon: Home },
    { name: 'explore', label: 'Explore', icon: Search },
    { name: 'jobs', label: 'Jobs', icon: Briefcase },
  ];

  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.replace(`/${tab.name}` as any)}
          >
            <tab.icon color={isActive ? '#3b82f6' : 'white'} size={24} />
            <Text style={[styles.label, { color: isActive ? '#3b82f6' : 'white' }]}>
              {tab.label}
            </Text>
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
    backgroundColor: '#18181b',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTabBar;