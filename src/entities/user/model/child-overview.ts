import type { ImageSourcePropType } from 'react-native';

/** Ребёнок со сводкой для карточки на главной родителя. */
export interface ChildOverview {
  /** У моков число строкой, у детей с сервера — UUID. */
  id: string;
  name: string;
  /** Фото; null — первая буква имени (у детей с сервера фото пока нет). */
  avatar: ImageSourcePropType | null;
  activeTasks: number;
  reviewTasks: number;
  /** Ребёнок сейчас дома: на карточке показываем значок домика. */
  atHome: boolean;
}
