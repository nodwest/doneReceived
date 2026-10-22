import { useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChildChip, type Child } from '@entities/user';
import type { UpdateTaskPayload } from '@entities/task';
import { Input } from '@shared/ui';
import { theme } from '@shared/theme';
import {
  buildCreateTaskPayload,
  useCreateTaskStore,
} from '../model/create-task-store';
import { isDeadlineValid } from '../model/deadline';
import { useCreateTask } from '../model/use-create-task';
import { useUpdateTask } from '../model/use-update-task';
import { CreateTaskButton } from './create-task-button';
import { DeadlineField } from './deadline-field';
import { DescriptionInput } from './description-input';
import { FormField } from './form-field';
import { RewardInput } from './reward-input';
import { styles } from './create-task-form.styled';

type CreateTaskFormProps = {
  assignees: readonly Child[];
  rewardPresets: readonly number[];
  /** Задача для редактирования; без неё форма создаёт новую. Берётся при открытии. */
  task?: UpdateTaskPayload;
  /** Задача создана или обновлена. */
  onSubmitted: () => void;
};

export function CreateTaskForm({
  assignees,
  rewardPresets,
  task,
  onSubmitted,
}: CreateTaskFormProps) {
  const insets = useSafeAreaInsets();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isPending = createTask.isPending || updateTask.isPending;
  // Снимок задачи на момент открытия: фоновое перечитывание списка не должно
  // затирать то, что родитель уже начал править.
  const [initialTask] = useState(task);

  const title = useCreateTaskStore((state) => state.title);
  const description = useCreateTaskStore((state) => state.description);
  const reward = useCreateTaskStore((state) => state.reward);
  const deadline = useCreateTaskStore((state) => state.deadline);
  const assigneeId = useCreateTaskStore((state) => state.assigneeId);
  const setTitle = useCreateTaskStore((state) => state.setTitle);
  const setDescription = useCreateTaskStore((state) => state.setDescription);
  const setAssignee = useCreateTaskStore((state) => state.setAssignee);
  const fill = useCreateTaskStore((state) => state.fill);
  const reset = useCreateTaskStore((state) => state.reset);

  // Форма начинается с чистого листа при каждом открытии, а при редактировании
  // сразу заполняется данными задачи (до отрисовки, чтобы пустая форма не мелькала).
  useLayoutEffect(() => {
    if (initialTask) fill(initialTask);
    return reset;
  }, [initialTask, fill, reset]);

  const canSubmit =
    !isPending &&
    Number(reward) > 0 &&
    title.trim().length > 0 &&
    assigneeId !== null &&
    isDeadlineValid(deadline);

  const submit = async () => {
    const payload = buildCreateTaskPayload(useCreateTaskStore.getState());
    if (!payload || isPending) return;
    if (initialTask) {
      await updateTask.mutateAsync({ ...payload, id: initialTask.id });
    } else {
      await createTask.mutateAsync(payload);
    }
    onSubmitted();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: Math.max(insets.bottom, 24),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField label="Task Title">
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Clean your room"
            placeholderTextColor={theme.colors.placeholder}
            style={styles.input}
          />
        </FormField>

        <DeadlineField />

        <RewardInput presets={rewardPresets} />

        <FormField label="Description" optional>
          <DescriptionInput value={description} onChangeText={setDescription} />
        </FormField>

        <FormField label="Assign to">
          <View style={styles.chips}>
            {assignees.map((child) => (
              <ChildChip
                key={child.id}
                child={child}
                selected={assigneeId === child.id}
                onPress={({ id }) => setAssignee(id)}
              />
            ))}
          </View>
        </FormField>

        <View style={styles.footer}>
          <CreateTaskButton
            label={initialTask ? 'Save changes' : 'Create Task'}
            withIcon={false}
            disabled={!canSubmit}
            onPress={submit}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
