import { useColorScheme as useRNColorScheme } from 'react-native';

/** React Native can also report 'unspecified' or null; treat those as light. */
export function useColorScheme(): 'light' | 'dark' {
  return useRNColorScheme() === 'dark' ? 'dark' : 'light';
}
