import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskButton } from '@features/create-task';
import { BottomNav } from '@widgets/bottom-nav';
import { ChildrenCarousel } from '@widgets/children-carousel';
import { HomeHeader } from '@widgets/home-header';
import { HomeSummary } from '@widgets/home-summary';
import { RecentActivity } from '@widgets/recent-activity';
import { useTasks } from '@entities/task';
import {
  childrenOverviewMock,
  familySummaryMock,
  parentMock,
  recentActivityMock,
} from '@shared/mocks';
import { styles } from './parent-home.styled';

export function ParentHomePage() {
  const router = useRouter();
  // Счётчики заданий — из того же запроса, что и экран Tasks: созданная задача
  // сразу видна на плитке, а кэш уже прогрет к переходу. Пока список грузится,
  // показываем значения из сводки.
  const { data: tasks } = useTasks();
  const summary = tasks
    ? {
        rewardsPaid: familySummaryMock.rewardsPaid,
        activeTasks: tasks.filter((task) => task.status === 'active').length,
        tasksToReview: tasks.filter((task) => task.status === 'review').length,
      }
    : familySummaryMock;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            greeting={parentMock.greeting}
            name={parentMock.name}
            avatar={parentMock.avatar}
          />
          <HomeSummary
            {...summary}
            onActiveTasksPress={() =>
              router.replace({ pathname: '/tasks', params: { tab: 'all' } })
            }
            onTasksToReviewPress={() =>
              router.replace({ pathname: '/tasks', params: { tab: 'review' } })
            }
          />
          <ChildrenCarousel items={childrenOverviewMock} />
          <CreateTaskButton onPress={() => router.push('/create-task')} />
          <RecentActivity items={recentActivityMock} />
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
