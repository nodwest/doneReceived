import { useSessionKind } from '@entities/session';
import { ChildDeleteAccountPage } from './child-delete-account';
import { ParentDeleteAccountPage } from './parent-delete-account';

/**
 * Удаление своего аккаунта. У ребёнка — существующий сценарий удаления
 * профиля, у родителя — новый сценарий с deletion-preview и паролем.
 */
export function DeleteAccountPage() {
  const isChild = useSessionKind() === 'child';
  return isChild ? <ChildDeleteAccountPage /> : <ParentDeleteAccountPage />;
}
