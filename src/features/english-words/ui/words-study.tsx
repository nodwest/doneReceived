import { useEffect, useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import type { Task } from '@entities/task';
import { getWord, WordCard, type Word } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { CardButton } from '@shared/ui';
import { useWordsStudy } from '../model/study-store';
import { useSubmitWords } from '../model/use-submit-words';
import { WordsProgress, WordsState } from './words-parts';
import { styles } from './words.styled';

type WordsStudyProps = {
  task: Task;
  words: readonly Word[];
};

/**
 * Ребёнок учит слова задания по одному: «Запомнил» — слово выучено,
 * «Напомнить» — оно уходит в конец очереди и покажется снова. Запомнил все —
 * задание само уходит родителю на проверку.
 */
export function WordsStudy({ task, words }: WordsStudyProps) {
  const { t } = useTranslation();
  const ranks = useMemo(() => words.map((word) => word.rank), [words]);
  const study = useWordsStudy(task.id, ranks);
  const submit = useSubmitWords();
  const current = study.queue.length > 0 ? getWord(study.queue[0]) : null;
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
      {task.rejection ? (
        <View style={styles.sentBack}>
          <Text style={styles.sentBackTitle}>
            {t('words.child.sentBackTitle')}
          </Text>
          <Text style={styles.sentBackText}>
            {task.rejection.comment || t('words.child.sentBackText')}
          </Text>
        </View>
      ) : null}
      {/* Новое слово въезжает справа: видно, что карточка сменилась. */}
      <Animated.View key={current.rank} entering={FadeInRight.duration(220)}>
        <WordCard
          word={current}
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
