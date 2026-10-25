import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AddMember } from '@widgets/add-member';
import { TabScreen } from '@widgets/bottom-nav';
import { useInviteCodes } from '@entities/family';
import { countTasks, useTasks, type Task } from '@entities/task';
import { MemberCard } from '@entities/user';
import {
  childProfilesMock,
  parentMock,
  parentProfilesMock,
} from '@shared/mocks';
import { useTranslation } from '@shared/i18n';
import { ScreenSection } from '@shared/ui';
import { styles } from './family.styled';

const NO_TASKS: Task[] = [];

/**
 * Вкладка Family: кнопка приглашения и карточки родителей и детей. Тап по
 * карточке открывает профиль, по чипу задач — его задачи. Карточка «You»
 * (владелец аккаунта) ведёт на главную и вкладку Tasks.
 */
export function FamilyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  // Счётчики — из того же списка задач, что на главной и в профилях.
  const { data: tasks = NO_TASKS } = useTasks();
  const { data: codes } = useInviteCodes();
  const parents = parentProfilesMock;
  const children = childProfilesMock;

  return (
    <TabScreen activeKey="family">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('family.title')}</Text>
          <Text style={styles.count}>
            {t('family.parents', { count: parents.length })} ·{' '}
            {t('family.children', { count: children.length })}
          </Text>
        </View>
        <AddMember codes={codes} />
        <ScreenSection title={t('family.parentsSection')}>
          <View style={styles.list}>
            {parents.map((parent) => {
              const id = String(parent.id);
              if (parent.id === parentMock.id) {
                // Владелец аккаунта: те же цифры, что на главной. Карточка
                // переключает на главную (как вкладка Home), чипы открывают
                // Tasks поверх Family — «назад» вернёт сюда.
                const total = countTasks(tasks);
                const openTasks = (tab: 'all' | 'review') =>
                  router.push({ pathname: '/tasks', params: { tab } });
                return (
                  <MemberCard
                    key={parent.id}
                    name={parent.name}
                    avatar={parent.avatar}
                    role="parent"
                    presence={parent.presence}
                    isYou
                    activeTasks={total.active}
                    reviewTasks={total.review}
                    onPress={() => router.dismissTo('/')}
                    onActiveTasksPress={() => openTasks('all')}
                    onReviewTasksPress={() => openTasks('review')}
                  />
                );
              }
              // Второй родитель: только созданные им активные задачи — его
              // задачи на проверке нам не видны.
              return (
                <MemberCard
                  key={parent.id}
                  name={parent.name}
                  avatar={parent.avatar}
                  role="parent"
                  presence={parent.presence}
                  activeTasks={
                    countTasks(tasks, { createdBy: parent.id }).active
                  }
                  onPress={() =>
                    router.push({ pathname: '/parent/[id]', params: { id } })
                  }
                  onActiveTasksPress={() =>
                    router.push({
                      pathname: '/parent/[id]/tasks',
                      params: { id },
                    })
                  }
                />
              );
            })}
          </View>
        </ScreenSection>
        <ScreenSection title={t('family.childrenSection')}>
          <View style={styles.list}>
            {children.map((child) => {
              const id = String(child.id);
              const counts = countTasks(tasks, { assigneeId: child.id });
              const openTasks = (tab: 'all' | 'review') =>
                router.push({
                  pathname: '/child/[id]/tasks',
                  params: { id, tab },
                });
              return (
                <MemberCard
                  key={child.id}
                  name={child.name}
                  avatar={child.avatar}
                  role="child"
                  presence={child.presence}
                  activeTasks={counts.active}
                  reviewTasks={counts.review}
                  onPress={() =>
                    router.push({ pathname: '/child/[id]', params: { id } })
                  }
                  onActiveTasksPress={() => openTasks('all')}
                  onReviewTasksPress={() => openTasks('review')}
                />
              );
            })}
          </View>
        </ScreenSection>
      </ScrollView>
    </TabScreen>
  );
}
