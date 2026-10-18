import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useIsCompact } from '@shared/lib';
import { CHIP_COMPACT_WIDTH } from './option-chip';
import { styles } from './create-task-form.styled';

/** Ряд чипов на всю ширину без переноса; на узких экранах зазор меньше. */
export function ChipRow({ children }: { children: ReactNode }) {
  const compact = useIsCompact(CHIP_COMPACT_WIDTH);

  return (
    <View style={[styles.chipRow, compact && styles.chipRowCompact]}>
      {children}
    </View>
  );
}
