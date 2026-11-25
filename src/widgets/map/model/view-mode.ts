import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';

/** Как смотреть карту: привычная плоская или объёмная с домами и деревьями. */
export type MapViewMode = '2d' | '3d';

/** Наклон и поворот объёмной карты — те же, что в эталоне рендера. */
export const MAP_3D_PITCH = 54;
export const MAP_3D_BEARING = -26;

const storage = createMMKV({ id: 'settings' });
const STORAGE_KEY = 'map-view-mode';

const readMode = (): MapViewMode =>
  storage.getString(STORAGE_KEY) === '3d' ? '3d' : '2d';

type MapViewModeState = {
  mode: MapViewMode;
  /** Выбрать режим карты кнопкой 2D / 3D. */
  setMode: (mode: MapViewMode) => void;
};

export const useMapViewModeStore = create<MapViewModeState>((set) => ({
  mode: readMode(),
  setMode: (mode) =>
    set(() => {
      storage.set(STORAGE_KEY, mode);
      return { mode };
    }),
}));

/** Текущий режим карты без подписки на стор. */
export const mapViewMode = () => useMapViewModeStore.getState().mode;
