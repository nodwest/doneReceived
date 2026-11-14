import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme, tracking } from '@shared/theme';
import { BottomSheet, Icon, PillButton } from '@shared/ui';

type ResetInviteCodeSheetProps = {
  visible: boolean;
  /** Код, который погаснет, в виде XXXX-XXXX. */
  code: string;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Подтверждение сброса кода: старый код сразу перестанет работать. */
export function ResetInviteCodeSheet({
  visible,
  code,
  onCancel,
  onConfirm,
}: ResetInviteCodeSheetProps) {
  const { t } = useTranslation();
  // Код в тексте выделяем: делим переведённую строку по нему.
  const [before, after = ''] = t('resetInviteCode.subtitle', { code }).split(
    code,
  );
  return (
    <BottomSheet visible={visible} onClose={onCancel}>
      <View style={styles.body}>
        <View style={styles.icon}>
          <Icon name="refresh" size={24} color={theme.colors.dangerText} />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>{t('resetInviteCode.title')}</Text>
          <Text style={styles.subtitle}>
            {before}
            <Text style={styles.code}>{code}</Text>
            {after}
          </Text>
        </View>
        <View style={styles.actions}>
          <PillButton
            label={t('common.cancel')}
            variant="ghost"
            onPress={onCancel}
          />
          <PillButton
            label={t('resetInviteCode.confirm')}
            variant="danger"
            onPress={onConfirm}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.dangerSoft,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  code: {
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 12,
  },
});
