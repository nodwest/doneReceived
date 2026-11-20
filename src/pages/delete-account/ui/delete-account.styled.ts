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
    gap: 24,
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSoft,
  },
  heroTitle: {
    textAlign: 'center',
    fontSize: theme.fontSize.xl,
    letterSpacing: tracking(theme.fontSize.xl),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  heroText: {
    textAlign: 'center',
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  card: {
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    boxShadow: '0px 4px 6px rgba(26, 26, 46, 0.06)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSoft,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  rowBody: {
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.regular,
    color: colors.grey,
  },
  rowNote: {
    marginTop: 4,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    letterSpacing: tracking(theme.fontSize.sm),
    fontFamily: theme.fonts.semibold,
    color: colors.ink,
  },
  // Отступ разделителя слева: иконка пункта (12 + 36 + 12).
  divider: {
    height: 1,
    marginLeft: 60,
    backgroundColor: colors.line,
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
