import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    minHeight: 116,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
  pressed: {
    opacity: 0.85,
  },
  child: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  identity: { flex: 1, minWidth: 0, gap: 3 },
  place: { color: colors.ink, fontSize: 12 },
  meta: { color: colors.grey, fontSize: 11 },
  name: {
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  stats: { flexDirection: 'row', gap: 4, flexShrink: 1, maxWidth: '48%' },
  stat: {
    minHeight: 44,
    minWidth: 44,
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 23,
    fontVariant: ['tabular-nums'],
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  statLabel: { fontSize: 10, textAlign: 'center', color: colors.grey },
  statReviewText: { color: colors.reviewChipText },
}));
