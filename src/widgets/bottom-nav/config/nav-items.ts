import type { Href } from 'expo-router';
import type { IconName } from '@shared/ui';

export type BottomNavItem = {
  key: string;
  label: string;
  icon: IconName;
  href: Href;
};

export const NAV_ITEMS: readonly BottomNavItem[] = [
  { key: 'home', label: 'Home', icon: 'home', href: '/' },
  { key: 'tasks', label: 'Tasks', icon: 'tasks', href: '/registration' },
  { key: 'family', label: 'Family', icon: 'children', href: '/login' },
  { key: 'wallet', label: 'Wallet', icon: 'wallet', href: '/role-select' },
  { key: 'map', label: 'Map', icon: 'map', href: '/map' },
  { key: 'profile', label: 'Profile', icon: 'profile', href: '/profile' },
];
