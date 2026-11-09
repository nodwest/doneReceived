import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme, tracking } from '@shared/theme';
import { BottomSheet, Icon, PillButton } from '@shared/ui';

type CancelTaskSheetProps = {
  visible: boolean;
  title: string;
  childName: string;
  onKeep: () => void;
  onConfirm: () => void;
};

/** Подтверждение отмены задания: отменённое не вернуть. */
export function CancelTaskSheet({
  visible,
  title,
  childName,
  onKeep,
  onConfirm,
}: CancelTaskSheetProps) {
  const { t } = useTranslation();
  return (
    <BottomSheet visible={visible} onClose={onKeep}>
      <View style={styles.body}>
        <View style={styles.icon}>
          <Icon name="trash" size={24} color={theme.colors.dangerText} />
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>{t('cancelTask.title')}</Text>
          <Text style={styles.subtitle}>
            {t('cancelTask.subtitle', { title, name: childName })}
          </Text>
        </View>
        <View style={styles.actions}>
          <PillButton
            label={t('cancelTask.keep')}
            variant="ghost"
            size="md"
            onPress={onKeep}
          />
          <PillButton
            label={t('cancelTask.confirm')}
            variant="danger"
            size="md"
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
  actions: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 12,
  },
});
