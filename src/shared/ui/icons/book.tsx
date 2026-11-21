import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Открытая книга: вкладка Languages (слова дня). */
export const BookIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path
      d="M12 6.5C10.2 5.1 7.7 4.5 4.5 4.6C3.95 4.62 3.5 5.07 3.5 5.62V17.4C3.5 17.97 3.97 18.42 4.54 18.4C7.7 18.3 10.15 18.9 12 20.3M12 6.5C13.8 5.1 16.3 4.5 19.5 4.6C20.05 4.62 20.5 5.07 20.5 5.62V17.4C20.5 17.97 20.03 18.42 19.46 18.4C16.3 18.3 13.85 18.9 12 20.3M12 6.5V20.3"
      stroke={color}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
