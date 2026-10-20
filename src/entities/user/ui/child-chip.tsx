import { Image, Pressable, Text } from 'react-native';
import type { Child } from '../model/child';
import { styles } from './child-chip.styled';

type ChildChipProps = {
  child: Child;
  selected?: boolean;
  onPress?: (child: Child) => void;
};

export function ChildChip({ child, selected, onPress }: ChildChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={() => onPress?.(child)}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Image source={child.avatar} style={styles.avatar} />
      <Text style={styles.name}>{child.name}</Text>
    </Pressable>
  );
}
