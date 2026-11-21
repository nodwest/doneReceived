import { useMemo } from 'react';
import type { Task } from '@entities/task';
import { useChildWallet } from '@entities/wallet';
import { WordsTaskRow } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { getWordsOverview, rewardsOf } from '../model/words-overview';

type ChildWordsTaskRowProps = {
  childId: string;
  childName: string;
  familyId: string | null;
  /** Задания ребёнка (из них — его слова). */
  tasks: readonly Task[];
  /** Только когда слова ждут проверки (вкладка To review). */
  reviewOnly?: boolean;
  /**
   * Тап по строке: `checkTaskId` — слова ждут проверки и проверяет этот
   * родитель (сразу проверка), иначе — вкладка Languages.
   */
  onOpen: (checkTaskId: string | null) => void;
  /** Может ли этот родитель проверять задание (автор). */
  canCheck: (task: Task) => boolean;
};

/**
 * Слова ребёнка в списке заданий родителя — всегда одна строка, сколько бы
 * порций ни было: учит, ждёт проверки или «сдано, выплачено» (новые слова
 * завтра).
 */
export function ChildWordsTaskRow({
  childId,
  childName,
  familyId,
  tasks,
  reviewOnly = false,
  onOpen,
  canCheck,
}: ChildWordsTaskRowProps) {
  const { t } = useTranslation();
  const { data: wallet } = useChildWallet(childId, familyId);
  const overview = useMemo(
    () =>
      getWordsOverview(
        tasks.filter((task) => task.assignee.id === childId),
        rewardsOf(wallet),
      ),
    [tasks, wallet, childId],
  );
  const { status, task, range, words } = overview;
  if (!task || !range) return null;
  if (status !== 'review' && reviewOnly) return null;
  if (status !== 'review' && status !== 'learning' && status !== 'tomorrow') {
    return null;
  }

  const name = childName;
  const rowStatus =
    status === 'review' ? 'review' : status === 'tomorrow' ? 'done' : 'active';
  const title =
    status === 'review'
      ? t('words.rowParentReview', { name })
      : t('words.rowParentTitle', { name });
  const subtitle =
    status === 'review'
      ? t('words.rowParentReviewHint', { name })
      : status === 'tomorrow'
        ? t('words.rowParentDone')
        : t('words.rowParentLearning', {
            from: range.from,
            to: range.to,
            count: words.length,
          });

  return (
    <WordsTaskRow
      status={rowStatus}
      reward={task.reward}
      title={title}
      subtitle={subtitle}
      onPress={() =>
        onOpen(status === 'review' && canCheck(task) ? task.id : null)
      }
    />
  );
}
