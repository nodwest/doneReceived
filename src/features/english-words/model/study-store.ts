import { useCallback } from 'react';
import { createMMKV } from 'react-native-mmkv';
import { create } from 'zustand';

/**
 * Как ребёнок проходит слова задания: очередь (первое — на экране) и
 * запомненные. Хранится на устройстве, чтобы закрытое приложение не
 * начинало слова заново. Ключ — назначение и номера слов: поменялся список —
 * учёба начинается сначала.
 */
export interface WordsStudy {
  queue: number[];
  remembered: number[];
}

const storage = createMMKV({ id: 'words-study-v2' });

type StudyState = {
  studies: Record<string, WordsStudy>;
  set: (key: string, study: WordsStudy | null) => void;
};

const useStudyStore = create<StudyState>((set) => ({
  studies: {},
  set: (key, study) =>
    set((state) => {
      const studies = { ...state.studies };
      if (study) {
        studies[key] = study;
        storage.set(key, JSON.stringify(study));
      } else {
        delete studies[key];
        storage.remove(key);
      }
      return { studies };
    }),
}));

function load(key: string, ranks: readonly number[]): WordsStudy {
  try {
    const raw = storage.getString(key);
    if (raw) {
      const study = JSON.parse(raw) as WordsStudy;
      const known = new Set(ranks);
      if (
        Array.isArray(study.queue) &&
        Array.isArray(study.remembered) &&
        [...study.queue, ...study.remembered].every((rank) => known.has(rank))
      ) {
        return study;
      }
    }
  } catch {
    // Испорченная запись — начинаем сначала.
  }
  return { queue: [...ranks], remembered: [] };
}

/** Ребёнок уже начал учить эти слова (что-то запомнил): продолжить карточками. */
export function hasWordsStudyProgress(
  taskId: string,
  ranks: readonly number[],
) {
  return load(`${taskId}:${ranks.join(',')}`, ranks).remembered.length > 0;
}

/**
 * Учёба слов задания `taskId`: текущее слово — первое в очереди.
 * «Запомнил» убирает его в запомненные, «Напомнить» — в конец очереди.
 */
export function useWordsStudy(taskId: string, ranks: readonly number[]) {
  const key = `${taskId}:${ranks.join(',')}`;
  const stored = useStudyStore((state) => state.studies[key]);
  const setStudy = useStudyStore((state) => state.set);
  const study = stored ?? load(key, ranks);

  const remember = useCallback(() => {
    const [current, ...rest] = study.queue;
    if (current === undefined) return;
    setStudy(key, { queue: rest, remembered: [...study.remembered, current] });
  }, [key, setStudy, study]);

  const later = useCallback(() => {
    const [current, ...rest] = study.queue;
    if (current === undefined || rest.length === 0) return;
    setStudy(key, { queue: [...rest, current], remembered: study.remembered });
  }, [key, setStudy, study]);

  /** Забыть учёбу: слова сданы — после возврата на повтор начнутся сначала. */
  const clear = useCallback(() => setStudy(key, null), [key, setStudy]);

  return { ...study, remember, later, clear };
}
