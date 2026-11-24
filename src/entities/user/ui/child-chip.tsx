import { LetterAvatar } from '@shared/ui';
import { Pressable, Text, type ImageSourcePropType } from 'react-native';
import { styles } from './child-chip.styled';

/** Ребёнок в чипе: моковый (фото) или с сервера (фото может не быть). */
export type ChipChild = {
  id: string;
  name: string;
  avatar: ImageSourcePropType | null;
};

type ChildChipProps = {
  child: ChipChild;
  selected?: boolean;
  onPress?: (child: ChipChild) => void;
};

/** Чип ребёнка: фото или буква имени и имя; выбранный — с фиолетовой рамкой. */
export function ChildChip({ child, selected, onPress }: ChildChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => onPress?.(child)}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <LetterAvatar
        source={child.avatar}
        name={child.name}
        style={styles.avatar}
        tone="blue"
      />
      <Text style={styles.name}>{child.name}</Text>
    </Pressable>
  );
}
