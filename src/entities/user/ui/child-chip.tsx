import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
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
      {child.avatar ? (
        <Image source={child.avatar} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.initial]}>
          <Text style={styles.letter}>
            {child.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.name}>{child.name}</Text>
    </Pressable>
  );
}
