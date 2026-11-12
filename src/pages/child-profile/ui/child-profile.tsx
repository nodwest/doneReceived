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
import { MapPreview } from '@widgets/map';
import { ProfileHeader } from '@widgets/profile-header';
import { useFamilyOperations, useFamilyTasks } from '@features/family-tasks';
import {
  latestRewards,
  OperationRow,
  operationsInPeriod,
  PeriodSelect,
  sumTotals,
  type Operation,
  type SummaryPeriod,
} from '@entities/operation';
import { countChildTasks, type Task } from '@entities/task';
import type { ChildProfile } from '@entities/user';
import { useChildBalance } from '@entities/wallet';
import { useWishlistProgress, WishRow } from '@entities/wish';
import { childProfilesMock, parentMock } from '@shared/mocks';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { ScreenSection, SnapCarousel } from '@shared/ui';
import { styles } from './child-profile.styled';
import { ServerChildProfile } from './server-child-profile';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NO_TASKS: Task[] = [];
const NO_OPERATIONS: Operation[] = [];
const RECENT_REWARDS = 3;

// Тап по награде — карточка задания в истории наград. В истории родителя
// только его награды, поэтому открываются они.
const openReward = (operation: Operation) =>
  appRouter.push({
    pathname: '/rewards-history',
    params: { operation: String(operation.id) },
  });

/**
 * Профиль ребёнка: статус, баланс, задачи, вишлист (сначала готовые, потом
 * текущее, потом ждущие — так их раскладывает баланс), награды и место на
 * карте.
 */
export function ChildProfilePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Ребёнок семьи с сервера (UUID) — свой профиль из настоящих данных.
  if (UUID.test(id)) return <ServerChildProfile id={id} />;
  return <MockChildProfile id={id} />;
}

/** Профиль мокового ребёнка (Emma, Liam): все блоки на моках. */
function MockChildProfile({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: tasks = NO_TASKS } = useFamilyTasks();
  const { data: operations = NO_OPERATIONS } = useFamilyOperations();
  // Сегодня фиксируем на время жизни экрана: от него считаются периоды.
  const [today] = useState(() => new Date());
  const [period, setPeriod] = useState<SummaryPeriod>('week');

  const child: ChildProfile | undefined = childProfilesMock.find(
    (item) => String(item.id) === id,
  );
  // Баланс — из кошелька ребёнка: после подтверждения задания он растёт.
  const { balance } = useChildBalance(child ? String(child.id) : null);
  const wishlist = useWishlistProgress(
    { childId: String(child?.id ?? -1), familyId: null },
    balance,
  );
  if (!child) return <Redirect href="/" />;

  // Активные — все задания ребёнка, на проверке — только свои.
  const counts = countChildTasks(
    tasks,
    String(child.id),
    String(parentMock.id),
  );
  const childOperations = operations.filter(
    (operation) => operation.child.id === String(child.id),
  );
  const totals = sumTotals(operationsInPeriod(childOperations, period, today));
  const rewards = latestRewards(childOperations, RECENT_REWARDS);

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
          amount={balance}
          amountLabel={t('summary.balance')}
          activeTasks={counts.active}
          tasksToReview={counts.review}
          onActiveTasksPress={() => openTasks('all')}
          onTasksToReviewPress={() => openTasks('review')}
        />
        <DaySummary
          title={<PeriodSelect value={period} onChange={setPeriod} />}
          {...totals}
        />
        <ScreenSection
          title={t('wishlist.title')}
          actionLabel={t('common.seeAll')}
          onAction={() =>
            router.push({
              pathname: '/child/[id]/wishlist',
              params: { id: String(child.id) },
            })
          }
        >
          {!wishlist.isPending && wishlist.progress.length === 0 ? (
            <Text style={styles.empty}>
              {t('wishCard.noWishes', { name: child.name })}
            </Text>
          ) : (
            <SnapCarousel
              items={wishlist.progress}
              keyExtractor={(item) => item.wish.id}
              dotColor={theme.colors.childFrom}
              renderItem={(item, style) => (
                <WishRow
                  {...item}
                  style={[style, styles.wish]}
                  onPress={() =>
                    router.push({
                      pathname: '/child/[id]/wishlist/[wishId]',
                      params: {
                        id: String(child.id),
                        wishId: String(item.wish.id),
                      },
                    })
                  }
                />
              )}
            />
          )}
        </ScreenSection>
        <ScreenSection
          title={t('memberProfile.recentRewards')}
          actionLabel={t('common.seeAll')}
          onAction={() =>
            router.push({
              pathname: '/rewards-history',
              params: { child: String(child.id) },
            })
          }
        >
          {rewards.length === 0 ? (
            <Text style={styles.empty}>{t('memberProfile.noRewards')}</Text>
          ) : (
            <View style={styles.list}>
              {rewards.map((operation) => (
                <OperationRow
                  key={operation.id}
                  {...operation}
                  caption="day"
                  onPress={
                    operation.parentId === String(parentMock.id)
                      ? () => openReward(operation)
                      : undefined
                  }
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
            position={child.position}
            avatar={child.avatar}
            presence={child.presence}
            onPress={openMap}
          />
        </ScreenSection>
      </ScrollView>
    </TabScreen>
  );
}
