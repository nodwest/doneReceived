import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    height: 130,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  pressed: {
    opacity: 0.85,
  },
  child: {
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  // Чипы в два ряда: «active tasks» над «tasks to review».
  stats: {
    alignItems: 'flex-start',
    gap: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 9.5,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: theme.colors.prime,
  },
  statReview: {
    backgroundColor: theme.colors.reviewChip,
  },
  statValue: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.ink,
  },
  statReviewText: {
    color: theme.colors.reviewChipText,
  },
  homeBadge: {
    position: 'absolute',
    top: 11,
    right: 11,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
