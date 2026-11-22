import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { TabScreen } from '@widgets/bottom-nav';
import {
  deckFocus,
  hasWordsStudyProgress,
  useWordsOverview,
  WordsDeckList,
  WordsProgress,
  WordsState,
  WordsIntro,
  WordsStudy,
  useWordsIntro,
} from '@features/english-words';
import { useChildAccount, useChildTasks } from '@features/family-tasks';
import type { Task } from '@entities/task';
import { WORDS_PER_DAY } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { useIsCompact } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { CardButton, RoundButton } from '@shared/ui';
import { LanguagesHeader } from './languages-header';
import { styles } from './languages.styled';

const NO_TASKS: Task[] = [];

/**
 * Вкладка «Языки» у ребёнка: слова дня по одной карточке. Запомнил все —
 * «На сегодня всё» (слова ушли родителю на проверку); проверили и заплатили —
 * новые слова завтра. Когда не учит — под состоянием все слова словаря:
 * можно открыть любое и учить дальше самому.
 */
export function ChildLanguagesPage() {
  useTheme();
  const { t } = useTranslation();
  const gutter = useIsCompact() ? 16 : 24;
  const { data: tasks = NO_TASKS, isPending: tasksPending } = useChildTasks();
  const { childId, familyId } = useChildAccount();
  const { overview, isPending: wordsPending } = useWordsOverview(
    familyId,
    childId,
    tasks,
  );
  const status = overview?.status ?? 'off';
  const task = overview?.task ?? null;
  const learned = overview?.learned ?? 0;
  const total = overview?.total ?? 0;
  // Учит, а задание порции ещё не пришло в списке — ждём его.
  const loading =
    tasksPending || wordsPending || (status === 'learning' && !task);

  // Повторение после неудачной проверки: невыученные — первыми (по порядку
  // словаря), затем остальные новые слова порции.
  const missed = useMemo(
    () => new Set(overview?.missed.map((word) => word.rank) ?? []),
    [overview],
  );
  const redoWords = useMemo(
    () =>
      overview
        ? [
            ...overview.missed,
            ...overview.words.filter((word) => !missed.has(word.rank)),
          ]
        : [],
    [overview, missed],
  );
  const redoKey =
    status === 'redo' && task
      ? `${task.id}:${redoWords.map((word) => word.rank).join(',')}`
      : null;
  // «Повторить слова» открывает карточки; начатое повторение (закрыли
  // приложение посреди) открывается сразу.
  const [repeating, setRepeating] = useState<string | null>(null);
  const studying =
    status === 'learning' ||
    (redoKey !== null &&
      (repeating === redoKey ||
        (task !== null &&
          hasWordsStudyProgress(
            task.id,
            redoWords.map((word) => word.rank),
          ))));
  const amount = `$${task?.reward ?? overview?.reward ?? 0}`;
  // При первом входе — как всё устроено; потом по «?» в шапке.
  const intro = useWordsIntro();

  // Пока учит — только карточка, без отвлекающего списка; иначе сверху
  // коротко, что со словами, а ниже — все слова словаря.
  const deck = intro.seen && !loading && !studying;
  const focus = overview ? deckFocus(overview) : { start: 1, today: null };
  const header = (
    <LanguagesHeader
      tone="child"
      action={
        intro.seen ? (
          <RoundButton
            icon="help"
            accessibilityLabel={t('words.intro.open')}
            onPress={() => intro.setSeen(false)}
          />
        ) : null
      }
    />
  );

  if (deck) {
    return (
      <TabScreen activeKey="languages">
        <View style={[styles.deckScreen, { paddingHorizontal: gutter }]}>
          {header}
          {status === 'redo' ? (
            <>
              <WordsState
                compact
                icon="refresh"
                tone="review"
                title={t('words.child.redoTitle')}
                text={t('words.child.redoText')}
              />
              <View style={styles.deckAction}>
                <CardButton
                  label={t('words.child.repeat')}
                  variant="child"
                  icon="refresh"
                  onPress={() => setRepeating(redoKey)}
                />
              </View>
            </>
          ) : status === 'review' ? (
            <WordsState
              compact
              icon="check"
              tone="review"
              title={t('words.child.reviewTitle')}
              text={t('words.child.reviewText', { amount })}
            />
          ) : status === 'tomorrow' ? (
            <WordsState
              compact
              icon="badge-check"
              tone="success"
              title={t('words.child.tomorrowTitle')}
              text={t('words.child.tomorrowText')}
            />
          ) : status === 'finished' ? (
            <WordsState
              compact
              icon="star"
              tone="success"
              title={t('words.child.finishedTitle')}
              text={t('words.child.finishedText', { total })}
            />
          ) : status === 'noFunds' ? (
            <WordsState
              compact
              icon="clock"
              title={t('words.child.waitTitle')}
              text={t('words.child.waitText')}
            />
          ) : (
            <WordsState
              compact
              icon="book"
              title={t('words.child.noneTitle')}
              text={t('words.child.noneText', { count: WORDS_PER_DAY })}
            />
          )}
          {learned > 0 && (
            <WordsProgress
              label={t('words.child.learned')}
              value={learned}
              total={total}
            />
          )}
          <WordsDeckList
            start={focus.start}
            today={focus.today}
            missed={status === 'redo' ? missed : undefined}
          />
        </View>
      </TabScreen>
    );
  }

  return (
    <TabScreen activeKey="languages">
      <ScrollView
        contentContainerStyle={[styles.body, { paddingHorizontal: gutter }]}
        showsVerticalScrollIndicator={false}
      >
        {header}
        {!intro.seen ? (
          <WordsIntro onDone={() => intro.setSeen(true)} />
        ) : loading ? (
          <ActivityIndicator
            style={styles.loading}
            color={theme.colors.childInk}
          />
        ) : task && overview ? (
          status === 'redo' ? (
            <WordsStudy
              key={`${task.id}:redo`}
              task={task}
              words={redoWords}
              missed={missed}
            />
          ) : (
            <WordsStudy key={task.id} task={task} words={overview.words} />
          )
        ) : null}
      </ScrollView>
    </TabScreen>
  );
}
