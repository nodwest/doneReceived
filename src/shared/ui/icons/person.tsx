import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const PersonIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size}>
    <Path
      d="M10 10C11.8409 10 13.3333 8.50762 13.3333 6.66667C13.3333 4.82572 11.8409 3.33333 10 3.33333C8.15905 3.33333 6.66667 4.82572 6.66667 6.66667C6.66667 8.50762 8.15905 10 10 10Z"
      fill={color}
    />
    <Path
      d="M3.33333 17.5C3.33333 13.8333 6.33333 11.6667 10 11.6667C13.6667 11.6667 16.6667 13.8333 16.6667 17.5H3.33333Z"
      fill={color}
    />
  </Svg>
);
