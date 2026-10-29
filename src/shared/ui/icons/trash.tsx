import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const TrashIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Path
      d="M3.33333 5.83333H5M5 5.83333H7.5M5 5.83333L5.83333 15.8333C5.83333 16.2754 6.00893 16.6993 6.32149 17.0118C6.63405 17.3244 7.05797 17.5 7.5 17.5H12.5C12.942 17.5 13.366 17.3244 13.6785 17.0118C13.9911 16.6993 14.1667 16.2754 14.1667 15.8333L15 5.83333M7.5 5.83333H12.5M7.5 5.83333V3.33333H12.5V5.83333M12.5 5.83333H15M15 5.83333H16.6667M8.33333 9.16667V14.1667M11.6667 9.16667V14.1667"
      stroke={color}
      strokeWidth={1.66667}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
