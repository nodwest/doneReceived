import type { IconName } from '@shared/ui';

export type BottomNavItem = {
  key: string;
  label: string;
  icon: IconName;
};

export const NAV_ITEMS: readonly BottomNavItem[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'tasks', label: 'Tasks', icon: 'tasks' },
  { key: 'children', label: 'Children', icon: 'children' },
  { key: 'wallet', label: 'Wallet', icon: 'wallet' },
  { key: 'profile', label: 'Profile', icon: 'profile' },
];
