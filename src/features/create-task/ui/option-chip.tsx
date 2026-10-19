import { Pressable, Text } from 'react-native';
import { useIsCompact } from '@shared/lib';
import { styles } from './create-task-form.styled';

// 360pt-телефоны тоже считаем узкими: три чипа в ряд впритык.
export const CHIP_COMPACT_WIDTH = 375;

type OptionChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export function OptionChip({ label, selected, onPress }: OptionChipProps) {
  const compact = useIsCompact(CHIP_COMPACT_WIDTH);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        compact && styles.chipCompact,
        selected && styles.chipSelected,
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={[styles.chipText, selected && styles.chipTextSelected]}
      >
        {label}
      </Text>
    </Pressable>
  );
}
