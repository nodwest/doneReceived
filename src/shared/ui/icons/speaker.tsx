import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Динамик со звуковыми волнами: произнести слово или предложение. */
export const SpeakerIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Path
      d="M3 7.75V12.25C3 12.66 3.34 13 3.75 13H6.25L9.97 15.98C10.46 16.37 11.19 16.02 11.19 15.39V4.61C11.19 3.98 10.46 3.63 9.97 4.02L6.25 7H3.75C3.34 7 3 7.34 3 7.75Z"
      fill={color}
    />
    <Path
      d="M13.75 7.5C14.4 8.2 14.75 9.08 14.75 10C14.75 10.92 14.4 11.8 13.75 12.5"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
    <Path
      d="M15.9 5.25C17.1 6.55 17.75 8.24 17.75 10C17.75 11.76 17.1 13.45 15.9 14.75"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);
