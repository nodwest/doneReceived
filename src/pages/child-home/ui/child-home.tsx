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
import { ChildActivityItem } from '@entities/activity';
import {
  ChildTaskTile,
  countTasks,
  filterTasks,
  useTasks,
  type Task,
} from '@entities/task';
import { useWishlistProgress } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import {
  childAccountMock,
  childActivityMock,
  childProfilesMock,
} from '@shared/mocks';
import { styles } from './child-home.styled';

const NO_TASKS: Task[] = [];

/** Приветствие по времени суток: утро до 12, день до 18, дальше вечер. */
function greetingKey(hour: number) {
  if (hour >= 5 && hour < 12) return 'home.greetingMorning' as const;
  if (hour >= 12 && hour < 18) return 'home.greetingAfternoon' as const;
  return 'home.greetingEvening' as const;
}

/**
 * Главная ребёнка (Emma, временный режим ребёнка из профиля): баланс и
 * счётчики заданий, карусель активных заданий с I did it!, плитка
 * вишлиста (текущее желание) и лента событий. Тап по заданию открывает его карточку на
 * вкладке Tasks.
 */
export function ChildHomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data = NO_TASKS } = useTasks();
  const myTasks = useMemo(
    () => filterTasks(data, { assigneeId: childAccountMock.id }),
    [data],
  );
  const activeTasks = useMemo(
    () => myTasks.filter((task) => task.status === 'active'),
    [myTasks],
  );
  const counts = countTasks(myTasks);
  const balance =
    childProfilesMock.find((child) => child.id === childAccountMock.id)
      ?.balance ?? 0;
  const wishlist = useWishlistProgress(childAccountMock.id, balance);

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
            name={childAccountMock.name}
            avatar={childAccountMock.avatar}
          />
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
                  label={
                    task.id === activeTasks[0].id
                      ? t('childHome.nextUp')
                      : t('childHome.comingUp')
                  }
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
          <RecentActivity>
            {childActivityMock.map(({ id, ...item }) => (
              <ChildActivityItem key={id} {...item} />
            ))}
          </RecentActivity>
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
