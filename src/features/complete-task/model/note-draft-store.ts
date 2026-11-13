import type { ImageSourcePropType } from 'react-native';
import { create } from 'zustand';
import { TASK_PHOTOS_MAX } from '@entities/task';
import { choosePhotos, type PhotoSource, type PickedPhoto } from '@shared/lib';

type NoteDraftState = {
  /** Набранный, но ещё не отправленный комментарий по id задания. */
  drafts: Record<string, string>;
  /** Выбранные, но ещё не отправленные фото-отчёта по id задания. */
  photos: Record<string, PickedPhoto[]>;
  setDraft: (taskId: string, value: string) => void;
  clearDraft: (taskId: string) => void;
  addPhotos: (taskId: string, photos: readonly PickedPhoto[]) => void;
  removePhoto: (taskId: string, index: number) => void;
};

const without = <T>(record: Record<string, T>, key: string) => {
  const { [key]: _removed, ...rest } = record;
  return rest;
};

/**
 * Черновики сдачи: комментарий и фото. Ребёнок готовит их в карточке, а I did
 * it! может нажать и в плитке списка — поэтому они живут здесь, а не в
 * карточке. Только в памяти: после перезапуска черновик пропадает.
 */
export const useNoteDraftStore = create<NoteDraftState>((set) => ({
  drafts: {},
  photos: {},
  setDraft: (taskId, value) =>
    set((state) => ({ drafts: { ...state.drafts, [taskId]: value } })),
  // Отчёт ушёл: забываем и комментарий, и фото.
  clearDraft: (taskId) =>
    set((state) => ({
      drafts: without(state.drafts, taskId),
      photos: without(state.photos, taskId),
    })),
  addPhotos: (taskId, picked) =>
    set((state) => ({
      photos: {
        ...state.photos,
        [taskId]: [...(state.photos[taskId] ?? []), ...picked].slice(
          0,
          TASK_PHOTOS_MAX,
        ),
      },
    })),
  removePhoto: (taskId, index) =>
    set((state) => ({
      photos: {
        ...state.photos,
        [taskId]: (state.photos[taskId] ?? []).filter((_, i) => i !== index),
      },
    })),
}));

/** Поле комментария задания: значение и смена — для `ChildTaskCard`. */
export function useNoteDraft(taskId: string) {
  const value = useNoteDraftStore((state) => state.drafts[taskId] ?? '');
  const setDraft = useNoteDraftStore((state) => state.setDraft);
  return { value, onChange: (next: string) => setDraft(taskId, next) };
}

const NO_PHOTOS: PickedPhoto[] = [];

/**
 * Фото-отчёт задания для `ChildTaskCard`: выбранные фото, снять или выбрать
 * ещё (пока меньше TASK_PHOTOS_MAX) и убрать.
 */
export function usePhotoDraft(taskId: string) {
  const picked = useNoteDraftStore(
    (state) => state.photos[taskId] ?? NO_PHOTOS,
  );
  const { addPhotos, removePhoto } = useNoteDraftStore.getState();
  const add = async (source: PhotoSource) =>
    addPhotos(
      taskId,
      await choosePhotos(source, TASK_PHOTOS_MAX - picked.length),
    );
  return {
    items: picked.map((photo): ImageSourcePropType => ({ uri: photo.uri })),
    canAdd: picked.length < TASK_PHOTOS_MAX,
    onTakePhoto: () => add('camera'),
    onPickPhoto: () => add('library'),
    onRemove: (index: number) => removePhoto(taskId, index),
  };
}
