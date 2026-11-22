import type { Task } from '@entities/task';
import { WordsTaskRow } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { useWordsOverview } from '../model/use-words-overview';

type ChildWordsTaskRowProps = {
  childId: string;
  childName: string;
  familyId: string | null;
  /** Задания, которые видит список (из них — порция слов этого ребёнка). */
  tasks: readonly Task[];
  /** Только когда слова ждут проверки (вкладка To review). */
  reviewOnly?: boolean;
  /**
   * id вошедшего родителя: «сдано · выплачено» показываем плательщику — его
   * это задание, как у остальных строк вкладки Tasks. null — не показываем.
   */
  payerId?: string | null;
  /**
   * Тап по строке: `checkTaskId` — слова ждут проверки (сразу проверка),
   * иначе — вкладка Languages.
   */
  onOpen: (checkTaskId: string | null) => void;
};

/**
 * Слова ребёнка в списке заданий родителя — одна строка: учит, ждёт
 * проверки или «сдано, выплачено» (новые слова завтра). Учит и на проверке —
 * только если задание порции есть в списке.
 */
export function ChildWordsTaskRow({
  childId,
  childName,
  familyId,
  tasks,
  reviewOnly = false,
  payerId = null,
  onOpen,
}: ChildWordsTaskRowProps) {
  const { t } = useTranslation();
  const { overview } = useWordsOverview(familyId, childId, tasks);
  if (!overview) return null;
  const { status, task, range, words, reward } = overview;
  if (status !== 'review' && reviewOnly) return null;

  const name = childName;
  const done =
    status === 'tomorrow' && payerId !== null && overview.payerId === payerId;
  if (!done && (!task || !range)) return null;
  if (
    !done &&
    status !== 'review' &&
    status !== 'learning' &&
    status !== 'redo'
  ) {
    return null;
  }

  const rowStatus = status === 'review' ? 'review' : done ? 'done' : 'active';
  const title =
    status === 'review'
      ? t('words.rowParentReview', { name })
      : t('words.rowParentTitle', { name });
  const subtitle =
    status === 'review'
      ? t('words.rowParentReviewHint', { name })
      : done
        ? t('words.rowParentDone')
        : t('words.rowParentLearning', {
            from: range?.from ?? 0,
            to: range?.to ?? 0,
            count: words.length,
          });

  return (
    <WordsTaskRow
      status={rowStatus}
      reward={task?.reward ?? reward ?? 0}
      title={title}
      subtitle={subtitle}
      onPress={() => onOpen(status === 'review' && task ? task.id : null)}
    />
  );
}
