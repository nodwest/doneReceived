import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';
import {
  CHART_HEIGHT,
  COLUMN_GAP,
  COLUMN_WIDTH,
  COLUMN_WIDTH_SELECTED,
  DATE_CHIP_HEIGHT,
  DAY_SLOT_WIDTH,
} from '../config/sizes';

const SOFT_WHITE = 'rgba(255, 255, 255, 0.85)';

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
    borderWidth: 0,
    backgroundColor: 'transparent',
    boxShadow: '0px 4px 5px rgba(108, 92, 231, 0.28)',
  },
  weekday: {
    fontSize: 11,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  weekdaySelected: {
    color: SOFT_WHITE,
  },
  day: {
    fontSize: theme.fontSize.md,
    fontFamily: theme.fonts.semibold,
    color: theme.colors.ink,
  },
  daySelected: {
    color: theme.colors.white,
  },
  month: {
    fontSize: 10,
    fontFamily: theme.fonts.medium,
    color: theme.colors.grey,
  },
  monthSelected: {
    color: SOFT_WHITE,
  },
});
