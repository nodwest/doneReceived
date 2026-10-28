import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { DaySummary } from '@widgets/day-summary';
import { HomeSummary } from '@widgets/home-summary';
import { MapPreview } from '@widgets/map';
import { ProfileHeader } from '@widgets/profile-header';
import {
  latestRewards,
  OperationRow,
  operationsInPeriod,
  PeriodSelect,
  sumTotals,
  useOperations,
  type Operation,
  type SummaryPeriod,
} from '@entities/operation';
import { countTasks, useTasks, type Task } from '@entities/task';
import type { ParentProfile } from '@entities/user';
import { parentProfilesMock } from '@shared/mocks';
import { useTranslation } from '@shared/i18n';
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
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: tasks = NO_TASKS } = useTasks();
  const { data: operations = NO_OPERATIONS } = useOperations();
  // Сегодня фиксируем на время жизни экрана: от него считаются периоды.
  const [today] = useState(() => new Date());
  const [period, setPeriod] = useState<SummaryPeriod>('week');

  const parent: ParentProfile | undefined = parentProfilesMock.find(
    (item) => String(item.id) === id,
  );
  if (!parent) return <Redirect href="/" />;

  const counts = countTasks(tasks, { createdBy: parent.id });
  const parentOperations = operations.filter(
    (operation) => operation.parentId === parent.id,
  );
  const totals = sumTotals(operationsInPeriod(parentOperations, period, today));
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
                />
              ))}
            </View>
          )}
        </ScreenSection>
        <ScreenSection
          title={t('memberProfile.location')}
          actionLabel={t('memberProfile.openMap')}
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
