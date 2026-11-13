import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
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
import { FeedItem } from '@entities/activity';
import {
  ChildTaskTile,
  countTasks,
  sortTasksByUrgency,
  type Task,
} from '@entities/task';
import { useMe, useMyAvatar } from '@entities/session';
import { useWishlistProgress } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { styles } from './child-home.styled';

const NO_TASKS: Task[] = [];

/**
 * Кто дал задание: имя из участников семьи (без фото — буква), не знаем —
 * просто «Родитель».
 */
const authorOf = (task: Task, parentLabel: string) => ({
  name: task.authorName ?? parentLabel,
  avatar: null,
});

/** Приветствие по времени суток: утро до 12, день до 18, дальше вечер. */
function greetingKey(hour: number) {
  if (hour >= 5 && hour < 12) return 'home.greetingMorning' as const;
  if (hour >= 12 && hour < 18) return 'home.greetingAfternoon' as const;
  return 'home.greetingEvening' as const;
}

/**
 * Главная вошедшего ребёнка: баланс и
 * счётчики заданий, карусель активных заданий с I did it!, плитка
 * вишлиста (текущее желание) и лента событий. Тап по заданию открывает его карточку на
 * вкладке Tasks.
 */
export function ChildHomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  // Имя и фото вошедшего ребёнка (GET /users/me).
  const me = useMe();
  const myAvatar = useMyAvatar();
  // Лента — события ребёнка с сервера.
  const { data: feed = [] } = useFamilyFeed();
  const { data: myTasks = NO_TASKS, isPending: tasksPending } = useChildTasks();
  // Ближайшие по сроку — первыми, как в списке «To do».
  const activeTasks = useMemo(
    () =>
      sortTasksByUrgency(myTasks.filter((task) => task.status === 'active')),
    [myTasks],
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

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            greeting={t(greetingKey(new Date().getHours()))}
            name={me?.displayName ?? ''}
            avatar={myAvatar}
          />
          {!loading && (
            <>
              <HomeSummary
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
              {feed.length > 0 && (
                <RecentActivity>
                  {feed.map((event) => (
                    <FeedItem key={event.id} event={event} viewer="child" />
                  ))}
                </RecentActivity>
              )}
            </>
          )}
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
