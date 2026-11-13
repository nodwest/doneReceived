import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Стрелка «вернуть»: Send back на шторке отказа. */
export const UndoIcon = ({ color = '#000', size = 18 }) => (
  <Svg viewBox="0 0 18 18" width={size} height={size} fill="none">
    <Path
      d="M3.375 5.625V10.125H7.875"
      stroke={color}
      strokeWidth={1.98}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4.05 9.67502C5.4 6.30002 8.775 4.27502 12.375 5.17502C15.3 5.96252 16.875 8.77502 16.425 11.7"
      stroke={color}
      strokeWidth={1.98}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
