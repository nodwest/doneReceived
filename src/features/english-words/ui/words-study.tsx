import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { Task } from '@entities/task';
import { WordCard, type Word } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { CardButton } from '@shared/ui';
import { useWordsStudy } from '../model/study-store';
import { useSubmitWords } from '../model/use-submit-words';
import { WordsProgress, WordsState } from './words-parts';
import { cardEntering, cardExiting } from './card-entering';
import { styles } from './words.styled';

type WordsStudyProps = {
  task: Task;
  /** Слова по порядку очереди: при повторении невыученные — первыми. */
  words: readonly Word[];
  /** Повторение после проверки: эти слова не вспомнил — на карточке пометка. */
  missed?: ReadonlySet<number>;
};

/**
 * Ребёнок учит слова задания по одному: «Запомнил» — слово выучено,
 * «Напомнить» — оно уходит в конец очереди и покажется снова. Запомнил все —
 * задание само уходит родителю на проверку.
 */
export function WordsStudy({ task, words, missed }: WordsStudyProps) {
  const { t } = useTranslation();
  const ranks = useMemo(() => words.map((word) => word.rank), [words]);
  const byRank = useMemo(
    () => new Map(words.map((word) => [word.rank, word])),
    [words],
  );
  const study = useWordsStudy(task.id, ranks);
  const submit = useSubmitWords();
  const current =
    study.queue.length > 0 ? (byRank.get(study.queue[0]) ?? null) : null;
  const finished = study.queue.length === 0 && ranks.length > 0;

  // Все слова запомнены — сразу на проверку. Ошибка — кнопка повтора ниже.
  const { mutate, isIdle } = submit;
  const { clear } = study;
  useEffect(() => {
    if (finished && isIdle) mutate(task, { onSuccess: clear });
  }, [finished, isIdle, mutate, task, clear]);

  if (finished) {
    return submit.isError ? (
      <WordsState
        icon="refresh"
        tone="danger"
        title={t('words.child.submitFailedTitle')}
        text={t('words.child.submitFailedText')}
      >
        <CardButton
          label={t('words.child.retry')}
          variant="child"
          icon="refresh"
          onPress={() => submit.mutate(task, { onSuccess: clear })}
        />
      </WordsState>
    ) : (
      <WordsState icon="check" title={t('words.child.submitting')}>
        <ActivityIndicator color={theme.colors.childInk} />
      </WordsState>
    );
  }

  if (!current) return null;
  const lastInQueue = study.queue.length === 1;

  return (
    <View style={styles.study}>
      <WordsProgress
        label={t('words.child.remembered')}
        value={study.remembered.length}
        total={ranks.length}
      />
      <Animated.View
        key={current.rank}
        entering={cardEntering}
        exiting={cardExiting}
      >
        <WordCard
          word={current}
          badge={
            missed?.has(current.rank) ? (
              <View style={[styles.badge, styles.badgeMissed]}>
                <Text style={[styles.badgeText, styles.badgeTextMissed]}>
                  {t('words.child.missedBadge')}
                </Text>
              </View>
            ) : undefined
          }
          footer={
            <>
              <CardButton
                label={t('words.child.remindLater')}
                variant="outline"
                icon="refresh"
                disabled={lastInQueue}
                onPress={study.later}
              />
              <CardButton
                label={t('words.child.gotIt')}
                variant="child"
                icon="check"
                onPress={study.remember}
              />
            </>
          }
        />
      </Animated.View>
      <Text style={styles.hint}>
        {lastInQueue ? t('words.child.lastWordHint') : t('words.child.hint')}
      </Text>
    </View>
  );
}
