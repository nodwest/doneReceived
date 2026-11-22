import { createStyles, theme, tracking } from '@shared/theme';

export const styles = createStyles((colors) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fontSize.lg,
    letterSpacing: tracking(theme.fontSize.lg),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  headerSpacer: {
    width: 44,
  },
  body: {
    flexGrow: 1,
    gap: 20,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  pointsCard: {
    padding: 16,
    gap: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  pointsHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  total: {
    color: colors.ink,
    fontFamily: theme.fonts.bold,
    fontSize: 36,
    letterSpacing: tracking(36),
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.medium,
    color: colors.ink,
  },
  breakdown: {
    gap: 6,
    paddingTop: 4,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pointLabel: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: colors.inkSoft,
  },
  pointValue: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  consequences: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSoft,
  },
  rowText: { flex: 1 },
  rowBody: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: colors.ink,
  },
  changed: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.dangerTint,
    color: colors.ink,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
  },
  state: {
    gap: 4,
  },
  stateText: {
    fontSize: theme.fontSize.sm,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: colors.ink,
  },
  retry: {
    minHeight: 44,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  // Прижимает кнопку к низу, когда текста меньше экрана.
  footer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  // У PillButton flex: 1 — для двух кнопок в ряд. Здесь кнопка одна в
  // столбце, и flex растянул бы её по высоте: оставляем ровно 48.
  deleteButton: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
  },
}));
