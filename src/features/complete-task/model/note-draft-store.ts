import { create } from 'zustand';

type NoteDraftState = {
  /** Набранный, но ещё не отправленный комментарий по id задания. */
  drafts: Record<string, string>;
  setDraft: (taskId: string, value: string) => void;
  clearDraft: (taskId: string) => void;
};

/**
 * Черновики комментариев к сдаче: ребёнок пишет в карточке, а I did it! может
 * нажать и в плитке списка — поэтому текст живёт здесь, а не в карточке.
 * Только в памяти: после перезапуска черновик пропадает.
 */
export const useNoteDraftStore = create<NoteDraftState>((set) => ({
  drafts: {},
  setDraft: (taskId, value) =>
    set((state) => ({ drafts: { ...state.drafts, [taskId]: value } })),
  clearDraft: (taskId) =>
    set((state) => {
      const { [taskId]: _removed, ...drafts } = state.drafts;
      return { drafts };
    }),
}));

/** Поле комментария задания: значение и смена — для `ChildTaskCard`. */
export function useNoteDraft(taskId: string) {
  const value = useNoteDraftStore((state) => state.drafts[taskId] ?? '');
  const setDraft = useNoteDraftStore((state) => state.setDraft);
  return { value, onChange: (next: string) => setDraft(taskId, next) };
}
