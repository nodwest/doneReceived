import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

export const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.08)',
  },
  pending: {
    borderColor: theme.colors.reviewBorder,
  },
  approved: {
    borderColor: theme.colors.approvedBorder,
  },
  sentBack: {
    borderColor: theme.colors.sentBackBorder,
  },
  missed: {
    borderColor: theme.colors.missedBorder,
  },
  new: {
    borderColor: theme.colors.childTintBorder,
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  middle: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    columnGap: 4,
  },
  title: {
    flexShrink: 1,
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  // Статус не обрезается вместе с длинным названием: не влез в строку —
  // переносится на следующую.
  status: {
    flexShrink: 0,
    fontSize: 15,
    lineHeight: 19,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
  },
  subtitle: {
    fontSize: theme.fontSize.xs,
    lineHeight: 15,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  subtitlePending: {
    color: theme.colors.reviewText,
  },
  subtitleApproved: {
    color: theme.colors.rewardText,
  },
  subtitleNew: {
    color: theme.colors.childDeep,
  },
  subtitleSentBack: {
    color: theme.colors.sentBack,
  },
  subtitleMissed: {
    color: theme.colors.missedDeep,
  },
  statusPending: {
    color: theme.colors.reviewText,
  },
  statusApproved: {
    color: theme.colors.rewardText,
  },
  statusNew: {
    color: theme.colors.childDeep,
  },
  statusSentBack: {
    color: theme.colors.sentBack,
  },
  statusMissed: {
    color: theme.colors.missedDeep,
  },
  track: {
    position: 'relative',
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotSlot: {
    width: 10,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  connector: {
    width: 8,
    height: 2,
    borderRadius: 1,
  },
  changes: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  tooltip: {
    position: 'absolute',
    bottom: 22,
    zIndex: 10,
    maxWidth: 190,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.ink,
    boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.18)',
  },
  tooltipText: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
  },
  reward: {
    marginTop: 1,
    marginLeft: 2,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.yellow,
  },
  rewardPending: {
    color: theme.colors.reviewAccent,
  },
  rewardNew: {
    color: theme.colors.childDeep,
  },
  rewardSentBack: {
    color: theme.colors.sentBack,
  },
  // Упущенная сумма — серая, как в истории наград.
  rewardMissed: {
    color: theme.colors.missed,
  },
});
