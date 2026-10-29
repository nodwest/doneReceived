import { Text, View } from 'react-native';
import type { InviteRole } from '@entities/family';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { GradientButton, RoundButton } from '@shared/ui';
import { useInviteCode } from '../model/use-invite-code';
import { useJoinFamily } from '../model/use-join-family';
import { InviteCodeField } from './invite-code-field';
import { styles } from './join-family-panel.styled';

type JoinFamilyPanelProps = {
  onClose: () => void;
  /** Кем вступаем: родитель по родительскому коду, ребёнок — по детскому. */
  role?: InviteRole;
};

/**
 * Панель вступления в другую семью: поле кода, плашка найденной семьи и
 * кнопка Join family. Общая для вкладки Family (кнопка Join family) и
 * профиля (пункт Join family, у ребёнка — с ролью child); крестик и
 * успешное вступление закрывают её.
 */
export function JoinFamilyPanel({
  onClose,
  role = 'parent',
}: JoinFamilyPanelProps) {
  const { t } = useTranslation();
  const state = useInviteCode(role);
  const isChild = role === 'child';
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
      <Text style={styles.hint}>
        {t(isChild ? 'joinFamily.childHint' : 'joinFamily.hint')}
      </Text>
      <InviteCodeField
        state={state}
        hint={t(
          isChild ? 'joinFamily.childCodeHint' : 'joinFamily.parentCodeHint',
        )}
      />
      <GradientButton
        label={t('joinFamily.join')}
        onPress={join}
        disabled={!state.invite || isPending}
      />
    </View>
  );
}
