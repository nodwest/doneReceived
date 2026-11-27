import Svg, { Path } from 'react-native-svg';

export const LayersIcon = ({ color = '#000', size = 24 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path
      d="m12 3 8 4-8 4-8-4 8-4Z"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <Path
      d="m4 12 8 4 8-4M4 17l8 4 8-4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
