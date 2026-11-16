import { StyleSheet } from 'react-native';
import { theme, tracking } from '@shared/theme';
import {
  CHART_HEIGHT,
  COLUMN_GAP,
  COLUMN_WIDTH,
  COLUMN_WIDTH_SELECTED,
  DATE_CHIP_HEIGHT,
  DAY_SLOT_WIDTH,
} from '../config/sizes';

export const styles = StyleSheet.create({
  column: {
    width: DAY_SLOT_WIDTH,
    height: CHART_HEIGHT,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: COLUMN_GAP,
  },
  // Столбики невыбранных дней приглушены.
  dimmed: {
    opacity: 0.6,
  },
  chip: {
    width: COLUMN_WIDTH,
    height: DATE_CHIP_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    paddingTop: 6,
    paddingBottom: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: theme.colors.white,
    boxShadow: '0px 3px 4px rgba(26, 26, 51, 0.07)',
  },
  chipSelected: {
    width: COLUMN_WIDTH_SELECTED,
    borderWidth: 1.5,
    borderColor: theme.colors.ink,
    boxShadow: '0px 2px 8px rgba(26, 26, 46, 0.08)',
  },
  // Будущий день: без тени, весь текст серый.
  chipFuture: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  textFuture: {
    color: theme.colors.placeholder,
  },
  weekday: {
    fontSize: 11,
    letterSpacing: tracking(11),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  day: {
    fontSize: theme.fontSize.md,
    letterSpacing: tracking(theme.fontSize.md),
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  month: {
    fontSize: 10,
    letterSpacing: tracking(10),
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
});
