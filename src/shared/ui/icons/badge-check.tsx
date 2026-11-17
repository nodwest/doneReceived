import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Розетка с галочкой: задание принято и награда выплачена. */
export const BadgeCheckIcon = ({ color = '#000', size = 16 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path
      d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      stroke={color}
      strokeWidth={2.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="m8.5 12 2.5 2.5 4.5-5"
      stroke={color}
      strokeWidth={2.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
