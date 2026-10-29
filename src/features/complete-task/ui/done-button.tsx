import { Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { useTaskActions } from '../model/use-task-actions';
import { styles } from './done-button.styled';

type DoneButtonProps = {
  task: Task;
  /** md — плитка на главной, sm — строка списка. */
  size?: 'md' | 'sm';
};

/** Голубая кнопка I did it! внутри плитки или строки задания. */
export function DoneButton({ task, size = 'md' }: DoneButtonProps) {
  const { t } = useTranslation();
  const { markDone, isPending } = useTaskActions();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('completeTask.done')}
      disabled={isPending}
      onPress={() => markDone(task)}
      style={({ pressed }) => [
        styles.button,
        styles[size],
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={[theme.colors.childFrom, theme.colors.childDeep]}
        start={{ x: 0.4, y: 0 }}
        end={{ x: 0.6, y: 1 }}
        locations={[0, 0.7071]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={[styles.label, size === 'sm' && styles.labelSm]}>
        {t('completeTask.done')}
      </Text>
    </Pressable>
  );
}
