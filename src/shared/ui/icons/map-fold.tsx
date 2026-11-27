import Svg, { Path } from 'react-native-svg';

/** Сложенная карта контуром: подложка карты (Protomaps). */
export const MapFoldIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Path
      d="M7.5 4L2.5 6V16L7.5 14L12.5 16L17.5 14V4L12.5 6L7.5 4Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
    <Path d="M7.5 4V14M12.5 6V16" stroke={color} strokeWidth={1.7} />
  </Svg>
);
