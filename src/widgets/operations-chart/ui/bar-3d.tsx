import { Text, View } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import {
  formatAmount,
  OPERATION_KIND_COLORS,
  type OperationKind,
} from '@entities/operation';
import { theme } from '@shared/theme';
import {
  DEPTH_X,
  DEPTH_Y,
  FUTURE_BAR_HEIGHT,
  STACK_OVERLAP,
} from '../config/sizes';
import { styles } from './bar-3d.styled';

type CubeColors = { front: string; side: string; top: string };

// Будущий день: одинаковый серый кубик минимальной высоты.
const FUTURE_COLORS: CubeColors = {
  front: theme.colors.future,
  side: theme.colors.futureDark,
  top: theme.colors.futureLight,
};

// Подпись суммы помещается на лицевую грань не ниже этой высоты.
const MIN_LABEL_HEIGHT = 16;

type Bar3DProps = {
  earned: number;
  missed: number;
  /** pt на $1. */
  scale: number;
  width: number;
  /** Суммы на гранях — у выбранного дня. */
  showLabels: boolean;
  /** Будущий день: вместо сумм серый кубик-заглушка. */
  future?: boolean;
};

type Block = {
  kind: OperationKind;
  amount: number;
  top: number;
  height: number;
};

/** Столбик дня: кубик earned снизу, missed сверху. */
export function Bar3D({
  earned,
  missed,
  scale,
  width,
  showLabels,
  future,
}: Bar3DProps) {
  if (future) {
    return (
      <Svg width={width} height={FUTURE_BAR_HEIGHT}>
        <Cube
          top={0}
          height={FUTURE_BAR_HEIGHT}
          width={width}
          colors={FUTURE_COLORS}
        />
      </Svg>
    );
  }

  const earnedHeight = earned > 0 ? earned * scale + DEPTH_Y : 0;
  const missedHeight = missed > 0 ? missed * scale + DEPTH_Y : 0;
  const height =
    earnedHeight +
    missedHeight -
    (earnedHeight && missedHeight ? STACK_OVERLAP : 0);
  if (height === 0) return null;

  // missed рисуется вторым: его низ ложится на верхнюю грань earned.
  const blocks: Block[] = [
    {
      kind: 'earned' as const,
      amount: earned,
      top: height - earnedHeight,
      height: earnedHeight,
    },
    { kind: 'missed' as const, amount: missed, top: 0, height: missedHeight },
  ].filter((block) => block.amount > 0);
  const front = width - DEPTH_X;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        {blocks.map(({ kind, top, height: blockHeight }) => (
          <Cube
            key={kind}
            top={top}
            height={blockHeight}
            width={width}
            colors={OPERATION_KIND_COLORS[kind]}
          />
        ))}
      </Svg>
      {showLabels &&
        blocks
          .filter((block) => block.height - DEPTH_Y >= MIN_LABEL_HEIGHT)
          .map(({ kind, amount, top, height: blockHeight }) => (
            <View
              key={kind}
              style={[
                styles.labelBox,
                {
                  top: top + DEPTH_Y,
                  width: front,
                  height: blockHeight - DEPTH_Y,
                },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  { color: OPERATION_KIND_COLORS[kind].label },
                ]}
              >
                {formatAmount(amount)}
              </Text>
            </View>
          ))}
    </View>
  );
}

type CubeProps = {
  top: number;
  height: number;
  width: number;
  colors: CubeColors;
};

/** 3D-кубик: лицевая, боковая и верхняя грани. */
function Cube({ top, height, width, colors }: CubeProps) {
  const front = width - DEPTH_X;
  const bottom = top + height;
  return (
    <G>
      <Rect
        y={top + DEPTH_Y}
        width={front}
        height={height - DEPTH_Y}
        fill={colors.front}
      />
      <Path
        d={`M${front} ${top + DEPTH_Y}L${width} ${top}V${bottom - DEPTH_Y}L${front} ${bottom}Z`}
        fill={colors.side}
      />
      <Path
        d={`M0 ${top + DEPTH_Y}L${DEPTH_X} ${top}H${width}L${front} ${top + DEPTH_Y}Z`}
        fill={colors.top}
      />
    </G>
  );
}
