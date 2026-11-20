import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  away: {
    backgroundColor: colors.line,
  },
  text: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.semibold,
  },
  homeText: {
    color: colors.homeBrown,
  },
  awayText: {
    color: colors.inkSoft,
  },
  compact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 4,
    rowGap: 2,
  },
  compactPart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Вложенный Text не поддерживает opacity на нативе — прячем цветом.
  hidden: {
    color: 'transparent',
  },
  compactText: {
    flexShrink: 1,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.semibold,
  },
  compactAway: {
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
}));
