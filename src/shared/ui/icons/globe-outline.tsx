import Svg, { Path } from 'react-native-svg';

/** Глобус контуром: источник данных карты (OpenStreetMap). */
export const GlobeOutlineIcon = ({ color = '#000', size = 20 }) => (
  <Svg viewBox="0 0 20 20" width={size} height={size} fill="none">
    <Path
      d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
      stroke={color}
      strokeWidth={1.7}
    />
    <Path
      d="M2.5 10H17.5M10 2.5C12.2 4.8 13.2 7.3 13.2 10C13.2 12.7 12.2 15.2 10 17.5C7.8 15.2 6.8 12.7 6.8 10C6.8 7.3 7.8 4.8 10 2.5Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  </Svg>
);
