import { Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { Providers } from './providers';
import './styles/app.css';

export function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded && !fontsError) return null;

  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }} />
    </Providers>
  );
}
