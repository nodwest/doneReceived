import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  panel: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.activityHistory,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  // Точка — на уровне подписи, линия тянется до следующей точки.
  rail: {
    width: 10,
    alignItems: 'center',
  },
  lineTop: {
    width: 2,
    height: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  line: {
    flex: 1,
    width: 2,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  textGap: {
    paddingBottom: 10,
  },
  label: {
    fontSize: theme.fontSize.sm,
    lineHeight: 18,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  current: {
    fontFamily: theme.fonts.bold,
  },
  detail: {
    fontSize: theme.fontSize.xs,
    lineHeight: 15,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.inkSoft,
  },
}));
