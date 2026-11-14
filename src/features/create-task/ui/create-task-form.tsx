import { useEffect, useLayoutEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChildChip, type ChipChild } from '@entities/user';
import type { UpdateTaskPayload } from '@entities/task';
import {
  formatMoney,
  getParentFunds,
  type ParentFunds,
} from '@entities/wallet';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { keepInViewScrollStyle, showToast, useKeepInView } from '@shared/lib';
import { Input } from '@shared/ui';
import { theme } from '@shared/theme';
import {
  buildCreateTaskPayload,
  useCreateTaskStore,
} from '../model/create-task-store';
import { isDeadlineValid } from '../model/deadline';
import { useCreateTask } from '../model/use-create-task';
import { useUpdateTask } from '../model/use-update-task';
import { ChecklistField } from './checklist-field';
import { CreateTaskButton } from './create-task-button';
import { DeadlineField } from './deadline-field';
import { DescriptionInput } from './description-input';
import { FormField } from './form-field';
import { RewardBudget } from './reward-budget';
import { RewardInput } from './reward-input';
import { styles } from './create-task-form.styled';

/** Отступ под строкой Add step, когда форма её докручивает. */
const KEEP_VISIBLE_GAP = 16;

type CreateTaskFormProps = {
  /** Кому можно назначить: моковые дети и дети семьи с сервера. */
  assignees: readonly ChipChild[];
  rewardPresets: readonly number[];
  /** Задача для редактирования; без неё форма создаёт новую. Берётся при открытии. */
  task?: UpdateTaskPayload;
  /** Задача создана или обновлена. */
  onSubmitted: () => void;
  /** Деньги родителя с сервера; пока грузятся — форма без бюджета. */
  funds?: ParentFunds;
  /** Deposit в карточке бюджета: открыть шторку пополнения. */
  onDeposit?: () => void;
};

export function CreateTaskForm({
  assignees,
  rewardPresets,
  task,
  onSubmitted,
  funds,
  onDeposit,
}: CreateTaskFormProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isPending = createTask.isPending || updateTask.isPending;
  // Снимок задачи на момент открытия: фоновое перечитывание списка не должно
  // затирать то, что родитель уже начал править.
  const [initialTask] = useState(task);
  // Шаг чеклиста тянут за ручку: прокрутка формы не должна его перехватить.
  const [draggingStep, setDraggingStep] = useState(false);
  // Низ чеклиста (Add step и подсказка) не уходит за низ видимой части
  // формы (над клавиатурой): форма докручивает, шаги сдвигаются вверх.
  const { scrollRef, viewportRef, onScroll, keepInView } =
    useKeepInView(KEEP_VISIBLE_GAP);

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

  // Награда задания с сервера уже в резерве: при правке на новую сумму
  // доступно свободное плюс она. Моковые задания ничего не резервируют.
  const ownReserve = initialTask?.serverTaskId ? initialTask.reward : 0;
  const budget = funds
    ? getParentFunds(funds.total, funds.reserved - ownReserve)
    : null;
  const amount = Number(reward) || 0;
  const short = budget ? amount - budget.available : 0;
  const notEnough = short > 0;

  const canSubmit =
    !isPending &&
    !notEnough &&
    Number(reward) > 0 &&
    title.trim().length > 0 &&
    assigneeId !== null &&
    isDeadlineValid(deadline);

  const submit = async () => {
    const payload = buildCreateTaskPayload(useCreateTaskStore.getState());
    if (!payload || isPending) return;
    try {
      if (initialTask) {
        await updateTask.mutateAsync({
          ...payload,
          id: initialTask.id,
          serverTaskId: initialTask.serverTaskId,
        });
      } else {
        await createTask.mutateAsync(payload);
      }
      onSubmitted();
    } catch (error) {
      showToast(t(`createTask.errors.${submitError(error)}`));
    }
  };

  // У задания с сервера ребёнка не поменять: показываем только его.
  const shownAssignees = initialTask?.serverTaskId
    ? assignees.filter((child) => child.id === initialTask.assigneeId)
    : assignees;
  const childName =
    assignees.find((child) => child.id === assigneeId)?.name ?? null;

  // Ребёнок в семье один — он и исполнитель: выбран сразу, выбирать некого.
  // Дети с сервера приходят после открытия формы, поэтому — эффектом.
  const onlyChildId =
    !initialTask && assignees.length === 1 ? assignees[0].id : null;
  useEffect(() => {
    if (onlyChildId && useCreateTaskStore.getState().assigneeId === null) {
      setAssignee(onlyChildId);
    }
  }, [onlyChildId, setAssignee]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View ref={viewportRef} style={styles.flex}>
        <ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={[styles.flex, keepInViewScrollStyle]}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!draggingStep}
          showsVerticalScrollIndicator={false}
        >
          <FormField label={t('createTask.taskTitle')}>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder={t('createTask.taskTitlePlaceholder')}
              placeholderTextColor={theme.colors.placeholder}
              style={styles.input}
            />
          </FormField>

          <DeadlineField />

          <RewardInput
            presets={rewardPresets}
            error={notEnough}
            footer={
              budget && (
                <RewardBudget
                  funds={budget}
                  amount={amount}
                  onDeposit={onDeposit}
                />
              )
            }
          />

          <FormField label={t('createTask.description')} optional>
            <DescriptionInput
              value={description}
              onChangeText={setDescription}
            />
          </FormField>

          <ChecklistField
            childName={childName}
            onDragActiveChange={setDraggingStep}
            onKeepVisible={keepInView}
          />

          <FormField label={t('createTask.assignTo')}>
            <View style={styles.chips}>
              {shownAssignees.map((child) => (
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
              label={
                notEnough
                  ? t('createTask.shortBy', { amount: formatMoney(short) })
                  : initialTask
                    ? t('createTask.save')
                    : t('createTask.create')
              }
              withIcon={false}
              disabled={!canSubmit}
              onPress={submit}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

/** Ключ ошибки создания или правки: `createTask.errors.*`. */
function submitError(
  error: unknown,
): 'insufficientFunds' | 'onReview' | 'network' | 'failed' {
  if (!isApiError(error)) return 'failed';
  if (error.status === 0) return 'network';
  const code =
    error.data && typeof error.data === 'object'
      ? (error.data as { code?: unknown }).code
      : null;
  if (code === 'INSUFFICIENT_FUNDS') return 'insufficientFunds';
  if (code === 'TASK_ON_REVIEW') return 'onReview';
  // Создание при нехватке денег отвечает 409 без кода.
  if (error.status === 409) return 'insufficientFunds';
  return 'failed';
}
