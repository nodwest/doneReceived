import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
// Инициализация i18next до первого рендера.
import '@shared/i18n';
import './font-rendering';
import { useSessionStore } from '@entities/session';
import { ToastHost } from '@shared/ui';
import { Providers } from './providers';

export function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Сохранённая сессия: токен для запросов к API после перезапуска.
  useEffect(() => {
    useSessionStore.getState().restore();
  }, []);

  if (!fontsLoaded && !fontsError) return null;

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="create-task"
          options={{ presentation: 'modal', gestureEnabled: true }}
        />
        <Stack.Screen
          name="edit-task"
          options={{ presentation: 'modal', gestureEnabled: true }}
        />
      </Stack>
      <ToastHost />
    </Providers>
  );
}
