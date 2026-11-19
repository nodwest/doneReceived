import { Platform } from 'react-native';

const NativeWebSocket = WebSocket as unknown as new (
  url: string,
  protocols: undefined,
  options: { headers: { origin: string } },
) => WebSocket;

export function openPrivateWebSocket(url: string): WebSocket {
  if (Platform.OS === 'web') return new WebSocket(url);

  // React Native defaults Origin to the API host, which the gateway rejects.
  const origin = process.env.EXPO_PUBLIC_WS_ORIGIN ?? 'https://divmaster.space';
  return new NativeWebSocket(url, undefined, { headers: { origin } });
}
