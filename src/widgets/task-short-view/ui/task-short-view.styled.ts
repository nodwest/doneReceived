import { createStyles } from '@shared/theme';

export const styles = createStyles((colors) => ({
  content: {
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.childTo,
  },
  reward: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.ink,
  },
  description: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
    color: colors.grey,
  },
}));
