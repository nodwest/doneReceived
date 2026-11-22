import { apiRequest } from '@shared/api';
import type { Word } from '../model/word';

/**
 * Где ребёнок в словах дня (решает сервер):
 * off — родитель ещё не включил слова;
 * learning — порция выдана, ребёнок учит;
 * review — сдал, ждёт проверки родителя;
 * done_today — сегодня всё принято и оплачено, следующая порция — в
 *   `nextPortionAt` (день слов начинается в 4:00 по времени семьи);
 * no_funds — пора выдать порцию, а у плательщика не хватает денег на резерв;
 * finished — словарь пройден.
 */
export type WordsServerStatus =
  | 'off'
  | 'learning'
  /** Проверка не прошла, ребёнок повторяет слова (п. 38, когда сделают). */
  | 'redo'
  | 'review'
  | 'done_today'
  | 'no_funds'
  | 'finished';

/** Текущая порция: новые слова, пройденные для проверки и все они целиком. */
export interface WordsPortion {
  portionId: string;
  ranks: number[];
  reviewRanks: number[];
  items: Word[];
}

/** Слова ребёнка: настройки, сколько выучено и текущая порция. */
export interface WordsState {
  enabled: boolean;
  /** Награда за сданный день, в долларах; null — слова ещё не настроены. */
  rewardPoints: number | null;
  /** Родитель, из чьего кошелька платим (он включил слова или сменил сумму). */
  payerId: string | null;
  wordsPerDay: number;
  /** Сколько пройденных слов добавляется к проверке. */
  reviewCount: number;
  learnedCount: number;
  /** Сколько слов в словаре для детей. */
  totalCount: number;
  status: WordsServerStatus;
  /** Когда выдадут следующую порцию; null — не запланирована. */
  nextPortionAt: string | null;
  /** Порция при learning / review, иначе null. */
  portion: WordsPortion | null;
  /** Слова, которые не вспомнил на последней проверке (п. 38, когда сделают). */
  missedRanks?: number[];
}

type WordCardDto = Omit<Word, 'forms'> & { forms: string | null };

type WordsStateDto = Omit<WordsState, 'portion'> & {
  portion:
    | (Omit<WordsPortion, 'items'> & { items: WordCardDto[] })
    | null
    | undefined;
};

const toWordsState = (dto: WordsStateDto): WordsState => ({
  ...dto,
  portion: dto.portion
    ? {
        ...dto.portion,
        items: dto.portion.items.map(({ forms, ...item }) => ({
          ...item,
          forms: forms ?? undefined,
        })),
      }
    : null,
});

const wordsPath = (familyId: string, childId: string) =>
  `/families/${familyId}/children/${childId}/words`;

/** GET /families/:id/children/:childId/words — родителям и самому ребёнку. */
export async function fetchWordsState(familyId: string, childId: string) {
  return toWordsState(
    await apiRequest<WordsStateDto>(wordsPath(familyId, childId)),
  );
}

export interface WordsSettingsPayload {
  enabled: boolean;
  rewardPoints: number;
  wordsPerDay: number;
  /** Часовой пояс семьи (`Europe/Moscow`): с 4:00 по нему начинается день слов. */
  timeZone?: string;
}

/**
 * PUT …/words/settings — только родитель. Включили впервые — сервер сразу
 * выдаёт порцию (награда в резерв); новая сумма — со следующей порции;
 * `enabled: false` отменяет открытую порцию. 409 INSUFFICIENT_FUNDS —
 * настройки сохранены, а на порцию денег нет (статус no_funds).
 */
export async function saveWordsSettings(
  familyId: string,
  childId: string,
  payload: WordsSettingsPayload,
) {
  return toWordsState(
    await apiRequest<WordsStateDto>(
      `${wordsPath(familyId, childId)}/settings`,
      {
        method: 'PUT',
        body: payload,
      },
    ),
  );
}

export interface WordsCheckResult {
  passed: boolean;
  missedRanks: number[];
  rewardPoints: number;
}

/**
 * POST /families/:id/task-submissions/:submissionId/words-check — итог
 * проверки родителем: ответ на каждое слово порции (новые и пройденные).
 * Всё верно — награда из резерва уходит ребёнку; есть ошибки — слова
 * возвращаются на переделку, в отказе — что не вспомнил.
 */
export function checkWords(
  familyId: string,
  submissionId: string,
  answers: readonly { rank: number; correct: boolean }[],
) {
  return apiRequest<WordsCheckResult>(
    `/families/${familyId}/task-submissions/${submissionId}/words-check`,
    { method: 'POST', body: { answers } },
  );
}
