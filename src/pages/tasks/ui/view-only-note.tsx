import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme, tracking } from '@shared/theme';
import { Icon } from '@shared/ui';

type ViewOnlyNoteProps = {
  /** Родитель, который создал задание. */
  author: string;
  /** На проверке — «подтвердить», активное — «изменить или отменить». */
  review: boolean;
};

/**
 * Низ карточки чужого задания: второй родитель его только видит (чтобы знать,
 * какие задания уже есть, и не создать такое же). Подтверждает, выплачивает,
 * правит и отменяет задание только тот, кто его создал.
 */
export function ViewOnlyNote({ author, review }: ViewOnlyNoteProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.note}>
      <Icon name="lock" size={18} color={theme.colors.grey} />
      <Text style={styles.text}>
        {review
          ? t('tasks.onlyAuthorApproves', { name: author })
          : t('tasks.onlyAuthorEdits', { name: author })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flex: 1,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.prime,
  },
  text: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    lineHeight: 19,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.inkSoft,
  },
});
