import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';
import { useSessionStore } from '@entities/session';

export type MapLayerKey = 'family' | 'transport' | 'areas';

/** Категории, внутри которых скрывают отдельные пункты на экране слоёв. */
export type HiddenLayerKey = 'children' | 'routes' | 'zones';

export type MapLayerVisibility = Record<MapLayerKey, boolean>;

/** Что показывать на карте: слой целиком и отдельные скрытые пункты. */
export type MapLayerSettings = MapLayerVisibility & {
  /** id аккаунтов участников, которых скрыли. */
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

/** Какие разделы «Слоёв карты» раскрыты. По умолчанию все свёрнуты. */
export type MapLayerSections = Record<MapLayerKey, boolean>;

/** Цвета по умолчанию: родитель — фиолетовый, ребёнок — зелёный. */
export const DEFAULT_PARENT_MARKER_COLOR = '#6C5CE7';
export const DEFAULT_CHILD_MARKER_COLOR = '#2EB873';

export const defaultMapColor = (kind: 'parent' | 'child') =>
  kind === 'child' ? DEFAULT_CHILD_MARKER_COLOR : DEFAULT_PARENT_MARKER_COLOR;

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

const DEFAULT_SECTIONS: MapLayerSections = {
  family: false,
  transport: false,
  areas: false,
};

type LoadedSettings = MapLayerSettings & {
  openSections: MapLayerSections;
  /**
   * Аккаунт, которому принадлежат скрытые пункты. Скрытие локальное, но при
   * смене пользователя на одном устройстве старые id не должны скрывать
   * участников новой семьи.
   */
  ownerUserId: string | null;
};

const asBoolean = (value: unknown, fallback: boolean) =>
  typeof value === 'boolean' ? value : fallback;

const asIds = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

function loadSettings(): LoadedSettings {
  const value =
    storage.getString(STORAGE_KEY) ?? storage.getString(LEGACY_STORAGE_KEY);
  if (!value) {
    return {
      ...DEFAULT_SETTINGS,
      openSections: DEFAULT_SECTIONS,
      ownerUserId: null,
    };
  }

  try {
    const parsed = JSON.parse(value) as Partial<LoadedSettings>;
    const sections = parsed.openSections;
    return {
      family: asBoolean(parsed.family, DEFAULT_SETTINGS.family),
      transport: asBoolean(parsed.transport, DEFAULT_SETTINGS.transport),
      areas: asBoolean(parsed.areas, DEFAULT_SETTINGS.areas),
      hiddenChildren: asIds(parsed.hiddenChildren),
      hiddenRoutes: asIds(parsed.hiddenRoutes),
      hiddenZones: asIds(parsed.hiddenZones),
      pinnedRoutes: asIds(parsed.pinnedRoutes),
      openSections: {
        family: asBoolean(sections?.family, DEFAULT_SECTIONS.family),
        transport: asBoolean(sections?.transport, DEFAULT_SECTIONS.transport),
        areas: asBoolean(sections?.areas, DEFAULT_SECTIONS.areas),
      },
      ownerUserId:
        typeof parsed.ownerUserId === 'string' ? parsed.ownerUserId : null,
    };
  } catch {
    return {
      ...DEFAULT_SETTINGS,
      openSections: DEFAULT_SECTIONS,
      ownerUserId: null,
    };
  }
}

function persist(state: LoadedSettings) {
  const value: LoadedSettings = {
    family: state.family,
    transport: state.transport,
    areas: state.areas,
    hiddenChildren: state.hiddenChildren,
    hiddenRoutes: state.hiddenRoutes,
    hiddenZones: state.hiddenZones,
    pinnedRoutes: state.pinnedRoutes,
    openSections: state.openSections,
    ownerUserId: state.ownerUserId,
  };
  storage.set(STORAGE_KEY, JSON.stringify(value));
}

const HIDDEN_FIELD: Record<HiddenLayerKey, keyof MapLayerSettings> = {
  children: 'hiddenChildren',
  routes: 'hiddenRoutes',
  zones: 'hiddenZones',
};

type MapLayerState = LoadedSettings & {
  /** Включить или выключить слой целиком. */
  setLayer: (key: MapLayerKey, value: boolean) => void;
  /** Переключить слой целиком (панель на карте). */
  toggle: (key: MapLayerKey) => void;
  /** Заменить список скрытых пунктов категории. */
  setHidden: (key: HiddenLayerKey, ids: string[]) => void;
  /** Заменить список маршрутов, добавленных в «Транспорт». */
  setPinnedRoutes: (routes: string[]) => void;
  /** Раскрыть или свернуть раздел; больше никто его не трогает. */
  toggleSection: (key: MapLayerKey) => void;
  /** Показать всё: слои целиком и все пункты. */
  showAll: () => void;
  /** Сменить аккаунт: чужие локальные скрытия не переносим. */
  syncOwner: (userId: string | null) => void;
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
  toggleSection: (key) =>
    set((state) => {
      const next = {
        ...state,
        openSections: {
          ...state.openSections,
          [key]: !state.openSections[key],
        },
      };
      persist(next);
      return next;
    }),
  showAll: () =>
    set((state) => {
      const next: LoadedSettings = {
        ...DEFAULT_SETTINGS,
        pinnedRoutes: state.pinnedRoutes,
        openSections: state.openSections,
        ownerUserId: state.ownerUserId,
      };
      persist(next);
      return next;
    }),
  syncOwner: (userId) =>
    set((state) => {
      if (!userId || state.ownerUserId === userId) return state;
      // Другой аккаунт на этом устройстве не должен наследовать ни скрытые
      // пункты, ни выключенные слои прошлого пользователя.
      const next: LoadedSettings = {
        ...DEFAULT_SETTINGS,
        openSections: state.openSections,
        ownerUserId: userId,
      };
      persist(next);
      return next;
    }),
}));

// На одном устройстве могут входить разные аккаунты (например, родитель
// проверяет вид ребёнка). Локальные скрытия нельзя переносить между ними.
useSessionStore.subscribe((state) => {
  useMapLayerStore.getState().syncOwner(state.session?.user.id ?? null);
});
useMapLayerStore
  .getState()
  .syncOwner(useSessionStore.getState().session?.user.id ?? null);
