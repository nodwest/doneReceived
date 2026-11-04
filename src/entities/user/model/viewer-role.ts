import { create } from 'zustand';
import type { FamilyRole } from './role';

type ViewerRoleState = {
  role: FamilyRole;
  /**
   * Ребёнок вступил в семью по коду на выборе роли. Аккаунта у ребёнка пока
   * нет, поэтому это пропуск в приложение без сессии; живёт до перезапуска.
   */
  childEntered: boolean;
  setRole: (role: FamilyRole) => void;
  /** Вступил в семью — смотрим приложение от лица ребёнка. */
  enterAsChild: () => void;
  /** Выход ребёнка: пропуск больше не действует. */
  leaveChild: () => void;
};

/**
 * ВРЕМЕННО: от чьего лица смотрим приложение — родителя (Sarah Miller) или
 * ребёнка (Emma Miller). Переключается тоглом в профиле, пока нет входа
 * ребёнка; живёт до перезапуска. Вход родителя ставит `parent`.
 */
export const useViewerRoleStore = create<ViewerRoleState>((set) => ({
  role: 'child',
  childEntered: false,
  setRole: (role) => set({ role }),
  enterAsChild: () => set({ role: 'child', childEntered: true }),
  leaveChild: () => set({ childEntered: false }),
}));

export const useViewerRole = () => useViewerRoleStore((state) => state.role);
