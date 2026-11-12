import { create } from 'zustand';
import {
  CHECKLIST_MAX_ITEMS,
  type ChecklistStepPayload,
  type CreateTaskPayload,
} from '@entities/task';
import {
  initialDeadline,
  isDeadlineValid,
  resolveDeadline,
  type DeadlineChoice,
  type DeadlinePreset,
} from './deadline';

const MAX_REWARD_DIGITS = 5;
const DEFAULT_CUSTOM_OFFSET_MS = 60 * 60 * 1000;

/** Шаг чеклиста в форме; `key` — для списка, `id` — у сохранённого шага. */
export type ChecklistDraftStep = ChecklistStepPayload & { key: string };

let nextStepKey = 1;
const stepKey = () => `step-${nextStepKey++}`;

type FormState = {
  title: string;
  reward: string;
  rewardPreset: number | null;
  description: string;
  assigneeId: string | null;
  deadline: DeadlineChoice;
  checklist: ChecklistDraftStep[];
  /** Текст нового шага, ещё не добавленного (Enter или уход из поля). */
  checklistDraft: string;
};

type FormActions = {
  setTitle: (title: string) => void;
  setReward: (reward: string) => void;
  pickRewardPreset: (preset: number) => void;
  setDescription: (description: string) => void;
  setAssignee: (id: string) => void;
  selectDeadline: (preset: DeadlinePreset) => void;
  setCustomDeadline: (date: Date) => void;
  setChecklistDraft: (text: string) => void;
  /** Добавляет набранный шаг в конец; false — добавлять нечего или некуда. */
  commitChecklistDraft: () => boolean;
  renameChecklistStep: (key: string, title: string) => void;
  removeChecklistStep: (key: string) => void;
  moveChecklistStep: (from: number, to: number) => void;
  /** Предзаполняет форму данными существующей задачи (режим редактирования). */
  fill: (task: CreateTaskPayload) => void;
  reset: () => void;
};

const initialState: FormState = {
  title: '',
  reward: '',
  rewardPreset: null,
  description: '',
  assigneeId: null,
  deadline: initialDeadline,
  checklist: [],
  checklistDraft: '',
};

export const useCreateTaskStore = create<FormState & FormActions>(
  (set, get) => ({
    ...initialState,
    setTitle: (title) => set({ title }),
    // Ручной ввод снимает выделение чипа.
    setReward: (reward) =>
      set({
        reward: reward
          .replace(/\D/g, '')
          .slice(0, MAX_REWARD_DIGITS)
          .replace(/^0+(?=\d)/, ''),
        rewardPreset: null,
      }),
    pickRewardPreset: (preset) =>
      set({ reward: String(preset), rewardPreset: preset }),
    setDescription: (description) => set({ description }),
    setAssignee: (assigneeId) => set({ assigneeId }),
    selectDeadline: (preset) =>
      set((state) => ({
        deadline: {
          preset,
          customAt:
            preset === 'custom' && !state.deadline.customAt
              ? new Date(Date.now() + DEFAULT_CUSTOM_OFFSET_MS).toISOString()
              : state.deadline.customAt,
        },
      })),
    setCustomDeadline: (date) =>
      set({ deadline: { preset: 'custom', customAt: date.toISOString() } }),
    setChecklistDraft: (checklistDraft) => set({ checklistDraft }),
    commitChecklistDraft: () => {
      const { checklist, checklistDraft } = get();
      const title = checklistDraft.trim();
      if (!title || checklist.length >= CHECKLIST_MAX_ITEMS) return false;
      set({
        checklist: [...checklist, { key: stepKey(), title }],
        checklistDraft: '',
      });
      return true;
    },
    renameChecklistStep: (key, title) =>
      set((state) => ({
        checklist: state.checklist.map((step) =>
          step.key === key ? { ...step, title } : step,
        ),
      })),
    removeChecklistStep: (key) =>
      set((state) => ({
        checklist: state.checklist.filter((step) => step.key !== key),
      })),
    moveChecklistStep: (from, to) =>
      set((state) => {
        const checklist = [...state.checklist];
        const [step] = checklist.splice(from, 1);
        if (step) checklist.splice(to, 0, step);
        return { checklist };
      }),
    // Срок задачи становится пресетом Custom с её датой, без срока — No deadline.
    fill: (task) =>
      set({
        title: task.title,
        reward: String(task.reward),
        rewardPreset: null,
        description: task.description,
        assigneeId: task.assigneeId,
        deadline: task.expiresAt
          ? { preset: 'custom', customAt: task.expiresAt }
          : initialDeadline,
        checklist: task.checklist.map((step) => ({ ...step, key: stepKey() })),
        checklistDraft: '',
      }),
    reset: () => set(initialState),
  }),
);

/** Собирает payload для API; null, если форма невалидна. */
export function buildCreateTaskPayload(
  state: FormState,
  now = new Date(),
): CreateTaskPayload | null {
  const reward = Number(state.reward);
  if (
    !state.title.trim() ||
    !(reward > 0) ||
    state.assigneeId === null ||
    !isDeadlineValid(state.deadline, now)
  ) {
    return null;
  }

  return {
    title: state.title.trim(),
    reward,
    description: state.description.trim(),
    expiresAt: resolveDeadline(state.deadline, now)?.toISOString() ?? null,
    assigneeId: state.assigneeId,
    checklist: checklistPayload(state),
  };
}

/**
 * Шаги для API: пустые выбрасываем, набранный, но не добавленный шаг
 * (нажали Create, не нажав Enter) идёт последним.
 */
function checklistPayload(state: FormState): ChecklistStepPayload[] {
  const draft: ChecklistStepPayload = { title: state.checklistDraft };
  const steps = [...state.checklist, draft]
    .map(({ id, title }) => ({ id, title: title.trim() }))
    .filter((step) => step.title.length > 0)
    .slice(0, CHECKLIST_MAX_ITEMS);
  return steps.map(({ id, title }) => (id ? { id, title } : { title }));
}
