import { withAlpha } from '@shared/lib';
import { theme } from '@shared/theme';
import type { FamilyRole } from '../model/role';

type RoleColors = {
  /** Иконка роли: насыщенный градиент. */
  icon: readonly [string, string];
  /** Фон блоков роли: тот же цвет, еле заметный. */
  tint: readonly [string, string];
  border: string;
};

const { parentFrom, parentTo, childFrom, childTo } = theme.colors;

/** Цвета ролей: блоки кодов приглашения и карточки участников семьи. */
export const ROLE_COLORS: Record<FamilyRole, RoleColors> = {
  parent: {
    icon: [parentTo, parentFrom],
    tint: [withAlpha(parentFrom, 0.14), withAlpha(parentTo, 0.08)],
    border: withAlpha(parentTo, 0.18),
  },
  child: {
    icon: [childTo, childFrom],
    tint: [withAlpha(childFrom, 0.16), withAlpha(childTo, 0.09)],
    border: withAlpha(childFrom, 0.18),
  },
};
