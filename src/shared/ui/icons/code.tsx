import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Код «< >»: библиотека в списке источников карты. */
export const CodeIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Path
      d="M7 6L3 10L7 14M13 6L17 10L13 14"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
