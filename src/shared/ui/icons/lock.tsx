import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const LockIcon = ({ color = '#000', size = 24 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    <Path
      d="M17 9V7a5 5 0 0 0-10 0v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3ZM9 7a3 3 0 0 1 6 0v2H9V7Zm4 10.2a1 1 0 0 1-2 0v-2.4a1 1 0 0 1 2 0v2.4Z"
      fill={color}
    />
  </Svg>
);
