import { create } from 'zustand';
import type { FamilyRole } from './role';

type ViewerRoleState = {
  role: FamilyRole;
  setRole: (role: FamilyRole) => void;
};

/**
 * От чьего лица смотрим приложение — родителя или ребёнка. Ставится по
 * `kind` вошедшего аккаунта (вход, подключение устройства ребёнка, поднятая
 * при запуске сессия). ВРЕМЕННО родитель переключает его тоглом Child mode в
 * профиле, чтобы посмотреть экраны ребёнка (Emma) на моках.
 */
export const useViewerRoleStore = create<ViewerRoleState>((set) => ({
  role: 'parent',
  setRole: (role) => set({ role }),
}));

export const useViewerRole = () => useViewerRoleStore((state) => state.role);
