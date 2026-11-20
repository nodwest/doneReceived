import { createStyles, theme, tracking } from '@shared/theme';

const card = {
  flex: 1,
  gap: 8,
  paddingVertical: 16,
  paddingHorizontal: 14,
  borderRadius: 20,
  borderWidth: 1,
  boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
} as const;

export const styles = createStyles((colors) => ({
  container: {
    flexDirection: 'row',
    gap: 6,
  },
  // Обёртка плитки: доли ряда равные; minWidth: 0 — длинная подпись
  // переносится, а не расширяет плитку.
  slot: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    ...card,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  cardAccent: {
    ...card,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  cardReview: {
    ...card,
    borderColor: colors.reviewBorder,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: 22,
    letterSpacing: tracking(22),
    fontFamily: theme.fonts.bold,
    color: colors.ink,
  },
  label: {
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.medium,
    color: colors.grey,
  },
  textAccent: {
    color: colors.white,
  },
}));
