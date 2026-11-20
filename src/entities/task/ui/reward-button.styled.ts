import { createStyles } from '@shared/theme';

export const styles = createStyles((colors) => ({
  container: {
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
  },
  containerReward: {
    backgroundColor: colors.approvedFrom,
  },
  containerPenalty: {
    backgroundColor: colors.dangerTint,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleReward: {
    backgroundColor: colors.approvedBorder,
  },
  circlePenalty: {
    backgroundColor: colors.dangerBorder,
  },
  texts: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: colors.inkSoft,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  },
  amountReward: {
    color: colors.earned,
  },
  amountPenalty: {
    color: colors.dangerText,
  },
}));
