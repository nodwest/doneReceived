import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  shadow: {
    borderRadius: 20,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.08)',
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  // Низ карточки: устройства ребёнка под тонкой чертой.
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.childTintBorder,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  initial: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.violetSoft,
  },
  initialText: {
    fontSize: 24,
    letterSpacing: tracking(24),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
  subtitle: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  you: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: theme.colors.violetSoft,
  },
  youText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.violet,
  },
  stats: {
    alignItems: 'flex-end',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: theme.colors.prime,
  },
  chipReview: {
    backgroundColor: theme.colors.reviewChip,
  },
  chipValue: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  chipLabel: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  chipReviewText: {
    color: theme.colors.reviewChipText,
  },
});
