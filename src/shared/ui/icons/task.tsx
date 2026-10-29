import React from 'react';
import Svg, { Path } from 'react-native-svg';

/** Задание: планшет с двумя строками — общая иконка для любой задачи. */
export const TaskIcon = ({ color = '#000', size = 24 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path
      d="M8.5 4.5H7C6.33696 4.5 5.70107 4.76339 5.23223 5.23223C4.76339 5.70107 4.5 6.33696 4.5 7V19C4.5 19.663 4.76339 20.2989 5.23223 20.7678C5.70107 21.2366 6.33696 21.5 7 21.5H17C17.663 21.5 18.2989 21.2366 18.7678 20.7678C19.2366 20.2989 19.5 19.663 19.5 19V7C19.5 6.33696 19.2366 5.70107 18.7678 5.23223C18.2989 4.76339 17.663 4.5 17 4.5H15.5"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 2.5H14C14.8284 2.5 15.5 3.17157 15.5 4V5C15.5 5.82843 14.8284 6.5 14 6.5H10C9.17157 6.5 8.5 5.82843 8.5 5V4C8.5 3.17157 9.17157 2.5 10 2.5Z"
      stroke={color}
      strokeWidth={2.3}
    />
    <Path
      d="M8.5 11.5H15.5M8.5 16H13"
      stroke={color}
      strokeWidth={2.3}
      strokeLinecap="round"
    />
  </Svg>
);
