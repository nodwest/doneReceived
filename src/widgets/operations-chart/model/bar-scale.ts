import type { DayTotals } from '@entities/operation';
import {
  CHART_HEIGHT,
  COLUMN_GAP,
  DATE_CHIP_HEIGHT,
  DEPTH_Y,
  STACK_OVERLAP,
} from '../config/sizes';

/** Масштаб из макета: $1 — 9.33pt лицевой грани ($10 — 93.3pt). */
const DESIGN_SCALE = 28 / 3;
// Над датой остаётся место под столбик; 4pt — запас сверху.
const MAX_BAR_HEIGHT = CHART_HEIGHT - DATE_CHIP_HEIGHT - COLUMN_GAP - 4;
// У столбика из двух кубиков две верхние грани минус нахлёст.
const FACES_HEIGHT = 2 * DEPTH_Y - STACK_OVERLAP;

/** pt на $1: как в макете, но самый высокий день всегда помещается. */
export function getBarScale(days: DayTotals[]) {
  const max = Math.max(0, ...days.map((day) => day.earned + day.missed));
  if (max === 0) return DESIGN_SCALE;
  return Math.min(DESIGN_SCALE, (MAX_BAR_HEIGHT - FACES_HEIGHT) / max);
}
