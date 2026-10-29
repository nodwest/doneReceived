import React from 'react';
import Svg, { Circle } from 'react-native-svg';

// Шесть точек 2×3 в сетке 14×20, как в макете.
const DOTS = [
  [4, 4],
  [10, 4],
  [4, 10],
  [10, 10],
  [4, 16],
  [10, 16],
] as const;

/** Ручка перетаскивания: шесть точек. */
export const DragHandleIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 14 20" width={(size * 14) / 20} height={size}>
    {DOTS.map(([cx, cy]) => (
      <Circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.6} fill={color} />
    ))}
  </Svg>
);
