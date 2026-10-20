import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CardsIcon = ({ color = '#000', size = 24 }) => (
  <Svg viewBox="0 0 22 22" width={size} height={size} fill="none">
    <Path
      d="M5.95833 3.66667H16.0417C17.8136 3.66667 19.25 5.10309 19.25 6.875V15.125C19.25 16.8969 17.8136 18.3333 16.0417 18.3333H5.95833C4.18642 18.3333 2.75 16.8969 2.75 15.125V6.875C2.75 5.10309 4.18642 3.66667 5.95833 3.66667Z"
      stroke={color}
      strokeWidth={2.01667}
    />
    <Path d="M2.75 8.70833H19.25" stroke={color} strokeWidth={2.01667} />
    <Path
      d="M6.41667 13.2917H11.9167"
      stroke={color}
      strokeWidth={2.01667}
      strokeLinecap="round"
    />
  </Svg>
);
