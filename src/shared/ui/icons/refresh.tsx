import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const RefreshIcon = ({ color = '#000', size = 16 }) => (
  <Svg viewBox="0 0 16 16" width={size} height={size} fill="none">
    <Path
      d="M13.5 8A5.5 5.5 0 1 1 11.89 4.11"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M12.5 1.5V4.5H9.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
