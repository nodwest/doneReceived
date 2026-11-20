import { withAlpha } from '@shared/lib';
import { theme, themedValue } from '@shared/theme';
import type { FamilyRole } from '../model/role';

type RoleColors = {
  /** Иконка роли: родитель тёмно-синий, ребёнок голубой. */
  icon: readonly [string, string];
  /** Фон блока роли: лёгкий градиент. */
  tint: readonly [string, string];
  border: string;
};

/**
 * Цвета ролей: обводка и подложка карточек и аватаров на вкладке Family.
 * Значение ленивое — при смене темы отдаёт оттенки новой палитры.
 */
export const ROLE_COLORS = themedValue<Record<FamilyRole, RoleColors>>(() => {
  const { parentFrom, parentTo, childFrom, childTo } = theme.colors;
  return {
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
});
