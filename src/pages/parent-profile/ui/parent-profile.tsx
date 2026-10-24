import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { DaySummary } from '@widgets/day-summary';
import { HomeSummary } from '@widgets/home-summary';
import { MapPreview } from '@widgets/map';
import { ProfileHeader } from '@widgets/profile-header';
import {
  getWeekStart,
  latestRewards,
  OperationRow,
  operationsSince,
  sumTotals,
  useOperations,
  type Operation,
} from '@entities/operation';
import { countTasks, useTasks, type Task } from '@entities/task';
import type { ParentProfile } from '@entities/user';
import { parentProfilesMock } from '@shared/mocks';
import { ScreenSection } from '@shared/ui';
import { styles } from './parent-profile.styled';

const NO_TASKS: Task[] = [];
const NO_OPERATIONS: Operation[] = [];
const RECENT_REWARDS = 3;

/**
 * Профиль родителя: как у ребёнка, но вместо баланса — выплаченные награды,
 * задач на проверке нет, а итоги и награды — по задачам, которые он создал.
 */
export function ParentProfilePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: tasks = NO_TASKS } = useTasks();
  const { data: operations = NO_OPERATIONS } = useOperations();
  const [weekStart] = useState(() => getWeekStart(new Date()));

  const parent: ParentProfile | undefined = parentProfilesMock.find(
    (item) => String(item.id) === id,
  );
  if (!parent) return <Redirect href="/" />;

  const counts = countTasks(tasks, { createdBy: parent.id });
  const parentOperations = operations.filter(
    (operation) => operation.parentId === parent.id,
  );
  const week = sumTotals(operationsSince(parentOperations, weekStart));
  const rewards = latestRewards(parentOperations, RECENT_REWARDS);

  const openMap = () => router.replace('/map');

  return (
    <TabScreen activeKey="family">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={parent.name}
          avatar={parent.avatar}
          presence={parent.presence}
          onBack={() =>
            router.canGoBack() ? router.back() : router.replace('/family')
          }
        />
        <HomeSummary
          amount={parent.rewardsPaid}
          activeTasks={counts.active}
          onActiveTasksPress={() =>
            router.push({
              pathname: '/parent/[id]/tasks',
              params: { id: String(parent.id) },
            })
          }
        />
        <DaySummary title="This week" {...week} />
        <ScreenSection
          title="Recent rewards"
          actionLabel="See all"
          onAction={() => router.replace('/wallet')}
        >
          {rewards.length === 0 ? (
            <Text style={styles.empty}>No rewards yet</Text>
          ) : (
            <View style={styles.list}>
              {/* Награды по его задачам получают разные дети: в подписи имя. */}
              {rewards.map((operation) => (
                <OperationRow
                  key={operation.id}
                  {...operation}
                  caption="child-day"
                />
              ))}
            </View>
          )}
        </ScreenSection>
        <ScreenSection
          title="Location"
          actionLabel="Open map"
          onAction={openMap}
        >
          <MapPreview
            position={parent.position}
            avatar={parent.avatar}
            presence={parent.presence}
            onPress={openMap}
          />
        </ScreenSection>
      </ScrollView>
    </TabScreen>
  );
}
