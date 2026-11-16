import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.06)',
  },
  segment: {
    flex: 1,
    minWidth: 0,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  // Выбранный — белый в тёмной рамке, как выбранный день на графике.
  segmentActive: {
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 2px 8px rgba(26, 26, 46, 0.08)',
  },
  label: {
    flexShrink: 1,
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  labelActive: {
    fontFamily: theme.fonts.semibold,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  // Аватары всех детей внахлёст в белой обводке.
  stack: {
    flexDirection: 'row',
  },
  stacked: {
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  overlap: {
    marginLeft: -9,
  },
});
