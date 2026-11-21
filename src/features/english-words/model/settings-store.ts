import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';

/**
 * Настройки слов на этом устройстве. ВРЕМЕННО, пока их нет на сервере:
 * - награда за сданный день — у родителя, отдельно для каждой семьи
 *   (с ней создаются задания со словами);
 * - ребёнок уже видел объяснение, как всё устроено;
 * - ребёнок уже листал карточку слова вбок и закрывал её свайпом — подсказка
 *   жестов под карточкой больше не нужна.
 */
const storage = createMMKV({ id: 'words-settings-v2' });

const rewardKey = (familyId: string) => `reward:${familyId}`;
const INTRO_KEY = 'child-intro-seen';
const PAGED_KEY = 'viewer-paged';
const SWIPE_CLOSED_KEY = 'viewer-swipe-closed';

function readReward(familyId: string) {
  const value = storage.getNumber(rewardKey(familyId));
  return value !== undefined && value > 0 ? value : null;
}

type SettingsState = {
  rewards: Record<string, number | null>;
  introSeen: boolean;
  viewerPaged: boolean;
  viewerSwipeClosed: boolean;
  setViewerPaged: () => void;
  setViewerSwipeClosed: () => void;
  setReward: (familyId: string, reward: number) => void;
  setIntroSeen: (seen: boolean) => void;
};

const useSettingsStore = create<SettingsState>((set) => ({
  rewards: {},
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
  setReward: (familyId, reward) => {
    storage.set(rewardKey(familyId), reward);
    set((state) => ({ rewards: { ...state.rewards, [familyId]: reward } }));
  },
  setIntroSeen: (seen) => {
    storage.set(INTRO_KEY, seen);
    set({ introSeen: seen });
  },
}));

/**
 * Сколько родитель платит за сданный день; null — ещё не выбрал (первый
 * вход на вкладку). Без семьи — null.
 */
export function useWordsReward(familyId: string | null) {
  const stored = useSettingsStore((state) =>
    familyId ? state.rewards[familyId] : undefined,
  );
  const setReward = useSettingsStore((state) => state.setReward);
  const reward =
    stored !== undefined ? stored : familyId ? readReward(familyId) : null;
  return {
    reward,
    setReward: (value: number) => {
      if (familyId) setReward(familyId, value);
    },
  };
}

/** Награда за день для мутаций (вне React). */
export const getWordsReward = (familyId: string | null) =>
  familyId
    ? (useSettingsStore.getState().rewards[familyId] ?? readReward(familyId))
    : null;

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
