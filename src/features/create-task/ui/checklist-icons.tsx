import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { theme } from '@shared/theme';

// Иконки чеклиста из макета (Create Task · Checklist), размеры — как там.

/** Плюс на сиреневой плашке: 28 — кнопка Add checklist, 20 — Add step. */
export function ChecklistPlusIcon({ size }: { size: 20 | 28 }) {
  const large = size === 28;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <Rect
        width={size}
        height={size}
        rx={large ? 9 : 6}
        fill={theme.colors.checklistPlusBg}
      />
      <Path
        d={
          large
            ? 'M14 8V14M14 14V20M14 14H8M14 14H20'
            : 'M10 5V10M10 10V15M10 10H5M10 10H15'
        }
        stroke={theme.colors.violet}
        strokeWidth={large ? 2.2 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const HANDLE_DOTS = [
  [3.1, 3.6],
  [9.1, 3.6],
  [3.1, 9.6],
  [9.1, 9.6],
  [3.1, 15.6],
  [9.1, 15.6],
] as const;

/** Ручка перетаскивания шага: шесть точек 12×18. */
export function StepHandleIcon() {
  return (
    <Svg width={12} height={18} viewBox="0 0 12 18" fill="none">
      {HANDLE_DOTS.map(([cx, cy]) => (
        <Circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={1.6}
          fill={theme.colors.checklistHandle}
        />
      ))}
    </Svg>
  );
}

/** Крестик «убрать шаг» 20×20. */
export function StepRemoveIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M5.5 5.5L10 10M10 10L14.5 14.5M10 10L14.5 5.5M10 10L5.5 14.5"
        stroke={theme.colors.dragHandle}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Зелёная галочка у подсказки под чеклистом 14×14. */
export function ChecklistHintIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
      <Rect width={14} height={14} rx={4} fill={theme.colors.success} />
      <Path
        d="M2.5 7L5.5 10.25L11.5 3.75"
        stroke={theme.colors.white}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
