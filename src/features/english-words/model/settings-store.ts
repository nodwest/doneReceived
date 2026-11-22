import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';

/**
 * Что помнит это устройство (награда и остальное — на сервере):
 * - ребёнок уже видел объяснение, как всё устроено;
 * - ребёнок уже листал карточку слова вбок и закрывал её свайпом — подсказка
 *   жестов под карточкой больше не нужна.
 */
const storage = createMMKV({ id: 'words-settings-v2' });

const INTRO_KEY = 'child-intro-seen';
const PAGED_KEY = 'viewer-paged';
const SWIPE_CLOSED_KEY = 'viewer-swipe-closed';

type SettingsState = {
  introSeen: boolean;
  viewerPaged: boolean;
  viewerSwipeClosed: boolean;
  setViewerPaged: () => void;
  setViewerSwipeClosed: () => void;
  setIntroSeen: (seen: boolean) => void;
};

const useSettingsStore = create<SettingsState>((set) => ({
  introSeen: storage.getBoolean(INTRO_KEY) ?? false,
  viewerPaged: storage.getBoolean(PAGED_KEY) ?? false,
  viewerSwipeClosed: storage.getBoolean(SWIPE_CLOSED_KEY) ?? false,
  setViewerPaged: () => {
    storage.set(PAGED_KEY, true);
    set({ viewerPaged: true });
  },
  setViewerSwipeClosed: () => {
    storage.set(SWIPE_CLOSED_KEY, true);
    set({ viewerSwipeClosed: true });
  },
  setIntroSeen: (seen) => {
    storage.set(INTRO_KEY, seen);
    set({ introSeen: seen });
  },
}));

/** Ребёнок видел объяснение (показываем при первом входе на вкладку). */
export function useWordsIntro() {
  const seen = useSettingsStore((state) => state.introSeen);
  const setIntroSeen = useSettingsStore((state) => state.setIntroSeen);
  return { seen, setSeen: setIntroSeen };
}

/**
 * Подсказка жестов под карточкой слова — как обучалка: показываем, пока
 * ребёнок хотя бы раз не листнул карточку вбок и не закрыл её свайпом.
 */
export function useViewerHint() {
  const paged = useSettingsStore((state) => state.viewerPaged);
  const closed = useSettingsStore((state) => state.viewerSwipeClosed);
  const markPaged = useSettingsStore((state) => state.setViewerPaged);
  const markClosed = useSettingsStore((state) => state.setViewerSwipeClosed);
  return { show: !(paged && closed), markPaged, markClosed };
}
