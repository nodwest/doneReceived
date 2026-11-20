import { Redirect, useLocalSearchParams } from 'expo-router';
import { ServerChildProfile } from './server-child-profile';
import { useTheme } from '@shared/theme';

/**
 * Профиль ребёнка семьи (/child/[id], id — UUID профиля): баланс, задания,
 * итоги и последние награды — с сервера.
 */
export function ChildProfilePage() {
  useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return <Redirect href="/" />;
  return <ServerChildProfile id={id} />;
}
