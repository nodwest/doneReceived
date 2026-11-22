import { apiRequest, authorizedImage } from '@shared/api';
import { appendPhoto, type PickedPhoto } from '@shared/lib';
import type {
  RejectReasonKey,
  Task,
  TaskState,
  TaskWordsPortion,
} from '../model/task';
import type {
  ChecklistStepPayload,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '../model/types';

// Настоящие задания: детям семьи с сервера. Задание (task) на сервере
// назначается детям (assignment); в приложении одна задача — одно
// назначение, её id — id назначения, `serverTaskId` — id задания.

type TaskDto = {
  id: string;
  createdBy: string;
  title: string;
  description: string | null;
  deadlineAt: string | null;
  rewardPoints: number;
  createdAt: string;
  cancelledAt: string | null;
  /** Шаги чеклиста по порядку; `[]` — без чеклиста. */
  checklist: { id: string; title: string }[];
};

type AssignmentDto = {
  id: string;
  childId: string;
  /** expired — срок прошёл, а задание не сдано (резерв вернулся автору). */
  status: 'assigned' | 'submitted' | 'rejected' | 'approved' | 'expired';
  /** После отказа можно переделать; false — отказ закрыл назначение. */
  retryableRejection: boolean;
  /** Шаги чеклиста, которые ребёнок отметил. */
  checkedItemIds: string[];
  /** Отчёт, который ждёт проверки; null — не сдано, отозвано или проверено. */
  pendingSubmission?: PendingSubmissionDto | null;
  /** Последний отказ по назначению; null — отказов не было. */
  lastRejection?: LastRejectionDto | null;
  /** Порция слов дня; у обычных заданий — null. */
  words?: WordsPortionDto | null;
};

type WordsPortionDto = {
  portionId: string;
  ranks: number[];
  reviewRanks: number[];
  items: {
    rank: number;
    word: string;
    transcription: string;
    translation: string;
    forms: string | null;
    collocations: { en: string; ru: string }[];
    example: string;
    exampleTranslation: string;
  }[];
};

/** Порция слов с сервера → в приложении (формы без null). */
const toWordsPortion = (words: WordsPortionDto): TaskWordsPortion => ({
  portionId: words.portionId,
  ranks: words.ranks,
  reviewRanks: words.reviewRanks,
  items: words.items.map(({ forms, ...item }) => ({
    ...item,
    forms: forms ?? undefined,
  })),
});

type PendingSubmissionDto = {
  id: string;
  submittedAt: string;
  /** Комментарий ребёнка к сдаче; null — не писал. */
  note: string | null;
  /** Фото отчёта в порядке загрузки; `[]` — без фото. */
  attachments: AttachmentDto[];
};

type AttachmentDto = { id: string; contentType: string };

type LastRejectionDto = {
  /** words_missed — слова дня: не все слова верно (сервер, words-check). */
  reasonCode: 'not_done_properly' | 'not_finished' | 'other' | 'words_missed';
  /** Слова дня: номера слов, которые ребёнок не вспомнил. */
  missedRanks?: number[];
  comment: string | null;
  /** id аккаунта родителя, который отклонил. */
  reviewedBy: string;
  reviewedAt: string;
};

type RejectReasonCode = Exclude<LastRejectionDto['reasonCode'], 'words_missed'>;

/**
 * Код причины отказа на сервере → ключ причины в приложении. Слова дня
 * (`words_missed`) — без чипа причины, как other: что не вспомнил — в
 * `missedRanks`.
 */
const REJECT_REASONS: Record<LastRejectionDto['reasonCode'], RejectReasonKey> =
  {
    not_done_properly: 'not-done-properly',
    not_finished: 'not-finished',
    other: 'other',
    words_missed: 'other',
  };

/** Ключ причины в приложении → код причины для сервера. */
export const REJECT_REASON_CODES: Record<RejectReasonKey, RejectReasonCode> = {
  'not-done-properly': 'not_done_properly',
  'not-finished': 'not_finished',
  other: 'other',
};

export type TaskChildLabel = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
};

export type TaskMemberLabel = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
};

/** Статус назначения → статус задачи в приложении. */
type OpenAssignmentDto = AssignmentDto & {
  status: Exclude<AssignmentDto['status'], 'expired'>;
};

const STATES: Record<OpenAssignmentDto['status'], TaskState> = {
  assigned: 'active',
  rejected: 'active',
  submitted: 'review',
  approved: 'done',
};

/** Кто смотрит список: чтобы его задания считались «моими» на экранах. */
export type TaskViewer = {
  familyId: string;
  /** id аккаунта вошедшего (`user.id` в сессии). */
  userId: string;
  /** Ребёнок не видит список детей семьи (403): имя — его собственное. */
  childName?: string;
  familyRole?: 'owner' | 'admin' | 'member';
};

/** Фото отчёта для `<Image>`: читается с токеном. */
const attachmentImage = (familyId: string, id: string) =>
  authorizedImage(`/families/${familyId}/task-attachments/${id}`);

function toTask(
  task: TaskDto,
  assignment: OpenAssignmentDto,
  viewer: TaskViewer,
): Task {
  const pending = assignment.pendingSubmission ?? null;
  const attachments = pending?.attachments ?? [];
  const rejected = assignment.lastRejection ?? null;
  return {
    id: assignment.id,
    serverTaskId: task.id,
    title: task.title,
    description: task.description ?? '',
    reward: task.rewardPoints,
    status: STATES[assignment.status],
    assignee: {
      id: assignment.childId,
      name: viewer.childName ?? '—',
      avatar: null,
    },
    createdBy: task.createdBy,
    canManage: task.createdBy === viewer.userId,
    createdAt: task.createdAt,
    expiresAt: task.deadlineAt,
    // Отчёт на проверке: когда сдано, фото и комментарий ребёнка.
    submissionId: pending?.id,
    doneAt: pending?.submittedAt ?? null,
    photos: attachments.map(({ id }) => attachmentImage(viewer.familyId, id)),
    note: pending?.note?.trim() || null,
    // Последний отказ остаётся и после новой сдачи: родитель видит, за что
    // возвращал.
    rejection: rejected
      ? {
          reason: REJECT_REASONS[rejected.reasonCode] ?? 'other',
          comment: rejected.comment ?? '',
          by: rejected.reviewedBy,
          missedRanks: rejected.missedRanks ?? [],
        }
      : null,
    words: assignment.words ? toWordsPortion(assignment.words) : null,
    checklist: task.checklist.map((item) => ({
      id: item.id,
      title: item.title,
      done: assignment.checkedItemIds.includes(item.id),
    })),
  };
}

/**
 * GET /families/:id/tasks — назначения семьи (ребёнку — только свои), до 100
 * последних. Отменённые,
 * подтверждённые, истёкшие и закрытые отказом (`rejected` без `retryableRejection`)
 * в список не идут.
 */
export async function fetchServerTasks(
  viewer: TaskViewer,
  signal?: AbortSignal,
): Promise<Task[]> {
  const items = await apiRequest<
    { task: TaskDto; assignment: AssignmentDto }[]
  >(`/families/${viewer.familyId}/tasks?status=assigned,submitted,rejected`, {
    signal,
  });
  const visible = items.filter(
    (item): item is { task: TaskDto; assignment: OpenAssignmentDto } =>
      item.task.cancelledAt === null &&
      item.assignment.status !== 'approved' &&
      // Истёкшие — в истории наград как упущенные, не в списках заданий.
      item.assignment.status !== 'expired' &&
      !(
        item.assignment.status === 'rejected' &&
        !item.assignment.retryableRejection
      ),
  );
  return visible.map(({ task, assignment }) =>
    toTask(task, assignment, viewer),
  );
}

const toBody = (payload: CreateTaskPayload) => ({
  title: payload.title,
  description: payload.description,
  deadlineAt: payload.expiresAt,
  rewardPoints: payload.reward,
});

/**
 * Чеклист для тела запроса — весь список по порядку. Шаг с `id` сервер
 * оставляет с отметкой ребёнка, без `id` — создаёт новый, пропавшие удаляет;
 * `[]` — без чеклиста (при правке убирает его).
 */
const checklistBody = (checklist: readonly ChecklistStepPayload[]) =>
  checklist.map(({ id, title }) => (id ? { id, title } : { title }));

/**
 * POST /families/:id/tasks — задание ребёнку; награда резервируется в
 * кошельке автора. 409 — не хватает денег на резерв.
 */
export function createServerTask(familyId: string, payload: CreateTaskPayload) {
  const { description, deadlineAt, ...body } = toBody(payload);
  return apiRequest<unknown>(`/families/${familyId}/tasks`, {
    method: 'POST',
    body: {
      ...body,
      // Пустые необязательные поля не отправляем: сервер ждёт их отсутствия.
      ...(description ? { description } : {}),
      ...(deadlineAt ? { deadlineAt } : {}),
      ...(payload.clientRequestId
        ? { clientRequestId: payload.clientRequestId }
        : {}),
      checklist: checklistBody(payload.checklist),
      childIds: [payload.assigneeId],
    },
  });
}

/**
 * PATCH /families/:id/tasks/:taskId — правка задания (только автор). Пустое
 * описание и срок отправляются как null — сервер их очищает. 409 —
 * `TASK_ON_REVIEW`, `TASK_CANCELLED`, `TASK_DEADLINE_PASSED` или `INSUFFICIENT_FUNDS` (не хватает на
 * новую награду, ничего не меняется).
 */
export function updateServerTask(familyId: string, payload: UpdateTaskPayload) {
  const body = toBody(payload);
  return apiRequest<unknown>(
    `/families/${familyId}/tasks/${payload.serverTaskId}`,
    {
      method: 'PATCH',
      body: {
        ...body,
        description: body.description || null,
        checklist: checklistBody(payload.checklist),
      },
    },
  );
}

/**
 * DELETE /families/:id/tasks/:taskId — автор отменяет задание; невыплаченный
 * резерв возвращается в его кошелёк.
 */
export function cancelServerTask(familyId: string, serverTaskId: string) {
  return apiRequest<null>(`/families/${familyId}/tasks/${serverTaskId}`, {
    method: 'DELETE',
  });
}

/**
 * POST /families/:id/task-assignments/:assignmentId/submissions — ребёнок
 * отправляет отчёт («I did it!»), назначение уходит на проверку. Комментарий
 * ребёнка — в `note`, пустой не отправляем. С фото — multipart: `note` и
 * поле `photos` на каждый файл (до 3, по 2 МиБ). 409 — уже на проверке,
 * принято, срок истёк или `SUBMISSION_LIMIT_REACHED`; 413 — файл велик.
 */
export async function submitServerTask(
  familyId: string,
  assignmentId: string,
  note?: string,
  photos: readonly PickedPhoto[] = [],
  clientRequestId?: string,
  signal?: AbortSignal,
) {
  const path = `/families/${familyId}/task-assignments/${assignmentId}/submissions`;
  if (photos.length === 0) {
    return apiRequest<{ id: string }>(path, {
      method: 'POST',
      body: { note, clientRequestId },
      signal,
    });
  }
  const form = new FormData();
  if (note) form.append('note', note);
  if (clientRequestId) form.append('clientRequestId', clientRequestId);
  for (const photo of photos) await appendPhoto(form, 'photos', photo);
  if (signal?.aborted) throw new Error('Task action cancelled');
  return apiRequest<{ id: string }>(path, {
    method: 'POST',
    body: form,
    signal,
  });
}

/**
 * PUT /families/:id/task-assignments/:assignmentId/checklist/:itemId —
 * ребёнок отмечает шаг чеклиста (`done: true`) или снимает отметку;
 * повтор с тем же `done` — не ошибка. 409 — задание уже на проверке, принято или отменено.
 */
export function tickServerChecklist(
  familyId: string,
  assignmentId: string,
  itemId: string,
  done: boolean,
) {
  return apiRequest<unknown>(
    `/families/${familyId}/task-assignments/${assignmentId}/checklist/${itemId}`,
    { method: 'PUT', body: { done } },
  );
}

/**
 * Redo: ребёнок забирает непроверенный отчёт — DELETE
 * /families/:id/task-submissions/:submissionId, назначение снова активно,
 * резерв не трогается. Ответ — отозванный отчёт с комментарием. 409 — уже
 * проверен (`SUBMISSION_ALREADY_REVIEWED`), срок прошёл
 * (`TASK_DEADLINE_PASSED`), задание отменено.
 */
export async function withdrawServerSubmission(
  familyId: string,
  assignment: PendingRef,
  signal?: AbortSignal,
) {
  const submissionId = requireSubmissionId(assignment);
  return apiRequest<{ note: string | null }>(
    `/families/${familyId}/task-submissions/${submissionId}`,
    { method: 'DELETE', signal },
  );
}

/**
 * Решение родителя по отчёту, который ждёт проверки: POST
 * /families/:id/task-submissions/:submissionId/review. approved — резерв
 * уходит ребёнку. rejected — причина кодом и комментарий (у `other`
 * обязателен); `retry: true` — назначение остаётся открытым (на переделку,
 * резерв не трогается), `false` — закрывается, резерв возвращается автору.
 * 409 — отчёт отозван (`SUBMISSION_WITHDRAWN`), уже проверен или срок
 * прошёл, а просили переделку (`TASK_DEADLINE_PASSED`).
 */
export async function reviewServerSubmission(
  familyId: string,
  assignment: PendingRef,
  review:
    | { decision: 'approved' }
    | {
        decision: 'rejected';
        reasonCode: RejectReasonCode;
        comment?: string;
        retry: boolean;
      },
) {
  const submissionId = requireSubmissionId(assignment);
  await apiRequest<unknown>(
    `/families/${familyId}/task-submissions/${submissionId}/review`,
    { method: 'POST', body: review },
  );
}

/** Назначение и его отчёт на проверке, если он уже есть в списке заданий. */
export type PendingRef = { id: string; submissionId?: string };

function requireSubmissionId({ submissionId }: PendingRef) {
  if (!submissionId) throw new Error('Missing pending submission ID');
  return submissionId;
}
