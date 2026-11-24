import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
// Инициализация i18next до первого рендера.
import '@shared/i18n';
import './font-rendering';
import { useMyFamilies } from '@entities/family';
import {
  useSessionKind,
  useSessionStore,
  type AccountKind,
} from '@entities/session';
import { useViewerRoleStore } from '@entities/user';
import { createStyles, syncNativeAppearance, useTheme } from '@shared/theme';
import { ToastHost } from '@shared/ui';
import { Providers } from './providers';

// Экраны входа: пока не вошли. Первый из них — куда попадаем без входа.
const AUTH_SCREENS = ['login', 'role-select', 'registration', 'verify-email'];

// Родитель вошёл, но семьи у аккаунта нет: только создать или вступить.
const FAMILY_SETUP_SCREEN = 'family-setup';

// Экраны приложения: после входа родителя или ребёнка по коду подключения. Новый роут
// добавляйте сюда, иначе он откроется и без входа.
const APP_SCREENS = [
  'index',
  'tasks',
  'languages',
  'family',
  'calendar',
  'family-event/[id]',
  'wallet',
  'profile',
  'edit-profile',
  'change-password',
  'change-email',
  'delete-account',
  'map',
  'map-layers',
  'map-zone',
  'rewards-history',
  'transactions',
  'activity',
  'child/[id]/index',
  'child/[id]/tasks',
  'child/[id]/wishlist/index',
  'child/[id]/wishlist/[wishId]',
  'parent/[id]/index',
  'parent/[id]/tasks',
  'wishlist/index',
  'wishlist/[id]',
];

// Каждый экран рисует свой навбар. Переключаем вкладки без анимации стека,
// чтобы обе копии панели не накладывались друг на друга при переходе.
const TAB_SCREENS = new Set([
  'index',
  'tasks',
  'languages',
  'family',
  'calendar',
  'wallet',
  'map',
  'profile',
]);

const TAB_OPTIONS = { animation: 'none' } as const;

const restoreSession = async () => {
  await useSessionStore.getState().restore();
  // Вошедший раньше смотрит приложение от своего лица: родитель или ребёнок.
  const { session } = useSessionStore.getState();
  if (session) {
    useViewerRoleStore.getState().setRole(session.user.kind ?? 'parent');
  }
};

export function RootLayout() {
  // Подписка на тему: переключатель в профиле перерисовывает всё дерево.
  const { isDark } = useTheme();
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

  // Сохранённая тема: статус-бар, клавиатура и системные диалоги сразу в ней.
  useEffect(() => {
    syncNativeAppearance();
  }, []);

  const sessionStatus = useSessionStore((state) => state.status);
  const kind = useSessionKind();

  if (!fontsLoaded && !fontsError) return null;
  // Пока читаем сессию, не знаем, куда пускать: ничего не показываем.
  if (sessionStatus === 'restoring') return null;

  return (
    <Providers>
      {/* Статус-бар и фон стека следуют теме: система и экран не расходятся. */}
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Screens signedIn={sessionStatus === 'signed-in'} kind={kind} />
      <ToastHost />
    </Providers>
  );
}

type ScreensProps = {
  signedIn: boolean;
  /** Кто вошёл: семью проверяем только у родителя, ребёнок всегда в семье. */
  kind: AccountKind | null;
};

/**
 * Какие экраны открыты. Без входа — только экраны входа. Ребёнок (вошёл
 * кодом подключения) — сразу приложение. После входа родителя сначала
 * узнаём его семьи (GET /families): семьи нет — открыт только Family setup,
 * есть — приложение. Закрытый экран уводит на первый
 * открытый, поэтому после создания семьи приложение само уходит на главную.
 */
function Screens({ signedIn, kind }: ScreensProps) {
  // Смена темы меняет фон стека между экранами.
  const { colors } = useTheme();
  const parent = signedIn && kind === 'parent';
  const families = useMyFamilies(parent);
  const entered = signedIn;
  const needsFamily = parent && families.data?.length === 0;
  // Список семей ещё грузится: стек не снимаем (идёт навигация после
  // логина), а закрываем экраном фона, чтобы главная не мигнула.
  const checkingFamily = parent && families.isPending;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.prime },
        }}
      >
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
            <Stack.Screen
              key={name}
              name={name}
              options={TAB_SCREENS.has(name) ? TAB_OPTIONS : undefined}
            />
          ))}
          <Stack.Screen
            name="create-task"
            options={{ presentation: 'modal', gestureEnabled: true }}
          />
          <Stack.Screen
            name="edit-task"
            options={{ presentation: 'modal', gestureEnabled: true }}
          />
          <Stack.Screen
            name="create-family-event"
            options={{ presentation: 'modal', gestureEnabled: true }}
          />
          <Stack.Screen
            name="edit-family-event"
            options={{ presentation: 'modal', gestureEnabled: true }}
          />
        </Stack.Protected>
      </Stack>
      {checkingFamily && <View style={screensStyles.cover} />}
    </>
  );
}

const screensStyles = createStyles((colors) => ({
  cover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.prime,
  },
}));
