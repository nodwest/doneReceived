import React from 'react';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

// Текущий шаг статуса: фиолетово-синий круг с белой точкой. Цвет задан градиентом.
export const StepDotIcon = ({
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg viewBox="0 0 24 24" width={size} height={size}>
    <Defs>
      <LinearGradient
        id="step-dot-gradient"
        x1="-8.48528"
        y1="8.48528"
        x2="8.48528"
        y2="25.4558"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#6C5CE7" />
        <Stop offset="1" stopColor="#4A90E2" />
      </LinearGradient>
    </Defs>
    <Rect width="24" height="24" rx="12" fill="url(#step-dot-gradient)" />
    <Circle cx="12" cy="12" r="4" fill="white" />
  </Svg>
);
