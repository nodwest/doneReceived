import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Картинка с плюсом: плитка «Add from gallery» в фото-отчёте. */
export const ImageAddIcon = ({ color = '#000', size = 26 }) => (
  <Svg viewBox="0 0 26 26" width={size} height={size} fill="none">
    <Path
      d="M22.75 13V19.5C22.75 20.0746 22.5217 20.6257 22.1154 21.0321C21.7091 21.4384 21.158 21.6667 20.5833 21.6667H5.41667C4.84203 21.6667 4.29093 21.4384 3.8846 21.0321C3.47827 20.6257 3.25 20.0746 3.25 19.5V7.58333C3.25 7.0087 3.47827 6.4576 3.8846 6.05127C4.29093 5.64494 4.84203 5.41667 5.41667 5.41667H13"
      stroke={color}
      strokeWidth={1.95}
      strokeLinecap="round"
    />
    <Path
      d="M3.79167 18.9583L9.20833 13.5417L13.5417 17.875L16.25 15.1667L21.6667 20.5833"
      stroke={color}
      strokeWidth={1.95}
      strokeLinejoin="round"
    />
    <Path
      d="M19.5 3.25V6.5M19.5 6.5V9.75M19.5 6.5H16.25M19.5 6.5H22.75"
      stroke={color}
      strokeWidth={1.95}
      strokeLinecap="round"
    />
  </Svg>
);
