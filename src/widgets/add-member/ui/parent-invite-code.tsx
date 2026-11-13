import { useState } from 'react';
import { Text, View } from 'react-native';
import {
  ResetInviteCodeRow,
  ResetInviteCodeSheet,
  useNewCodeGlow,
  useResetInviteCode,
} from '@features/reset-invite-code';
import {
  formatInviteCode,
  useCurrentFamily,
  useParentInvite,
} from '@entities/family';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast, useNow } from '@shared/lib';
import { CopyableCode } from '@shared/ui';
import { styles } from './parent-invite-code.styled';

/**
 * Код для второго родителя в «Add family member». Компонент есть, только
 * пока панель открыта, — значит, родитель хочет пригласить: тогда и
 * просим код у сервера. Сколько код живёт, человеку не показываем: истёк
 * при открытой панели — `useParentInvite` сам запрашивает новый, и на
 * месте старого появляется актуальный. Под кодом — Reset code: отправили
 * не тому — после подтверждения старый код гаснет, на его месте новый
 * (3 секунды зелёный и «New code is ready», без Reset code).
 */
export function ParentInviteCode() {
  const { t } = useTranslation();
  const family = useCurrentFamily();
  const familyId = family?.id ?? null;
  const { data, isError } = useParentInvite(familyId, true);
  const now = useNow(1000);
  const reset = useResetInviteCode(familyId);
  const [confirming, setConfirming] = useState(false);
  // «New code is ready» на 3 секунды вместо подсказки и Reset code.
  const { glow, appear, fresh, start } = useNewCodeGlow();

  if (!family) return null;

  // Истёкший код (новый ещё в пути) не показываем: его уже не примут.
  const alive = !!data && new Date(data.expiresAt).getTime() > now.getTime();
  if (!alive) {
    // Та же высота, что у CopyableCode: пока код грузится, блок не прыгает.
    return (
      <View style={styles.placeholder}>
        <Text style={[styles.placeholderText, isError && styles.error]}>
          {isError ? t('inviteCodes.parent.failed') : ' '}
        </Text>
      </View>
    );
  }

  const code = formatInviteCode(data.parentCode);
  const confirm = () => {
    setConfirming(false);
    reset.mutate(undefined, {
      onSuccess: start,
      onError: (error) =>
        showToast(
          t(
            isApiError(error) && error.status === 0
              ? 'resetInviteCode.errors.network'
              : 'resetInviteCode.errors.failed',
          ),
        ),
    });
  };

  return (
    <View style={styles.container}>
      <CopyableCode code={code} highlight={glow} />
      <ResetInviteCodeRow
        fresh={fresh}
        glow={glow}
        appear={appear}
        disabled={reset.isPending}
        onPress={() => setConfirming(true)}
      />
      <ResetInviteCodeSheet
        visible={confirming}
        code={code}
        onCancel={() => setConfirming(false)}
        onConfirm={confirm}
      />
    </View>
  );
}
