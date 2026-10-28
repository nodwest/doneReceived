import { Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { GradientButton, RoundButton } from '@shared/ui';
import { useInviteCode } from '../model/use-invite-code';
import { useJoinFamily } from '../model/use-join-family';
import { InviteCodeField } from './invite-code-field';
import { styles } from './join-family-panel.styled';

/**
 * Панель вступления родителя в другую семью: поле кода, плашка найденной
 * семьи и кнопка Join family. Общая для вкладки Family (кнопка Join family)
 * и профиля (пункт Join family); крестик и успешное вступление закрывают её.
 */
export function JoinFamilyPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const state = useInviteCode('parent');
  const { mutate, isPending } = useJoinFamily();

  const join = () =>
    mutate(state.code, {
      onSuccess: ({ familyName }) => {
        showToast(
          t('joinFamily.joined', {
            family: t('joinFamily.familyName', { name: familyName }),
          }),
        );
        onClose();
      },
    });

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
