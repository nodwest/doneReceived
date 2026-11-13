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
import { FeedItem } from '@entities/activity';
import { sumTotals } from '@entities/operation';
import { useMe, useMyAvatar, useMyId } from '@entities/session';
import { countChildTasks, countTasks } from '@entities/task';
import type { ChildOverview } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import { styles } from './parent-home.styled';
import { authorizedImage } from '@shared/api';

/** Приветствие по времени суток: утро до 12, день до 18, дальше вечер. */
function greetingKey(hour: number) {
  if (hour >= 5 && hour < 12) return 'home.greetingMorning' as const;
  if (hour >= 12 && hour < 18) return 'home.greetingAfternoon' as const;
  return 'home.greetingEvening' as const;
}

export function ParentHomePage() {
  const myId = useMyId();
  const { t } = useTranslation();
  const router = useRouter();
  // Имя и фото — вошедшего родителя (GET /users/me).
  const me = useMe();
  const myAvatar = useMyAvatar();
  // Счётчики заданий — из того же запроса, что и экран Tasks и профиль
  // ребёнка: цифры везде совпадают, созданная задача сразу видна на плитке.
  const { data: tasks } = useFamilyTasks();
  // Лента — события семьи с сервера.
  const { data: feed = [] } = useFamilyFeed();
  // Счётчики — только задания вошедшего родителя: их он ведёт и проверяет.
  const total = tasks && countTasks(tasks, { createdBy: myId });
  // Выплачено вошедшим родителем за всё время — из истории наград: после
  // подтверждения задания сумма растёт.
  const { data: operations } = useFamilyOperations();
  const rewardsPaid =
    operations &&
    sumTotals(operations.filter((operation) => operation.parentId === myId))
      .earned;
  // Дети семьи с сервера. Статуса «дома» пока нет (геолокация — п. 24).
  const { data: serverChildren } = useFamilyChildren(
    useCurrentFamily()?.id ?? null,
  );
  const children: ChildOverview[] = (serverChildren ?? []).map((child) => {
    const { active, review } = countChildTasks(tasks ?? [], child.id, myId);
    return {
      id: child.id,
      name: child.displayName,
      avatar: child.avatarUrl ? authorizedImage(child.avatarUrl) : null,
      activeTasks: active,
      reviewTasks: review,
      atHome: false,
    };
  });

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
          <HomeSummary
            amount={rewardsPaid ?? 0}
            activeTasks={total?.active ?? 0}
            tasksToReview={total?.review ?? 0}
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
          {feed.length > 0 && (
            <RecentActivity>
              {feed.map((event) => (
                <FeedItem key={event.id} event={event} viewer="parent" />
              ))}
            </RecentActivity>
          )}
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
