import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
// Инициализация i18next до первого рендера.
import '@shared/i18n';
import './font-rendering';
import { useMyFamilies } from '@entities/family';
import { useSessionStore } from '@entities/session';
import { useViewerRoleStore } from '@entities/user';
import { theme } from '@shared/theme';
import { ToastHost } from '@shared/ui';
import { Providers } from './providers';

// Экраны входа: пока не вошли. Первый из них — куда попадаем без входа.
const AUTH_SCREENS = ['login', 'role-select', 'registration', 'verify-email'];

// Родитель вошёл, но семьи у аккаунта нет: только создать или вступить.
const FAMILY_SETUP_SCREEN = 'family-setup';

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

  if (!fontsLoaded && !fontsError) return null;
  // Пока читаем сессию, не знаем, куда пускать: ничего не показываем.
  if (sessionStatus === 'restoring') return null;

  return (
    <Providers>
      <Screens
        signedIn={sessionStatus === 'signed-in'}
        childEntered={childEntered}
      />
      <ToastHost />
    </Providers>
  );
}

type ScreensProps = {
  signedIn: boolean;
  /** Временный пропуск ребёнка без аккаунта: семью не проверяем. */
  childEntered: boolean;
};

/**
 * Какие экраны открыты. Без входа — только экраны входа. После входа
 * родителя сначала узнаём его семьи (GET /families): семьи нет — открыт
 * только Family setup, есть — приложение. Закрытый экран уводит на первый
 * открытый, поэтому после создания семьи приложение само уходит на главную.
 */
function Screens({ signedIn, childEntered }: ScreensProps) {
  const families = useMyFamilies(signedIn);
  const entered = signedIn || childEntered;
  const needsFamily = signedIn && families.data?.length === 0;
  // Список семей ещё грузится: стек не снимаем (идёт навигация после
  // логина), а закрываем экраном фона, чтобы главная не мигнула.
  const checkingFamily = signedIn && families.isPending;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!entered}>
          {AUTH_SCREENS.map((name) => (
            <Stack.Screen key={name} name={name} />
          ))}
        </Stack.Protected>
        <Stack.Protected guard={needsFamily}>
          <Stack.Screen name={FAMILY_SETUP_SCREEN} />
        </Stack.Protected>
        <Stack.Protected guard={entered && !needsFamily}>
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
      {checkingFamily && <View style={screensStyles.cover} />}
    </>
  );
}

const screensStyles = StyleSheet.create({
  cover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.colors.prime,
  },
});
