import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    boxShadow: '0px 4px 6px rgba(26, 26, 46, 0.06)',
  },
  heroParent: {
    borderWidth: 1.5,
    borderColor: colors.reviewBorder,
  },
  name: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    letterSpacing: tracking(22),
    color: colors.white,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  },
  email: {
    fontSize: theme.fontSize.inputName,
    fontFamily: theme.fonts.medium,
    letterSpacing: tracking(theme.fontSize.inputName),
    color: colors.heroSubtle,
  },
}));
