import Svg, { Circle, Path } from 'react-native-svg';

/** Солнце: светлая тема. */
export const SunIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Circle cx={10} cy={10} r={3.5} stroke={color} strokeWidth={1.6} />
    <Path
      d="M10 2V3.4M10 16.6V18M18 10H16.6M3.4 10H2M15.66 4.34L14.67 5.33M5.33 14.67L4.34 15.66M15.66 15.66L14.67 14.67M5.33 5.33L4.34 4.34"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </Svg>
);
