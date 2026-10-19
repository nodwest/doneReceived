import { Pressable, Text, View } from 'react-native';
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
      <View style={[styles.dot, { backgroundColor: child.color }]}>
        <Text style={styles.initial}>{child.name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{child.name}</Text>
    </Pressable>
  );
}
