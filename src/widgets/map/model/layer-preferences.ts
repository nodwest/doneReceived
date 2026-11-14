import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';

export type MapLayerKey = 'family' | 'transport' | 'areas';

/** Категории, внутри которых скрывают отдельные пункты на экране слоёв. */
export type HiddenLayerKey = 'children' | 'routes' | 'zones';

export type MapLayerVisibility = Record<MapLayerKey, boolean>;

/** Что показывать на карте: слой целиком и отдельные скрытые пункты. */
export type MapLayerSettings = MapLayerVisibility & {
  /** id профилей детей, которых скрыли. */
  hiddenChildren: string[];
  /** Ключи маршрутов (`busRouteKey`), которые скрыли. */
  hiddenRoutes: string[];
  /** id геозон, которые скрыли. */
  hiddenZones: string[];
  /**
   * Маршруты, добавленные в «Транспорт». Пока список пуст, карта показывает
   * весь живой транспорт (как до настройки), иначе — только выбранные.
   */
  pinnedRoutes: string[];
};

const storage = createMMKV({ id: 'settings' });
const STORAGE_KEY = 'map-layer-preferences';
// Старый формат: только три переключателя слоёв целиком.
const LEGACY_STORAGE_KEY = 'map-layer-visibility';

const DEFAULT_SETTINGS: MapLayerSettings = {
  family: true,
  transport: true,
  areas: true,
  hiddenChildren: [],
  hiddenRoutes: [],
  hiddenZones: [],
  pinnedRoutes: [],
};

const asBoolean = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback;

const asIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

function loadSettings(): MapLayerSettings {
  const value =
    storage.getString(STORAGE_KEY) ?? storage.getString(LEGACY_STORAGE_KEY);
  if (!value) return DEFAULT_SETTINGS;

  try {
    const parsed = JSON.parse(value) as Partial<MapLayerSettings>;
    return {
      family: asBoolean(parsed.family, DEFAULT_SETTINGS.family),
      transport: asBoolean(parsed.transport, DEFAULT_SETTINGS.transport),
      areas: asBoolean(parsed.areas, DEFAULT_SETTINGS.areas),
      hiddenChildren: asIds(parsed.hiddenChildren),
      hiddenRoutes: asIds(parsed.hiddenRoutes),
      hiddenZones: asIds(parsed.hiddenZones),
      pinnedRoutes: asIds(parsed.pinnedRoutes),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function persist(state: MapLayerSettings) {
  const value: MapLayerSettings = {
    family: state.family,
    transport: state.transport,
    areas: state.areas,
    hiddenChildren: state.hiddenChildren,
    hiddenRoutes: state.hiddenRoutes,
    hiddenZones: state.hiddenZones,
    pinnedRoutes: state.pinnedRoutes,
  };
  storage.set(STORAGE_KEY, JSON.stringify(value));
}

const HIDDEN_FIELD: Record<HiddenLayerKey, keyof MapLayerSettings> = {
  children: 'hiddenChildren',
  routes: 'hiddenRoutes',
  zones: 'hiddenZones',
};

type MapLayerState = MapLayerSettings & {
  /** Включить или выключить слой целиком. */
  setLayer: (key: MapLayerKey, value: boolean) => void;
  /** Переключить слой целиком (панель на карте). */
  toggle: (key: MapLayerKey) => void;
  /** Заменить список скрытых пунктов категории. */
  setHidden: (key: HiddenLayerKey, ids: string[]) => void;
  /** Заменить список маршрутов, добавленных в «Транспорт». */
  setPinnedRoutes: (routes: string[]) => void;
  /** Показать всё: слои целиком и все пункты. */
  showAll: () => void;
};

export const useMapLayerStore = create<MapLayerState>((set) => ({
  ...loadSettings(),
  setLayer: (key, value) =>
    set((state) => {
      const next = { ...state, [key]: value };
      persist(next);
      return next;
    }),
  toggle: (key) =>
    set((state) => {
      const next = { ...state, [key]: !state[key] };
      persist(next);
      return next;
    }),
  setHidden: (key, ids) =>
    set((state) => {
      const next = { ...state, [HIDDEN_FIELD[key]]: ids };
      persist(next);
      return next;
    }),
  setPinnedRoutes: (routes) =>
    set((state) => {
      const next = { ...state, pinnedRoutes: routes };
      persist(next);
      return next;
    }),
  showAll: () =>
    set((state) => {
      const next: MapLayerSettings = {
        family: true,
        transport: true,
        areas: true,
        hiddenChildren: [],
        hiddenRoutes: [],
        hiddenZones: [],
        pinnedRoutes: state.pinnedRoutes,
      };
      persist(next);
      return next;
    }),
}));
