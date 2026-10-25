import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 8,
  },

  // Строка «чей список». Снизу 6 + 12 отступа списка — те же 18, что сверху.
  owner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 18,
    paddingBottom: 6,
  },
  // Без переключателя: заголовок по центру шапки. Снизу 6 + 12 отступа
  // списка — те же 18, что под строкой владельца у ребёнка.
  ownerInline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  containerInline: {
    paddingBottom: 6,
  },
  ownerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  ownerName: {
    fontSize: 17,
    letterSpacing: tracking(17),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },

  segments: {
    backgroundColor: theme.colors.white,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    borderRadius: 22,
  },
  segment: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    overflow: 'hidden',
  },
  segmentWithBadge: {
    paddingRight: 8,
  },
  segmentCompact: {
    paddingHorizontal: 9,
  },
  segmentAllActive: {
    boxShadow: '0px 3px 8px rgba(108, 92, 231, 0.3)',
  },
  segmentReviewActive: {
    boxShadow: '0px 3px 8px rgba(248, 204, 148, 0.45)',
  },
  segmentLabel: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  segmentLabelCompact: {
    fontSize: theme.fontSize.inputName,
    letterSpacing: tracking(theme.fontSize.inputName),
  },
  segmentLabelBold: {
    fontFamily: theme.fonts.bold,
  },
  segmentLabelSizer: {
    opacity: 0,
  },
  segmentLabelOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  segmentLabelAll: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  segmentLabelReview: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.reviewText,
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    lineHeight: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
});
