import { create } from 'zustand';

export type SharingError =
  | 'permission'
  | 'notifications'
  | 'services'
  | 'start'
  | null;

type SharingState = {
  owner: string | null;
  enabled: boolean;
  foreground: boolean;
  background: boolean;
  limited: boolean;
  services: boolean;
  error: SharingError;
  checking: boolean;
  setOwner: (owner: string | null) => void;
  setEnabled: (enabled: boolean) => void;
  setStatus: (status: {
    foreground: boolean;
    background: boolean;
    limited: boolean;
    services: boolean;
  }) => void;
  setError: (error: SharingError) => void;
  setChecking: (checking: boolean) => void;
  reset: () => void;
};

const initial = {
  owner: null,
  enabled: false,
  foreground: false,
  background: false,
  limited: false,
  services: true,
  error: null as SharingError,
  checking: false,
};

export const useLocationSharingStore = create<SharingState>((set) => ({
  ...initial,
  setOwner: (owner) =>
    set((state) => (state.owner === owner ? state : { ...initial, owner })),
  setEnabled: (enabled) => set({ enabled }),
  setStatus: ({ foreground, background, limited, services }) =>
    set({ foreground, background, limited, services }),
  setError: (error) => set({ error }),
  setChecking: (checking) => set({ checking }),
  reset: () => set({ ...initial }),
}));
