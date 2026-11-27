import { Pressable, ScrollView, Text, View } from 'react-native';
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
  useFamilyTasks,
  useTaskFamilyId,
} from '@features/family-tasks';
import { FeaturedEventCard } from '@entities/family-event';
import { useFamilyEvents } from '@features/family-event';
import {
  isLocationPresenceFresh,
  useLocationPresence,
} from '@features/location';
import { useLocationZones } from '@entities/zone';
import { useFamilyChildren } from '@entities/family';
import { useMe, useMyAvatar, useMyId } from '@entities/session';
import { countChildTasks, countTasks } from '@entities/task';
import type { ChildOverview } from '@entities/user';
import { useParentPaidTotal } from '@entities/wallet';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { styles } from './parent-home.styled';
import { authorizedImage } from '@shared/api';

export function ParentHomePage() {
  useTheme();
  const myId = useMyId();
  const { t } = useTranslation();
  const router = useRouter();
  // Имя и фото — вошедшего родителя (GET /users/me).
  const me = useMe();
  const myAvatar = useMyAvatar();
  // Счётчики заданий — из того же запроса, что и экран Tasks и профиль
  // ребёнка: цифры везде совпадают, созданная задача сразу видна на плитке.
  const tasksQuery = useFamilyTasks();
  const { data: tasks } = tasksQuery;
  // Лента — события семьи с сервера.
  const feedQuery = useFamilyFeed();
  const { data: feed = [] } = feedQuery;
  // Счётчики — только задания вошедшего родителя: их он ведёт и проверяет.
  const total = tasks && countTasks(tasks, { createdBy: myId });
  // Выплачено вошедшим родителем за всё время — серверный агрегат, а не
  // обрезанная страница истории.
  const familyId = useTaskFamilyId();
  const { data: paidTotal } = useParentPaidTotal(familyId, myId);
  const rewardsPaid = paidTotal ? Number(paidTotal.points) : 0;
  const calendar = useFamilyEvents(0, false);
  const childrenQuery = useFamilyChildren(familyId);
  const familyAccessDenied =
    childrenQuery.accessDenied ||
    tasksQuery.accessDenied ||
    feedQuery.accessDenied;
  const locationFamilyId = familyAccessDenied ? null : familyId;
  const presence = useLocationPresence(locationFamilyId);
  const zones = useLocationZones(locationFamilyId);
  const presenceByChild = new Map(
    (presence.isError ? [] : (presence.data?.children ?? [])).map((item) => [
      item.childId,
      item,
    ]),
  );
  const zoneNames = new Map(
    (zones.isError ? [] : (zones.data ?? [])).map((zone) => [
      zone.id,
      zone.name,
    ]),
  );
  const event =
    familyAccessDenied || calendar.rollingError ? null : calendar.featured;
  const serverChildren = familyAccessDenied ? undefined : childrenQuery.data;
  const children: ChildOverview[] = (serverChildren ?? []).map((child) => {
    const { active, review } = countChildTasks(tasks ?? [], child.id, myId);
    const location = presenceByChild.get(child.id);
    const timestamp = Date.parse(
      location?.recordedAt ?? location?.updatedAt ?? '',
    );
    const locationName = isLocationPresenceFresh(location, calendar.now)
      ? location?.zones
          .filter((zone) => zone.state === 'inside')
          .sort((a, b) => Date.parse(b.since) - Date.parse(a.since))
          .map((zone) => zoneNames.get(zone.zoneId))
          .find(Boolean)
      : undefined;
    return {
      id: child.id,
      name: child.displayName,
      avatar: child.avatarUrl ? authorizedImage(child.avatarUrl) : null,
      activeTasks: active,
      reviewTasks: review,
      locationName,
      lastLocationAt: Number.isFinite(timestamp)
        ? new Date(timestamp)
        : undefined,
    };
  });

  const summary = (
    <HomeSummary
      variant="plain"
      amount={familyAccessDenied ? 0 : rewardsPaid}
      activeTasks={familyAccessDenied ? 0 : (total?.active ?? 0)}
      tasksToReview={familyAccessDenied ? 0 : (total?.review ?? 0)}
      onActiveTasksPress={() =>
        router.push({ pathname: '/tasks', params: { tab: 'all' } })
      }
      onTasksToReviewPress={() =>
        router.push({ pathname: '/tasks', params: { tab: 'review' } })
      }
    />
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          bounces={false}
          overScrollMode="never"
          style={styles.scroll}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            name={me?.displayName ?? ''}
            avatar={myAvatar}
            summary={summary}
          />
          {event && (
            <FeaturedEventCard
              event={event}
              homeStatus={event.startsAt <= calendar.now ? 'live' : 'upcoming'}
              onPress={() =>
                router.push({
                  pathname: '/family-event/[id]',
                  params: {
                    id: event.id,
                    ...(event.repeat === 'annual'
                      ? { year: String(event.startsAt.getFullYear()) }
                      : {}),
                  },
                })
              }
            />
          )}
          {children.length > 0 ? (
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
          ) : familyAccessDenied || childrenQuery.isError ? (
            <View>
              <Text
                style={styles.childrenStatus}
                accessibilityLiveRegion="polite"
              >
                {t('home.childrenLoadError')}
              </Text>
              {!familyAccessDenied && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    void childrenQuery.refetch({ cancelRefetch: false })
                  }
                >
                  <Text style={styles.childrenRetry}>{t('common.retry')}</Text>
                </Pressable>
              )}
            </View>
          ) : familyId ? (
            <Text
              style={styles.childrenStatus}
              accessibilityLiveRegion="polite"
            >
              {t(
                childrenQuery.isPending ? 'common.loading' : 'home.noChildren',
              )}
            </Text>
          ) : null}
          <CreateTaskButton onPress={() => router.push('/create-task')} />
          <RecentActivity
            events={familyAccessDenied ? [] : feed}
            viewer="parent"
            onSeeAll={() => router.push('/activity')}
            isLoading={feedQuery.isPending}
            isError={familyAccessDenied || feedQuery.isError}
            onRetry={
              familyAccessDenied
                ? undefined
                : () => void feedQuery.refetch({ cancelRefetch: false })
            }
          />
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
