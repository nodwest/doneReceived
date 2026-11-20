import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  container: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
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
    borderColor: colors.ink,
    backgroundColor: colors.surface,
    boxShadow: '0px 2px 8px rgba(26, 26, 46, 0.08)',
  },
  label: {
    flexShrink: 1,
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.ink,
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
    borderColor: colors.white,
  },
  overlap: {
    marginLeft: -9,
  },
}));
