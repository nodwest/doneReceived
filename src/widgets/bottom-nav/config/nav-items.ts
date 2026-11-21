import type { Href } from 'expo-router';
import type { IconName } from '@shared/ui';

export type BottomNavItem = {
  /** Ключ вкладки; подпись — nav.<key>. */
  key:
    | 'home'
    | 'tasks'
    | 'languages'
    | 'family'
    | 'calendar'
    | 'wallet'
    | 'map'
    | 'profile';
  icon: IconName;
  href: Href;
};

export const NAV_ITEMS: readonly BottomNavItem[] = [
  { key: 'home', icon: 'home', href: '/' },
  { key: 'tasks', icon: 'tasks', href: '/tasks' },
  { key: 'languages', icon: 'book', href: '/languages' },
  { key: 'family', icon: 'children', href: '/family' },
  { key: 'calendar', icon: 'calendar', href: '/calendar' },
  { key: 'wallet', icon: 'wallet', href: '/wallet' },
  { key: 'map', icon: 'map', href: '/map' },
  { key: 'profile', icon: 'profile', href: '/profile' },
];
