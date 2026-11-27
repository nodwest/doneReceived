import Svg, { G, Path } from 'react-native-svg';

/** Рука с указательным пальцем (как в lucide «pointer»), 24×24. */
const Hand = ({ color }: { color: string }) => (
  <>
    <Path d="M22 14a8 8 0 0 1-8 8" stroke={color} />
    <Path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" stroke={color} />
    <Path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" stroke={color} />
    <Path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" stroke={color} />
    <Path
      d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
      stroke={color}
    />
  </>
);

/** Свайп влево-вправо: рука и стрелки в обе стороны над пальцем. */
export const SwipeHorizontalIcon = ({ color = '#000', size = 20 }) => (
  <Svg
    viewBox="0 0 32 30"
    width={(size * 32) / 30}
    height={size}
    fill="none"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M2 4h8M5 1L2 4l3 3" stroke={color} />
    <Path d="M30 4h-8M27 1l3 3-3 3" stroke={color} />
    <G transform="translate(5 7)">
      <Hand color={color} />
    </G>
  </Svg>
);

/** Свайп вверх-вниз: рука и стрелка в обе стороны слева. */
export const SwipeVerticalIcon = ({ color = '#000', size = 20 }) => (
  <Svg
    viewBox="0 0 32 30"
    width={(size * 32) / 30}
    height={size}
    fill="none"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M4 3v24M1 6l3-3 3 3M1 24l3 3 3-3" stroke={color} />
    <G transform="translate(8 4)">
      <Hand color={color} />
    </G>
  </Svg>
);
