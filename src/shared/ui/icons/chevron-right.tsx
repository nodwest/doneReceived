import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const ChevronRightIcon = ({ color = '#000', size = 16 }) => (
  <Svg viewBox="0 0 16 16" width={size} height={size} fill="none">
    <Path
      d="M6 4L10 8L6 12"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
