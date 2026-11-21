import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { TabScreen } from '@widgets/bottom-nav';
import {
  deckFocus,
  getWordsOverview,
  rewardsOf,
  WordsDeckList,
  WordsProgress,
  WordsState,
  WordsIntro,
  WordsStudy,
  useWordsIntro,
} from '@features/english-words';
import { useChildTasks, useMyChildWallet } from '@features/family-tasks';
import { WORDS_PER_DAY, WORDS_REWARD, WORDS_TOTAL } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { useIsCompact } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { RoundButton } from '@shared/ui';
import { LanguagesHeader } from './languages-header';
import { styles } from './languages.styled';

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
  const { data: tasks, isPending: tasksPending } = useChildTasks();
  const { data: wallet, isPending: walletPending } = useMyChildWallet();
  const overview = useMemo(
    () => getWordsOverview(tasks ?? [], rewardsOf(wallet)),
    [tasks, wallet],
  );
  const loading = tasksPending || walletPending;
  const { status, task, words, learned } = overview;
  const amount = `$${task?.reward ?? WORDS_REWARD}`;
  // При первом входе — как всё устроено; потом по «?» в шапке.
  const intro = useWordsIntro();

  // Пока учит — только карточка, без отвлекающего списка; иначе сверху
  // коротко, что со словами, а ниже — все слова словаря.
  const deck = intro.seen && !loading && status !== 'learning';
  const focus = deckFocus(overview);
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
          {status === 'review' ? (
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
              text={t('words.child.finishedText', { total: WORDS_TOTAL })}
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
              total={WORDS_TOTAL}
            />
          )}
          <WordsDeckList start={focus.start} today={focus.today} />
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
        ) : task ? (
          <WordsStudy key={task.id} task={task} words={words} />
        ) : null}
      </ScrollView>
    </TabScreen>
  );
}
