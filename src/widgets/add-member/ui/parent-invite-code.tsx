import { Text, View } from 'react-native';
import {
  formatInviteCode,
  useCurrentFamily,
  useParentInvite,
} from '@entities/family';
import { useTranslation } from '@shared/i18n';
import { useNow } from '@shared/lib';
import { CopyableCode } from '@shared/ui';
import { styles } from './parent-invite-code.styled';

/**
 * Код для второго родителя в «Add family member». Компонент есть, только
 * пока панель открыта, — значит, родитель хочет пригласить: тогда и
 * просим код у сервера. Сколько код живёт, человеку не показываем: истёк
 * при открытой панели — `useParentInvite` сам запрашивает новый, и на
 * месте старого появляется актуальный.
 */
export function ParentInviteCode() {
  const { t } = useTranslation();
  const family = useCurrentFamily();
  const { data, isError } = useParentInvite(family?.id ?? null, true);
  const now = useNow(1000);

  if (!family) return null;

  // Истёкший код (новый ещё в пути) не показываем: его уже не примут.
  const alive = !!data && new Date(data.expiresAt).getTime() > now.getTime();
  if (alive) return <CopyableCode code={formatInviteCode(data.parentCode)} />;

  // Та же высота, что у CopyableCode: пока код грузится, блок не прыгает.
  return (
    <View style={styles.placeholder}>
      <Text style={[styles.placeholderText, isError && styles.error]}>
        {isError ? t('inviteCodes.parent.failed') : ' '}
      </Text>
    </View>
  );
}
