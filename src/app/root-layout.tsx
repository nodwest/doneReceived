import { Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { ToastHost } from '@shared/ui';
import { Providers } from './providers';

export function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter_500Medium,
    Inter_700Bold,
  });

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
