import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export const ChildIcon = ({ color = '#000', size = 24 }) => (
  <Svg viewBox="0 0 30 30" width={size} height={size}>
    <Path
      d="M21.4229 13C21.4732 13.326 21.5 13.6599 21.5 14C21.5 17.5899 18.5899 20.5 15 20.5C11.4101 20.5 8.5 17.5899 8.5 14C8.5 13.6599 8.5268 13.326 8.57715 13H21.4229ZM15 7.5C17.5875 7.5 19.8221 9.01169 20.8682 11.2002H9.13184C10.1779 9.01169 12.4125 7.5 15 7.5Z"
      fill={color}
    />
    <Rect x={15} y={9.7} width={10} height={2.2} rx={1.1} fill={color} />
    <Circle cx={15} cy={6.2} r={1.8} fill={color} />
    <Path
      d="M6.5 27.4444C6.5 24.4376 8.93756 22 11.9444 22H18.0556C21.0624 22 23.5 24.4376 23.5 27.4444C23.5 28.3036 22.8036 29 21.9444 29H8.05556C7.19645 29 6.5 28.3036 6.5 27.4444Z"
      fill={color}
    />
  </Svg>
);
