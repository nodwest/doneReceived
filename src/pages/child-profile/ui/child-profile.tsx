import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { DaySummary } from '@widgets/day-summary';
import { HomeSummary } from '@widgets/home-summary';
import { MapPreview } from '@widgets/map';
import { ProfileHeader } from '@widgets/profile-header';
import {
  OperationRow,
  operationsSince,
  sumTotals,
  useOperations,
  type Operation,
} from '@entities/operation';
import { countTasks, useTasks, type Task } from '@entities/task';
import { addDays } from '@shared/lib';
import { childProfilesMock } from '@shared/mocks';
import { SectionHeader } from '@shared/ui';
import { styles } from './child-profile.styled';

const NO_TASKS: Task[] = [];
const NO_OPERATIONS: Operation[] = [];
const RECENT_REWARDS = 3;
// «This week» — последние 7 дней вместе с сегодняшним.
const WEEK_DAYS = 7;

/** Профиль ребёнка: статус, баланс, задачи, награды и место на карте. */
export function ChildProfilePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: tasks = NO_TASKS } = useTasks();
  const { data: operations = NO_OPERATIONS } = useOperations();
  const [weekStart] = useState(() => addDays(new Date(), 1 - WEEK_DAYS));

  const child = childProfilesMock.find((item) => String(item.id) === id);
  if (!child) return <Redirect href="/" />;

  const counts = countTasks(tasks, child.id);
  const childOperations = operations.filter(
    (operation) => operation.child.id === child.id,
  );
  const week = sumTotals(operationsSince(childOperations, weekStart));
  // История уже отсортирована: сначала новые.
  const rewards = childOperations
    .filter((operation) => operation.kind === 'earned')
    .slice(0, RECENT_REWARDS);

  const openTasks = (tab: 'all' | 'review') =>
    router.push({
      pathname: '/child/[id]/tasks',
      params: { id: String(child.id), tab },
    });
  const openMap = () => router.replace('/map');

  return (
    <TabScreen activeKey="family">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={child.name}
          avatar={child.avatar}
          presence={child.presence}
          onBack={() =>
            router.canGoBack() ? router.back() : router.replace('/')
          }
        />
        <HomeSummary
          amount={child.balance}
          amountLabel="Balance"
          activeTasks={counts.active}
          tasksToReview={counts.review}
          onActiveTasksPress={() => openTasks('all')}
          onTasksToReviewPress={() => openTasks('review')}
        />
        <DaySummary title="This week" {...week} />
        <View style={styles.section}>
          <SectionHeader
            title="Recent rewards"
            actionLabel="See all"
            onAction={() =>
              router.replace({
                pathname: '/wallet',
                params: { child: String(child.id) },
              })
            }
          />
          {rewards.length === 0 ? (
            <Text style={styles.empty}>No rewards yet</Text>
          ) : (
            <View style={styles.list}>
              {rewards.map((operation) => (
                <OperationRow key={operation.id} {...operation} caption="day" />
              ))}
            </View>
          )}
        </View>
        <View style={styles.section}>
          <SectionHeader
            title="Location"
            actionLabel="Open map"
            onAction={openMap}
          />
          <MapPreview
            position={child.position}
            avatar={child.avatar}
            presence={child.presence}
            onPress={openMap}
          />
        </View>
      </ScrollView>
    </TabScreen>
  );
}
