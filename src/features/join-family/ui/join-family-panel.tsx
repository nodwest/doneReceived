import { Text, View } from 'react-native';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { GradientButton, RoundButton } from '@shared/ui';
import { useInviteCode } from '../model/use-invite-code';
import { useJoinFamily } from '../model/use-join-family';
import { InviteCodeField } from './invite-code-field';
import { styles } from './join-family-panel.styled';

type JoinFamilyPanelProps = {
  onClose: () => void;
};

/** Сервер не пустил: уже в семье — своё сообщение, остальное — общее. */
function joinError(error: unknown) {
  const code =
    isApiError(error) && error.data && typeof error.data === 'object'
      ? (error.data as { code?: unknown }).code
      : null;
  if (code === 'ALREADY_IN_FAMILY') return 'alreadyInFamily' as const;
  if (isApiError(error) && error.status === 0) return 'network' as const;
  return 'failed' as const;
}

/**
 * Панель вступления в другую семью родителем: поле кода второго родителя,
 * плашка найденной семьи и кнопка Join family. Общая для вкладки Family и
 * профиля; крестик и успешное вступление закрывают её.
 */
export function JoinFamilyPanel({ onClose }: JoinFamilyPanelProps) {
  const { t } = useTranslation();
  const state = useInviteCode();
  const { mutate, isPending } = useJoinFamily();

  const join = () => {
    const familyName = state.invite?.familyName ?? '';
    mutate(state.code, {
      onSuccess: () => {
        showToast(
          t('joinFamily.joined', {
            family: t('joinFamily.familyName', { name: familyName }),
          }),
        );
        onClose();
      },
      onError: (error) => showToast(t(`joinFamily.errors.${joinError(error)}`)),
    });
  };

  return (
    <View style={styles.panel}>
      <View style={styles.head}>
        <Text style={styles.title}>{t('joinFamily.title')}</Text>
        <RoundButton
          size="sm"
          icon="close"
          accessibilityLabel={t('common.close')}
          onPress={onClose}
        />
      </View>
      <Text style={styles.hint}>{t('joinFamily.hint')}</Text>
      <InviteCodeField state={state} hint={t('joinFamily.parentCodeHint')} />
      <GradientButton
        label={t('joinFamily.join')}
        onPress={join}
        disabled={!state.invite || isPending}
      />
    </View>
  );
}
