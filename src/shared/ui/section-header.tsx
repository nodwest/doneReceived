import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme, tracking } from '../theme';

type SectionHeaderProps = {
  title: string;
  /** Ссылка справа, например «See all». */
  actionLabel?: string;
  onAction?: () => void;
};

/** Заголовок секции экрана со ссылкой справа. */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && (
        <Pressable accessibilityRole="link" hitSlop={8} onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  action: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.violet,
  },
});
