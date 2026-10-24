import { theme } from '@shared/theme';
import type { OperationKind } from '../model/operation';

type KindColors = {
  /** Лицевая грань. */
  front: string;
  /** Боковая грань, в тени. */
  side: string;
  /** Верхняя грань, на свету. */
  top: string;
  /** Подпись суммы на лицевой грани. */
  label: string;
  /** Текст и фон плашки с итогом. */
  ink: string;
  soft: string;
};

/** Цвета 3D-кубиков и плашек по виду операции. */
export const OPERATION_KIND_COLORS: Record<OperationKind, KindColors> = {
  earned: {
    front: theme.colors.earned,
    side: theme.colors.earnedDark,
    top: theme.colors.earnedLight,
    label: theme.colors.earnedLabel,
    ink: theme.colors.earnedInk,
    soft: theme.colors.earnedSoft,
  },
  missed: {
    front: theme.colors.missed,
    side: theme.colors.missedDark,
    top: theme.colors.missedLight,
    label: theme.colors.missedLabel,
    ink: theme.colors.missedInk,
    soft: theme.colors.missedSoft,
  },
};
