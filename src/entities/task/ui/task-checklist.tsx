import { Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { ChecklistItem } from '../model';
import { SectionLabel } from './task-sheet';
import { styles as sheetStyles } from './task-sheet.styled';
import { styles } from './task-checklist.styled';

type TaskChecklistProps = {
  label: string;
  items: readonly ChecklistItem[];
  /** Справа от заголовка: «3 of 7» у ребёнка, «3 of 7 done» у родителя. */
  progress: string;
  /** Подсказка под списком. */
  hint?: string;
  /** Ребёнок отмечает шаг; без него список только для просмотра. */
  onToggle?: (item: ChecklistItem) => void;
};

/**
 * Чеклист в карточке задания: полоса прогресса и шаги. Сделанные — на
 * бледно-зелёной подложке с зелёной галочкой, остальные — на белом.
 */
export function TaskChecklist({
  label,
  items,
  progress,
  hint,
  onToggle,
}: TaskChecklistProps) {
  const done = items.filter((item) => item.done).length;

  return (
    <View style={sheetStyles.section}>
      <View style={sheetStyles.sectionHead}>
        <SectionLabel>{label}</SectionLabel>
        <Text style={styles.progress}>{progress}</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={[theme.colors.heroPaidFrom, theme.colors.earned]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.bar, { width: `${(done / items.length) * 100}%` }]}
        />
      </View>
      <View style={styles.list}>
        {items.map((item, index) => (
          <Step
            key={item.id}
            item={item}
            first={index === 0}
            onToggle={onToggle}
          />
        ))}
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

type StepProps = {
  item: ChecklistItem;
  first: boolean;
  onToggle?: (item: ChecklistItem) => void;
};

function Step({ item, first, onToggle }: StepProps) {
  const content = (
    <>
      {item.done ? (
        <LinearGradient
          colors={[theme.colors.heroPaidFrom, theme.colors.earned]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.box}
        >
          <Icon name="check" size={16} color={theme.colors.white} />
        </LinearGradient>
      ) : (
        <View style={[styles.box, styles.boxEmpty]} />
      )}
      <Text style={styles.title}>{item.title}</Text>
    </>
  );
  const rowStyle = [
    styles.step,
    !first && styles.divider,
    item.done && styles.stepDone,
  ];

  if (!onToggle) {
    return (
      <View
        accessible
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.done, disabled: true }}
        style={rowStyle}
      >
        {content}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: item.done }}
      onPress={() => onToggle(item)}
      style={({ pressed }) => [rowStyle, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}
