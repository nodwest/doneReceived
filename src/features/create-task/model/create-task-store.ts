import { create } from 'zustand';
import type { CreateTaskPayload } from '@entities/task';
import {
  initialDeadline,
  isDeadlineValid,
  resolveDeadline,
  type DeadlineChoice,
  type DeadlinePreset,
} from './deadline';

const MAX_REWARD_DIGITS = 5;
const DEFAULT_CUSTOM_OFFSET_MS = 60 * 60 * 1000;

type FormState = {
  title: string;
  reward: string;
  rewardPreset: number | null;
  description: string;
  assigneeId: number | null;
  deadline: DeadlineChoice;
};

type FormActions = {
  setTitle: (title: string) => void;
  setReward: (reward: string) => void;
  pickRewardPreset: (preset: number) => void;
  setDescription: (description: string) => void;
  setAssignee: (id: number) => void;
  selectDeadline: (preset: DeadlinePreset) => void;
  setCustomDeadline: (date: Date) => void;
  reset: () => void;
};

const initialState: FormState = {
  title: '',
  reward: '',
  rewardPreset: null,
  description: '',
  assigneeId: null,
  deadline: initialDeadline,
};

export const useCreateTaskStore = create<FormState & FormActions>((set) => ({
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
  reset: () => set(initialState),
}));

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
  };
}
