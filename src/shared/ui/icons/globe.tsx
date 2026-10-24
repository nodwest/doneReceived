import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Круг цвета `color` с белыми меридианами. */
export const GlobeIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size}>
    <Path
      d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
      fill={color}
    />
    <Path
      d="M2.5 10H8.125M8.125 10H11.875M8.125 10C8.125 6.875 8.75 3.75 10 2.5C11.25 3.75 11.875 6.875 11.875 10M8.125 10C8.125 13.125 8.75 16.25 10 17.5C11.25 16.25 11.875 13.125 11.875 10M11.875 10H17.5"
      stroke="#fff"
      strokeWidth={1.5}
    />
  </Svg>
);
