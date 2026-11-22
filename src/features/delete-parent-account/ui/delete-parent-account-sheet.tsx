import { Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { createStyles, theme, tracking, useTheme } from '@shared/theme';
import { BottomSheet, InputWithIcon, Label, PillButton } from '@shared/ui';

type DeleteParentAccountSheetProps = {
  visible: boolean;
  password: string;
  wrongPassword: boolean;
  deleting: boolean;
  onChangePassword: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Подтверждение удаления аккаунта родителя: пароль остаётся в состоянии
 * страницы, шторка его только показывает. Пока идёт запрос, шторка не
 * закрывается и кнопка не нажимается второй раз.
 */
export function DeleteParentAccountSheet({
  visible,
  password,
  wrongPassword,
  deleting,
  onChangePassword,
  onClose,
  onConfirm,
}: DeleteParentAccountSheetProps) {
  useTheme();
  const { t } = useTranslation();
  const close = () => {
    if (!deleting) onClose();
  };
  return (
    <BottomSheet visible={visible} onClose={close} maxHeightRatio={0.65}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            {t('deleteAccount.parent.passwordTitle')}
          </Text>
          <Text style={styles.subtitle}>
            {t('deleteAccount.parent.passwordMessage')}
          </Text>
        </View>
        <View style={styles.field}>
          <Label htmlFor="delete-account-password" style={styles.label}>
            {t('deleteAccount.parent.passwordLabel')}
          </Label>
          <InputWithIcon
            secureTextEntry
            id="delete-account-password"
            placeholder={t('deleteAccount.parent.passwordPlaceholder')}
            iconName="castle"
            value={password}
            onChangeText={onChangePassword}
            error={wrongPassword}
            editable={!deleting}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={onConfirm}
          />
          {wrongPassword ? (
            <Text accessibilityLiveRegion="polite" style={styles.error}>
              {t('deleteAccount.parent.wrongPassword')}
            </Text>
          ) : null}
        </View>
        <View style={styles.actions}>
          <PillButton
            label={t('deleteAccount.parent.confirm')}
            variant="danger"
            onPress={onConfirm}
            disabled={deleting || !password}
          />
          <PillButton
            label={t('common.cancel')}
            variant="ghost"
            onPress={close}
            disabled={deleting}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = createStyles((colors) => ({
  body: {
    gap: 16,
    paddingTop: 8,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  error: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.dangerText,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
}));
