import type { DayTotals } from '@entities/operation';
import {
  CHART_HEIGHT,
  COLUMN_GAP,
  DATE_CHIP_HEIGHT,
  DEPTH_Y,
  STACK_OVERLAP,
} from '../config/sizes';

/** Масштаб из макета, когда наград нет совсем: $1 — 9.33pt лицевой грани. */
const DESIGN_SCALE = 28 / 3;
// Вся высота над датой отдана столбикам.
const MAX_BAR_HEIGHT = CHART_HEIGHT - DATE_CHIP_HEIGHT - COLUMN_GAP;

// Верхние грани столбика: у каждого кубика своя, два кубика заходят друг на
// друга на STACK_OVERLAP.
function facesHeight({ earned, missed }: DayTotals) {
  const cubes = Number(earned > 0) + Number(missed > 0);
  return cubes * DEPTH_Y - (cubes === 2 ? STACK_OVERLAP : 0);
}

/**
 * pt на $1, общий для всех дней: самый высокий столбик занимает всю высоту
 * над датой, остальные — в пропорции к нему.
 */
export function getBarScale(days: DayTotals[]) {
  const scales = days
    .filter((day) => day.earned + day.missed > 0)
    .map(
      (day) => (MAX_BAR_HEIGHT - facesHeight(day)) / (day.earned + day.missed),
    );
  return scales.length > 0 ? Math.min(...scales) : DESIGN_SCALE;
}
