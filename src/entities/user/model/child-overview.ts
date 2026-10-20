import type { ImageSourcePropType } from 'react-native';

/** Ребёнок со сводкой для карточки на главной родителя. */
export interface ChildOverview {
  id: number;
  name: string;
  avatar: ImageSourcePropType;
  activeTasks: number;
  reviewTasks: number;
  /** Ребёнок сейчас дома: на карточке показываем значок домика. */
  atHome: boolean;
}
