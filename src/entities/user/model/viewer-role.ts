import { create } from 'zustand';
import type { FamilyRole } from './role';

type ViewerRoleState = {
  role: FamilyRole;
  setRole: (role: FamilyRole) => void;
};

/**
 * ВРЕМЕННО: от чьего лица смотрим приложение — родителя (Sarah Miller) или
 * ребёнка (Emma Miller). Переключается тоглом в профиле, пока нет входа
 * ребёнка; живёт до перезапуска.
 */
export const useViewerRoleStore = create<ViewerRoleState>((set) => ({
  role: 'parent',
  setRole: (role) => set({ role }),
}));

export const useViewerRole = () => useViewerRoleStore((state) => state.role);
