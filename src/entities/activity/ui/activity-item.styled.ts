import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.08)',
  },
  pending: {
    borderColor: colors.reviewBorder,
  },
  approved: {
    borderColor: colors.approvedBorder,
  },
  sentBack: {
    borderColor: colors.sentBackBorder,
  },
  missed: {
    borderColor: colors.missedBorder,
  },
  new: {
    borderColor: colors.childTintBorder,
  },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 18,
  },
  content: {
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  contentOpen: {
    paddingBottom: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  // Отступ сверху даёт нижний край шапки карточки.
  history: {
    paddingHorizontal: 14,
    paddingBottom: 12,
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
    color: colors.ink,
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
    color: colors.grey,
  },
  subtitlePending: {
    color: colors.reviewText,
  },
  subtitleApproved: {
    color: colors.rewardText,
  },
  subtitleNew: {
    color: colors.childInk,
  },
  subtitleSentBack: {
    color: colors.sentBack,
  },
  subtitleMissed: {
    color: colors.missedDeep,
  },
  statusPending: {
    color: colors.reviewText,
  },
  statusApproved: {
    color: colors.rewardText,
  },
  statusNew: {
    color: colors.childInk,
  },
  statusSentBack: {
    color: colors.sentBack,
  },
  statusMissed: {
    color: colors.missedDeep,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  reward: {
    marginTop: 1,
    marginLeft: 2,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: colors.yellow,
  },
  rewardPending: {
    color: colors.reviewAccent,
  },
  rewardNew: {
    color: colors.childInk,
  },
  rewardSentBack: {
    color: colors.sentBack,
  },
  // Упущенная сумма — серая, как в истории наград.
  rewardMissed: {
    color: colors.missed,
  },
}));
