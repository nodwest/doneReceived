import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    backgroundColor: '#DCFCE7',
  },
  containerPenalty: {
    backgroundColor: '#FEE2E2',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleReward: {
    backgroundColor: '#86EFAC',
  },
  circlePenalty: {
    backgroundColor: '#FCA5A5',
  },
  texts: {
    gap: 4,
  },
  label: {
    fontSize: 13,
    color: '#555555',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
  },
  amountReward: {
    color: '#4ADE80',
  },
  amountPenalty: {
    color: '#F87171',
  },
});
