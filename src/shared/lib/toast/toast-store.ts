import { create } from 'zustand';

type ToastKind = 'success' | 'error';

type ToastState = {
  id: number;
  message: string | null;
  kind: ToastKind;
  show: (message: string, kind?: ToastKind) => void;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  id: 0,
  message: null,
  kind: 'success',
  show: (message, kind = 'success') =>
    set((state) => ({ id: state.id + 1, message, kind })),
  hide: () => set({ message: null }),
}));

export const showToast = (message: string, kind?: ToastKind) =>
  useToastStore.getState().show(message, kind);
