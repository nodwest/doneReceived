import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  Redirect,
  router as appRouter,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { DaySummary } from '@widgets/day-summary';
import { HomeSummary } from '@widgets/home-summary';
import { ProfileHeader } from '@widgets/profile-header';
import {
  useFamilyOperations,
  useFamilyTasks,
  useTaskFamilyId,
} from '@features/family-tasks';
import { useFamilyMembers } from '@entities/family';
import {
  latestRewards,
  OperationRow,
  operationsInPeriod,
  PeriodSelect,
  sumTotals,
  type Operation,
  type SummaryPeriod,
} from '@entities/operation';
import { useMyId } from '@entities/session';
import { countTasks, type Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { ScreenSection } from '@shared/ui';
import { styles } from './parent-profile.styled';
import { authorizedImage } from '@shared/api';

const NO_TASKS: Task[] = [];
const NO_OPERATIONS: Operation[] = [];
const RECENT_REWARDS = 3;

// Тап по награде — карточка задания в истории наград. В истории родителя
// только его награды, поэтому открываются только они.
const openReward = (operation: Operation) =>
  appRouter.push({
    pathname: '/rewards-history',
    params: { operation: String(operation.id) },
  });

/**
 * Профиль родителя (/parent/[id], id — userId участника семьи): выплаченные
 * награды и активные задания, итоги за период и последние награды — по
 * заданиям, которые он создал.
 */
export function ParentProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const myId = useMyId();
  const { data: members, isPending } = useFamilyMembers(useTaskFamilyId());
  const { data: tasks = NO_TASKS } = useFamilyTasks();
  const { data: operations = NO_OPERATIONS } = useFamilyOperations();
  // Сегодня фиксируем на время жизни экрана: от него считаются периоды.
  const [today] = useState(() => new Date());
  const [period, setPeriod] = useState<SummaryPeriod>('week');

  const parent = members?.find(
    (member) => member.userId === id && member.kind === 'parent',
  );
  if (isPending) return null;
  if (!parent) return <Redirect href="/" />;

  const counts = countTasks(tasks, { createdBy: parent.userId });
  const parentOperations = operations.filter(
    (operation) => operation.parentId === parent.userId,
  );
  const totals = sumTotals(operationsInPeriod(parentOperations, period, today));
  const rewards = latestRewards(parentOperations, RECENT_REWARDS);

  return (
    <TabScreen activeKey="family">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={parent.displayName}
          avatar={parent.avatarUrl ? authorizedImage(parent.avatarUrl) : null}
          onBack={() =>
            router.canGoBack() ? router.back() : router.replace('/family')
          }
        />
        <HomeSummary
          // Выплачено за всё время: награды по его заданиям из истории.
          amount={sumTotals(parentOperations).earned}
          activeTasks={counts.active}
          onActiveTasksPress={() =>
            router.push({
              pathname: '/parent/[id]/tasks',
              params: { id: parent.userId },
            })
          }
        />
        {/* У родителя earned — выплаченные награды, missed — невыплаченные. */}
        <DaySummary
          title={<PeriodSelect value={period} onChange={setPeriod} />}
          labels={{
            earned: t('memberProfile.paid'),
            missed: t('memberProfile.notPaid'),
          }}
          {...totals}
        />
        <ScreenSection
          title={t('memberProfile.recentRewards')}
          actionLabel={t('common.seeAll')}
          onAction={() => router.push('/rewards-history')}
        >
          {rewards.length === 0 ? (
            <Text style={styles.empty}>{t('memberProfile.noRewards')}</Text>
          ) : (
            <View style={styles.list}>
              {/* Награды по его задачам получают разные дети: в подписи имя. */}
              {rewards.map((operation) => (
                <OperationRow
                  key={operation.id}
                  {...operation}
                  caption="child-day"
                  onPress={
                    parent.userId === myId
                      ? () => openReward(operation)
                      : undefined
                  }
                />
              ))}
            </View>
          )}
        </ScreenSection>
      </ScrollView>
    </TabScreen>
  );
}
