import Svg, { Path, Rect } from 'react-native-svg';
import { OPERATION_KIND_COLORS } from '../config/kind-colors';
import type { OperationKind } from '../model/operation';

/** Маленький 3D-кубик 12×11 цвета вида операции — легенда к столбикам графика. */
export function KindCube({ kind }: { kind: OperationKind }) {
  const colors = OPERATION_KIND_COLORS[kind];

  return (
    <Svg width={12} height={11} viewBox="0 0 12 11">
      <Rect y={3} width={8} height={8} fill={colors.front} />
      <Path d="M8 3L12 0V8L8 11V3Z" fill={colors.side} />
      <Path d="M0 3L4 0H12L8 3H0Z" fill={colors.top} />
    </Svg>
  );
}
