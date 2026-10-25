import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskButton } from '@features/create-task';
import { BottomNav } from '@widgets/bottom-nav';
import { ChildrenCarousel } from '@widgets/children-carousel';
import { HomeHeader } from '@widgets/home-header';
import { HomeSummary } from '@widgets/home-summary';
import { RecentActivity } from '@widgets/recent-activity';
import { countTasks, useTasks } from '@entities/task';
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
  // Счётчики заданий — из того же запроса, что и экран Tasks и профиль
  // ребёнка: цифры везде совпадают, созданная задача сразу видна на плитке.
  // Пока список грузится, показываем значения из сводки.
  const { data: tasks } = useTasks();
  const total = tasks && countTasks(tasks);
  const children = childProfilesMock.map((child) => {
    const counts = countTasks(tasks ?? [], { assigneeId: child.id });
    return {
      id: child.id,
      name: child.name,
      avatar: child.avatar,
      activeTasks: counts.active,
      reviewTasks: counts.review,
      atHome: child.presence.atHome,
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
            name={parentMock.name}
            avatar={parentMock.avatar}
          />
          <HomeSummary
            amount={familySummaryMock.rewardsPaid}
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
                params: { id: String(child.id) },
              })
            }
            onTasksPress={(child, tab) =>
              router.push({
                pathname: '/child/[id]/tasks',
                params: { id: String(child.id), tab },
              })
            }
          />
          <CreateTaskButton onPress={() => router.push('/create-task')} />
          <RecentActivity items={recentActivityMock} />
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
