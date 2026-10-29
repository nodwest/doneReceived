import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PencilIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Path
      d="M3.33333 16.6667H6.66667L15.8333 7.5C16.2754 7.05797 16.5237 6.45845 16.5237 5.83333C16.5237 5.20821 16.2754 4.60869 15.8333 4.16667C15.3913 3.72464 14.7918 3.47631 14.1667 3.47631C13.5415 3.47631 12.942 3.72464 12.5 4.16667L3.33333 13.3333V16.6667Z"
      stroke={color}
      strokeWidth={1.66667}
      strokeLinejoin="round"
    />
    <Path
      d="M11.25 5.41667L14.5833 8.75"
      stroke={color}
      strokeWidth={1.66667}
    />
  </Svg>
);
