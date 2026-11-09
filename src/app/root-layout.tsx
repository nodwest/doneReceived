import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
// Инициализация i18next до первого рендера.
import '@shared/i18n';
import './font-rendering';
import { useSessionStore } from '@entities/session';
import { useViewerRoleStore } from '@entities/user';
import { ToastHost } from '@shared/ui';
import { Providers } from './providers';

// Экраны входа: пока не вошли. Первый из них — куда попадаем без входа.
const AUTH_SCREENS = ['login', 'role-select', 'registration', 'verify-email'];

// Экраны приложения: после входа родителя или ребёнка по коду. Новый роут
// добавляйте сюда, иначе он откроется и без входа.
const APP_SCREENS = [
  'index',
  'tasks',
  'family',
  'wallet',
  'profile',
  'edit-profile',
  'map',
  'rewards-history',
  'transactions',
  'child/[id]/index',
  'child/[id]/tasks',
  'child/[id]/wishlist/index',
  'child/[id]/wishlist/[wishId]',
  'parent/[id]/index',
  'parent/[id]/tasks',
  'wishlist/index',
  'wishlist/[id]',
];

const restoreSession = async () => {
  await useSessionStore.getState().restore();
  // Вошедший раньше родитель смотрит приложение от своего лица.
  if (useSessionStore.getState().status === 'signed-in') {
    useViewerRoleStore.getState().setRole('parent');
  }
};

export function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Сохранённая сессия: вошли ли раньше и токен для запросов к API.
  useEffect(() => {
    restoreSession();
  }, []);

  const sessionStatus = useSessionStore((state) => state.status);
  const childEntered = useViewerRoleStore((state) => state.childEntered);
  const entered = sessionStatus === 'signed-in' || childEntered;

  if (!fontsLoaded && !fontsError) return null;
  // Пока читаем сессию, не знаем, куда пускать: ничего не показываем.
  if (sessionStatus === 'restoring') return null;

  return (
    <Providers>
      {/* Без входа открыты только экраны входа, после входа — только
          приложение: закрытый экран уводит на первый открытый. */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!entered}>
          {AUTH_SCREENS.map((name) => (
            <Stack.Screen key={name} name={name} />
          ))}
        </Stack.Protected>
        <Stack.Protected guard={entered}>
          {APP_SCREENS.map((name) => (
            <Stack.Screen key={name} name={name} />
          ))}
          <Stack.Screen
            name="create-task"
            options={{ presentation: 'modal', gestureEnabled: true }}
          />
          <Stack.Screen
            name="edit-task"
            options={{ presentation: 'modal', gestureEnabled: true }}
          />
        </Stack.Protected>
      </Stack>
      <ToastHost />
    </Providers>
  );
}
