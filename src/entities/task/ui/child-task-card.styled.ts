import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';

// Фон активной карточки ребёнка: полупрозрачный голубой градиент.
export const CHILD_CARD_GRADIENT = [
  'rgba(74, 158, 240, 0.45)',
  'rgba(168, 217, 255, 0.55)',
] as const;

const DASHED = {
  borderWidth: 1.5,
  borderStyle: 'dashed',
  overflow: 'hidden',
} as const;

export const styles = StyleSheet.create({
  timerValue: {
    color: theme.colors.childDeep,
  },
  report: {
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.white,
  },
  reportHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportTitle: {
    flex: 1,
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.ink,
  },
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.childChip,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.bold,
    color: theme.colors.childDeep,
  },
  dropZone: {
    ...DASHED,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderColor: 'rgba(74, 158, 240, 0.55)',
  },
  source: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  sourceLabel: {
    fontSize: 15,
    letterSpacing: tracking(15),
    fontFamily: theme.fonts.bold,
    color: theme.colors.childDeep,
  },
  divider: {
    width: 1,
    height: 64,
    backgroundColor: 'rgba(74, 158, 240, 0.3)',
  },
  hint: {
    textAlign: 'center',
    fontSize: theme.fontSize.xs,
    letterSpacing: tracking(theme.fontSize.xs),
    fontFamily: theme.fonts.regular,
    color: theme.colors.grey,
  },
});
