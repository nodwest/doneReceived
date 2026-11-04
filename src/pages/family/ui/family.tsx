import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AddMember } from '@widgets/add-member';
import { TabScreen } from '@widgets/bottom-nav';
import { ChildDevices } from '@widgets/child-devices';
import { useDeleteChild } from '@features/delete-child';
import { useDevices, type Device } from '@entities/device';
import {
  useInviteCodes,
  useNewChildren,
  type NewChild,
} from '@entities/family';
import { countTasks, useTasks, type Task } from '@entities/task';
import { MemberCard, useViewerRole } from '@entities/user';
import {
  childProfilesMock,
  parentMock,
  parentProfilesMock,
} from '@shared/mocks';
import { useTranslation } from '@shared/i18n';
import { formatDayInPhrase, showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, ScreenSection, SwipeableRow } from '@shared/ui';
import { DELETE_ACTION_WIDTH, REVEAL_GAP, styles } from './family.styled';

const NO_TASKS: Task[] = [];
const NO_DEVICES: Device[] = [];
const NO_CHILDREN: NewChild[] = [];

/**
 * Вкладка Family: кнопка приглашения и карточки родителей и детей. Тап по
 * карточке открывает профиль, по чипу задач — его задачи. Карточка «You»
 * (владелец аккаунта) ведёт на главную и вкладку Tasks. Родитель внизу
 * карточек детей видит их устройства и подключает новые кодом. Новые
 * профили детей (созданные Add a child, без устройства) идут в конце
 * списка; родитель удаляет их, смахнув карточку влево.
 */
export function FamilyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  // Счётчики — из того же списка задач, что на главной и в профилях.
  const { data: tasks = NO_TASKS } = useTasks();
  const { data: codes } = useInviteCodes();
  const { data: devices = NO_DEVICES } = useDevices();
  const { data: newChildren = NO_CHILDREN } = useNewChildren();
  const deleteChild = useDeleteChild();
  const isParent = useViewerRole() === 'parent';
  // Открытая смахиванием карточка: одновременно — только одна.
  const [swipedId, setSwipedId] = useState<number | null>(null);
  // Раскрытые устройства: одновременно — только у одного ребёнка.
  const [devicesOpenId, setDevicesOpenId] = useState<number | null>(null);
  const viewportRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const parents = parentProfilesMock;
  const children = childProfilesMock;
  const childrenCount = children.length + newChildren.length;

  const devicesOf = (childId: number) =>
    devices.filter((device) => device.childId === childId);

  // Раскрытый блок устройств уходит под низ экрана — докручиваем, чтобы он
  // был виден целиком, но верх карточки не уезжал за верх экрана.
  const revealDevices = (block: View) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.measureInWindow((_x, top, _w, height) => {
      block.measureInWindow((_bx, blockTop, _bw, blockHeight) => {
        const below = blockTop + blockHeight + REVEAL_GAP - (top + height);
        if (below <= 0) return;
        const room = blockTop - top - REVEAL_GAP;
        scrollRef.current?.scrollTo({
          y: scrollY.current + Math.max(Math.min(below, room), 0),
          animated: true,
        });
      });
    });
  };

  const devicesFooter = (childId: number, childName: string) =>
    isParent && (
      <ChildDevices
        childId={childId}
        childName={childName}
        devices={devicesOf(childId)}
        expanded={devicesOpenId === childId}
        onExpandedChange={(open) => setDevicesOpenId(open ? childId : null)}
        onReveal={revealDevices}
      />
    );

  const removeChild = (child: NewChild) => {
    setSwipedId(null);
    deleteChild.mutate(child.id, {
      onSuccess: () =>
        showToast(t('family.childDeleted', { name: child.name })),
    });
  };

  return (
    <TabScreen activeKey="family">
      <View ref={viewportRef} style={styles.viewport}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(event) => {
            scrollY.current = event.nativeEvent.contentOffset.y;
          }}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t('family.title')}</Text>
            <Text style={styles.count}>
              {t('family.parents', { count: parents.length })} ·{' '}
              {t('family.children', { count: childrenCount })}
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
                    footer={devicesFooter(child.id, child.name)}
                  />
                );
              })}
              {newChildren.map((child) => {
                const card = (
                  <MemberCard
                    name={child.name}
                    role="child"
                    subtitle={t('member.added', {
                      day: formatDayInPhrase(new Date(child.createdAt)),
                    })}
                    footer={devicesFooter(child.id, child.name)}
                  />
                );
                if (!isParent) return <View key={child.id}>{card}</View>;
                return (
                  <SwipeableRow
                    key={child.id}
                    open={swipedId === child.id}
                    onOpenChange={(open) => setSwipedId(open ? child.id : null)}
                    onSwipeStart={() => setSwipedId(null)}
                    actionsWidth={DELETE_ACTION_WIDTH}
                    actions={[
                      <Pressable
                        key="delete"
                        accessibilityRole="button"
                        accessibilityLabel={t('devices.remove', {
                          name: child.name,
                        })}
                        onPress={() => removeChild(child)}
                        style={({ pressed }) => [
                          styles.delete,
                          pressed && styles.pressed,
                        ]}
                      >
                        <Icon
                          name="trash"
                          size={20}
                          color={theme.colors.white}
                        />
                        <Text style={styles.deleteLabel}>
                          {t('family.deleteChild')}
                        </Text>
                      </Pressable>,
                    ]}
                  >
                    {card}
                  </SwipeableRow>
                );
              })}
            </View>
          </ScreenSection>
        </ScrollView>
      </View>
    </TabScreen>
  );
}
