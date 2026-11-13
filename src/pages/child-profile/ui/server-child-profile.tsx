import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { DaySummary } from '@widgets/day-summary';
import { HomeSummary } from '@widgets/home-summary';
import { ProfileHeader } from '@widgets/profile-header';
import {
  useFamilyOperations,
  useFamilyTasks,
  useTaskFamilyId,
} from '@features/family-tasks';
import { useFamilyChildren } from '@entities/family';
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
import { useChildWallet } from '@entities/wallet';
import { useWishlistProgress, WishRow } from '@entities/wish';
import { useMyId } from '@entities/session';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { ScreenSection, SnapCarousel } from '@shared/ui';
import { styles } from './child-profile.styled';

const NO_TASKS: Task[] = [];
const NO_OPERATIONS: Operation[] = [];
const RECENT_REWARDS = 3;

/**
 * Профиль ребёнка семьи с сервера: имя (без фото — буква), баланс из его
 * кошелька, задания, итоги и награды (из истории, собранной из кошелька и
 * заданий), вишлист. Статуса «дома» и карты с сервера пока нет — этих блоков
 * нет.
 */
export function ServerChildProfile({ id }: { id: string }) {
  const myId = useMyId();
  const { t } = useTranslation();
  const router = useRouter();
  const familyId = useTaskFamilyId();
  const { data: children, isPending } = useFamilyChildren(familyId);
  const { data: tasks = NO_TASKS } = useFamilyTasks();
  const { data: wallet } = useChildWallet(id, familyId);
  const { data: operations = NO_OPERATIONS } = useFamilyOperations();
  // Сегодня фиксируем на время жизни экрана: от него считаются периоды.
  const [today] = useState(() => new Date());
  const [period, setPeriod] = useState<SummaryPeriod>('week');
  const child = children?.find((item) => item.id === id);
  const wishlist = useWishlistProgress(
    { childId: id, familyId },
    wallet?.balance ?? 0,
  );

  if (!child) {
    // Список детей ещё грузится — ждём, а не уводим на главную.
    if (familyId && isPending) return null;
    return <Redirect href="/" />;
  }

  // Активные — все задания ребёнка, на проверке — только свои.
  const counts = countChildTasks(tasks, id, myId);
  const childOperations = operations.filter(
    (operation) => operation.child.id === id,
  );
  const totals = sumTotals(operationsInPeriod(childOperations, period, today));
  const rewards = latestRewards(childOperations, RECENT_REWARDS);
  // Тап по своей награде — её карточка в истории наград.
  const openReward = (operation: Operation) =>
    router.push({
      pathname: '/rewards-history',
      params: { operation: operation.id },
    });
  const openTasks = (tab: 'all' | 'review') =>
    router.push({ pathname: '/child/[id]/tasks', params: { id, tab } });

  return (
    <TabScreen activeKey="family">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          name={child.displayName}
          avatar={child.avatarUrl ? { uri: child.avatarUrl } : null}
          onBack={() =>
            router.canGoBack() ? router.back() : router.replace('/')
          }
        />
        <HomeSummary
          amount={wallet?.balance ?? 0}
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
            router.push({ pathname: '/child/[id]/wishlist', params: { id } })
          }
        >
          {!wishlist.isPending && wishlist.progress.length === 0 ? (
            <Text style={styles.empty}>
              {t('wishCard.noWishes', { name: child.displayName })}
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
                      params: { id, wishId: item.wish.id },
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
            router.push({ pathname: '/rewards-history', params: { child: id } })
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
                    operation.parentId === myId
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
