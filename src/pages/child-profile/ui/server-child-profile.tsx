import { ScrollView, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { HomeSummary } from '@widgets/home-summary';
import { ProfileHeader } from '@widgets/profile-header';
import { useFamilyTasks, useTaskFamilyId } from '@features/family-tasks';
import { useFamilyChildren } from '@entities/family';
import { countChildTasks, TaskIconBadge, type Task } from '@entities/task';
import { ChildTransactionRow, useChildWallet } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { parentMock } from '@shared/mocks';
import { ScreenSection } from '@shared/ui';
import { styles } from './child-profile.styled';

const NO_TASKS: Task[] = [];
const RECENT_REWARDS = 3;

/**
 * Профиль ребёнка семьи с сервера: имя (без фото — буква), баланс и
 * начисления из его кошелька, задания. Статуса «дома», карты, итогов за
 * период и вишлиста с сервера пока нет — этих блоков нет.
 */
export function ServerChildProfile({ id }: { id: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const familyId = useTaskFamilyId();
  const { data: children, isPending } = useFamilyChildren(familyId);
  const { data: tasks = NO_TASKS } = useFamilyTasks();
  const { data: wallet } = useChildWallet(id, familyId);
  const child = children?.find((item) => item.id === id);

  if (!child) {
    // Список детей ещё грузится — ждём, а не уводим на главную.
    if (familyId && isPending) return null;
    return <Redirect href="/" />;
  }

  // Активные — все задания ребёнка, на проверке — только свои.
  const counts = countChildTasks(tasks, id, String(parentMock.id));
  const rewards = (wallet?.transactions ?? []).slice(0, RECENT_REWARDS);
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
        <ScreenSection title={t('memberProfile.recentRewards')}>
          {rewards.length === 0 ? (
            <Text style={styles.empty}>{t('memberProfile.noRewards')}</Text>
          ) : (
            <View style={styles.list}>
              {rewards.map((transaction) => (
                <ChildTransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  rewardIcon={<TaskIconBadge size={40} />}
                  variant="card"
                  caption="when"
                />
              ))}
            </View>
          )}
        </ScreenSection>
      </ScrollView>
    </TabScreen>
  );
}
