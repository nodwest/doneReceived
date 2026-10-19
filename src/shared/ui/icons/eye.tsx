import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const EyeIcon = ({ color = '#000', size = 24 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    <Path
      d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5Zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
      fill={color}
    />
  </Svg>
);
