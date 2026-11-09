import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CalendarIcon = ({ color = '#000', size = 16 }) => (
  <Svg viewBox="0 0 16 16" width={size} height={size} fill="none">
    <Path
      d="M12.5 3H3.5C2.4 3 1.5 3.9 1.5 5V12.5C1.5 13.6 2.4 14.5 3.5 14.5H12.5C13.6 14.5 14.5 13.6 14.5 12.5V5C14.5 3.9 13.6 3 12.5 3ZM1.5 6.5H14.5M5 1.5V4M11 1.5V4"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
