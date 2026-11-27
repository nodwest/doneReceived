import { vi } from 'vitest';

// Нативные модули, без которых не поднимаются переводы (`@shared/i18n`):
// язык интерфейса в тестах — английский, хранилище выбора — в памяти.
vi.mock('react-native-mmkv', () => ({
  createMMKV: () => {
    const values = new Map<string, string>();
    return {
      getString: (key: string) => values.get(key),
      set: (key: string, value: string) => values.set(key, value),
    };
  },
}));

vi.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en' }],
}));
