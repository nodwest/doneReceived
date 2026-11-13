import { Redirect, useLocalSearchParams } from 'expo-router';
import { ServerChildProfile } from './server-child-profile';

/**
 * Профиль ребёнка семьи (/child/[id], id — UUID профиля): баланс, задания,
 * итоги и последние награды — с сервера.
 */
export function ChildProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return <Redirect href="/" />;
  return <ServerChildProfile id={id} />;
}
