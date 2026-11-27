import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DoneButton } from '@features/complete-task';
import { BottomNav } from '@widgets/bottom-nav';
import { HomeHeader } from '@widgets/home-header';
import { HomeSummary } from '@widgets/home-summary';
import { RecentActivity } from '@widgets/recent-activity';
import { TaskCarousel } from '@widgets/task-carousel';
import { WishlistPreview } from '@widgets/wishlist-preview';
import {
  useFamilyFeed,
  useChildTasks,
  useMyChildBalance,
  useMyWishlistOwner,
} from '@features/family-tasks';
import {
  ChildTaskTile,
  countTasks,
  isWordsTask,
  sortTasksByUrgency,
  type Task,
} from '@entities/task';
import { useMe, useMyAvatar } from '@entities/session';
import { WordsTaskRow } from '@entities/word';
import { useWishlistProgress } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { theme, useTheme } from '@shared/theme';
import { styles } from './child-home.styled';

const NO_TASKS: Task[] = [];

/**
 * Кто дал задание: имя и фото из участников семьи (без фото — буква), не
 * знаем — просто «Родитель».
 */
const authorOf = (task: Task, parentLabel: string) => ({
  name: task.authorName ?? parentLabel,
  avatar: task.authorAvatar ?? null,
});

/**
 * Главная вошедшего ребёнка: баланс и
 * счётчики заданий, карусель активных заданий с I did it!, плитка
 * вишлиста (текущее желание) и лента событий. Тап по заданию открывает его карточку на
 * вкладке Tasks.
 */
export function ChildHomePage() {
  useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  // Имя и фото вошедшего ребёнка (GET /users/me).
  const me = useMe();
  const myAvatar = useMyAvatar();
  // Лента — события ребёнка с сервера.
  const feedQuery = useFamilyFeed();
  const { data: feed = [] } = feedQuery;
  const { data: myTasks = NO_TASKS, isPending: tasksPending } = useChildTasks();
  // Ближайшие по сроку — первыми, как в списке «To do».
  // Слова дня учат на вкладке Languages: в карусели их нет, над ней — строка.
  const activeTasks = useMemo(
    () =>
      sortTasksByUrgency(
        myTasks.filter(
          (task) => task.status === 'active' && !isWordsTask(task),
        ),
      ),
    [myTasks],
  );
  // Слова дня, которые ребёнок сейчас учит: над каруселью — строка.
  const wordsTask = myTasks.find(
    (task) => isWordsTask(task) && task.status === 'active',
  );
  const counts = countTasks(myTasks);
  // Баланс — из кошелька ребёнка: после подтверждения задания он растёт.
  const { balance, isPending: balancePending } = useMyChildBalance();
  const wishlist = useWishlistProgress(useMyWishlistOwner(), balance);
  // Пока задания и вишлист не пришли, тело не рисуем: иначе на кадр видны
  // нули, «Добавь желание» и экран без карусели, а потом всё прыгает вниз.
  const loading = tasksPending || wishlist.isPending || balancePending;

  const openTask = (task: Task) =>
    router.push({ pathname: '/tasks', params: { task: String(task.id) } });

  const summary =
    !tasksPending && !balancePending ? (
      <HomeSummary
        variant="plain"
        tone="child"
        amount={balance}
        amountLabel={t('summary.myBalance')}
        activeTasks={counts.active}
        tasksToReview={counts.review}
        reviewLabel={t('summary.onReview')}
        onActiveTasksPress={() =>
          router.push({ pathname: '/tasks', params: { tab: 'all' } })
        }
        onTasksToReviewPress={() =>
          router.push({ pathname: '/tasks', params: { tab: 'review' } })
        }
      />
    ) : undefined;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          bounces={false}
          overScrollMode="never"
          style={styles.scroll}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            name={me?.displayName ?? ''}
            avatar={myAvatar}
            summary={summary}
          />
          {loading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={theme.colors.blueInk} />
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : (
            <>
              {wordsTask && (
                <WordsTaskRow
                  tone="child"
                  status="active"
                  reward={wordsTask.reward}
                  title={t('words.homeBanner')}
                  subtitle={t('words.rowChildLearn', {
                    count: wordsTask.words?.ranks.length ?? 0,
                  })}
                  onPress={() => router.dismissTo('/languages')}
                />
              )}
              {activeTasks.length > 0 && (
                <TaskCarousel
                  tone="child"
                  tasks={activeTasks}
                  renderTask={(task, style) => (
                    <ChildTaskTile
                      task={task}
                      author={authorOf(task, t('member.parent'))}
                      onPress={openTask}
                      action={<DoneButton task={task} />}
                      style={style}
                    />
                  )}
                />
              )}
              <WishlistPreview
                readyCount={wishlist.readyCount}
                current={wishlist.current}
                onPress={() => router.push('/wishlist')}
              />
              <RecentActivity
                events={feed}
                viewer="child"
                onSeeAll={() => router.push('/activity')}
                isLoading={feedQuery.isPending}
                isError={feedQuery.isError}
                onRetry={() => {
                  void feedQuery.refetch();
                }}
              />
            </>
          )}
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
