import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskButton } from '@features/create-task';
import { BottomNav } from '@widgets/bottom-nav';
import { ChildrenCarousel } from '@widgets/children-carousel';
import { HomeHeader } from '@widgets/home-header';
import { HomeSummary } from '@widgets/home-summary';
import { RecentActivity } from '@widgets/recent-activity';
import {
  useFamilyFeed,
  useFamilyOperations,
  useFamilyTasks,
} from '@features/family-tasks';
import { useCurrentFamily, useFamilyChildren } from '@entities/family';
import { ActivityItem, FeedItem } from '@entities/activity';
import { sumTotals } from '@entities/operation';
import { useMe, useMyAvatar } from '@entities/session';
import { countChildTasks, countTasks } from '@entities/task';
import type { ChildOverview } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import {
  childProfilesMock,
  familySummaryMock,
  parentMock,
  recentActivityMock,
} from '@shared/mocks';
import { styles } from './parent-home.styled';

/** Приветствие по времени суток: утро до 12, день до 18, дальше вечер. */
function greetingKey(hour: number) {
  if (hour >= 5 && hour < 12) return 'home.greetingMorning' as const;
  if (hour >= 12 && hour < 18) return 'home.greetingAfternoon' as const;
  return 'home.greetingEvening' as const;
}

export function ParentHomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  // Имя и фото — вошедшего родителя (GET /users/me).
  const me = useMe();
  const myAvatar = useMyAvatar();
  // Счётчики заданий — из того же запроса, что и экран Tasks и профиль
  // ребёнка: цифры везде совпадают, созданная задача сразу видна на плитке.
  // Пока список грузится, показываем значения из сводки.
  const { data: tasks } = useFamilyTasks();
  // Лента — события семьи с сервера; без семьи — моки.
  const { feedViewer, data: feed = [] } = useFamilyFeed();
  // Счётчики — только задания вошедшего родителя: их он ведёт и проверяет.
  const total =
    tasks && countTasks(tasks, { createdBy: String(parentMock.id) });
  // Выплачено вошедшим родителем за всё время — из истории наград: после
  // подтверждения задания сумма растёт.
  const { data: operations } = useFamilyOperations();
  const rewardsPaid =
    operations &&
    sumTotals(
      operations.filter(
        (operation) => operation.parentId === String(parentMock.id),
      ),
    ).earned;
  // Дети: моковые Emma и Liam и дети семьи с сервера (созданные через
  // Add a child). Статуса «дома» у настоящих пока нет.
  const { data: serverChildren } = useFamilyChildren(
    useCurrentFamily()?.id ?? null,
  );
  const counts = (id: string) =>
    countChildTasks(tasks ?? [], id, String(parentMock.id));
  const children: ChildOverview[] = [
    ...childProfilesMock.map((child) => {
      const { active, review } = counts(String(child.id));
      return {
        id: String(child.id),
        name: child.name,
        avatar: child.avatar,
        activeTasks: active,
        reviewTasks: review,
        atHome: child.presence.atHome,
      };
    }),
    ...(serverChildren ?? []).map((child) => {
      const { active, review } = counts(child.id);
      return {
        id: child.id,
        name: child.displayName,
        avatar: child.avatarUrl ? { uri: child.avatarUrl } : null,
        activeTasks: active,
        reviewTasks: review,
        atHome: false,
      };
    }),
  ];

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
            name={me?.displayName ?? parentMock.name}
            avatar={me ? myAvatar : parentMock.avatar}
          />
          <HomeSummary
            amount={rewardsPaid ?? familySummaryMock.rewardsPaid}
            activeTasks={total?.active ?? familySummaryMock.activeTasks}
            tasksToReview={total?.review ?? familySummaryMock.tasksToReview}
            onActiveTasksPress={() =>
              router.push({ pathname: '/tasks', params: { tab: 'all' } })
            }
            onTasksToReviewPress={() =>
              router.push({ pathname: '/tasks', params: { tab: 'review' } })
            }
          />
          <ChildrenCarousel
            items={children}
            onSelect={(child) =>
              router.push({
                pathname: '/child/[id]',
                params: { id: child.id },
              })
            }
            onTasksPress={(child, tab) =>
              router.push({
                pathname: '/child/[id]/tasks',
                params: { id: child.id, tab },
              })
            }
          />
          <CreateTaskButton onPress={() => router.push('/create-task')} />
          {feedViewer ? (
            feed.length > 0 && (
              <RecentActivity>
                {feed.map((event) => (
                  <FeedItem key={event.id} event={event} viewer="parent" />
                ))}
              </RecentActivity>
            )
          ) : (
            <RecentActivity>
              {recentActivityMock.map(({ id, ...item }) => (
                <ActivityItem key={id} {...item} />
              ))}
            </RecentActivity>
          )}
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
