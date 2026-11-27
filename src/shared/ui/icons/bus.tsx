import Svg, { Circle, Path, Rect } from 'react-native-svg';

export const BusIcon = ({ color = '#000', size = 24 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Rect
      x={4}
      y={2.5}
      width={16}
      height={17}
      rx={4}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M7 6h10v6H7V6Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Circle cx={8} cy={16} r={1.25} fill={color} />
    <Circle cx={16} cy={16} r={1.25} fill={color} />
    <Path
      d="M7 21v-1.5M17 21v-1.5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
