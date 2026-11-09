import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const SparkleIcon = ({ color = '#000', size = 16 }) => (
  <Svg viewBox="0 0 16 16" width={size} height={size} fill="none">
    <Path
      d="M8 1.5V4.5M8 11.5V14.5M1.5 8H4.5M11.5 8H14.5"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
