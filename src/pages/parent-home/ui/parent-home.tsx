import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskButton } from '@features/create-task';
import { BottomNav } from '@widgets/bottom-nav';
import { ChildrenCarousel } from '@widgets/children-carousel';
import { HomeHeader } from '@widgets/home-header';
import { HomeSummary } from '@widgets/home-summary';
import { RecentActivity } from '@widgets/recent-activity';
import { useFamilyFeed, useFamilyTasks } from '@features/family-tasks';
import { useCurrentFamily, useFamilyChildren } from '@entities/family';
import { useMe, useMyAvatar, useMyId } from '@entities/session';
import { countChildTasks, countTasks } from '@entities/task';
import type { ChildOverview } from '@entities/user';
import { useParentPaidTotal } from '@entities/wallet';
import { useTheme } from '@shared/theme';
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
  useTheme();
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
  const feedQuery = useFamilyFeed();
  const { data: feed = [] } = feedQuery;
  // Счётчики — только задания вошедшего родителя: их он ведёт и проверяет.
  const total = tasks && countTasks(tasks, { createdBy: myId });
  // Выплачено вошедшим родителем за всё время — серверный агрегат, а не
  // обрезанная страница истории.
  const familyId = useCurrentFamily()?.id ?? null;
  const { data: paidTotal } = useParentPaidTotal(familyId, myId);
  const rewardsPaid = paidTotal ? Number(paidTotal.points) : 0;
  // Дети семьи с сервера. Статус «дома» к геозонам пока не подключён.
  const { data: serverChildren } = useFamilyChildren(familyId);
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
            amount={rewardsPaid}
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
          <RecentActivity
            events={feed}
            viewer="parent"
            isLoading={feedQuery.isPending}
            isError={feedQuery.isError}
            onRetry={() => {
              void feedQuery.refetch();
            }}
          />
        </ScrollView>
        <BottomNav activeKey="home" />
      </SafeAreaView>
    </View>
  );
}
