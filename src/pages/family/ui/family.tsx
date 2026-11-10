import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AddMember } from '@widgets/add-member';
import { TabScreen } from '@widgets/bottom-nav';
import { ChildDevices } from '@widgets/child-devices';
import { useDeleteChild } from '@features/delete-child';
import { useFamilyTasks } from '@features/family-tasks';
import { useMockDevices, type Device } from '@entities/device';
import {
  useCurrentFamily,
  useFamilyChildren,
  useInviteCodes,
  type FamilyChild,
} from '@entities/family';
import { isApiError } from '@shared/api';
import { countChildTasks, countTasks, type Task } from '@entities/task';
import { MemberCard, useViewerRole } from '@entities/user';
import {
  childProfilesMock,
  parentMock,
  parentProfilesMock,
} from '@shared/mocks';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, ScreenSection, SwipeableRow } from '@shared/ui';
import { DELETE_ACTION_WIDTH, REVEAL_GAP, styles } from './family.styled';

const NO_TASKS: Task[] = [];
const NO_DEVICES: Device[] = [];
const NO_CHILDREN: FamilyChild[] = [];

/**
 * Вкладка Family: кнопка приглашения и карточки родителей и детей. Тап по
 * карточке открывает профиль, по чипу задач — его задачи. Карточка «You»
 * (владелец аккаунта) ведёт на главную и вкладку Tasks. Родитель внизу
 * карточек детей видит их устройства и подключает новые кодом. Emma и Liam
 * пока моки; за ними — дети семьи с сервера (Add a child): их устройства,
 * код подключения и отключение настоящие, родитель удаляет профиль,
 * смахнув карточку влево.
 */
export function FamilyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  // Счётчики — из того же списка задач, что на главной и в профилях.
  const { data: tasks = NO_TASKS } = useFamilyTasks();
  const { data: codes } = useInviteCodes();
  const { data: devices = NO_DEVICES } = useMockDevices();
  const familyId = useCurrentFamily()?.id ?? null;
  const { data: newChildren = NO_CHILDREN } = useFamilyChildren(familyId);
  const deleteChild = useDeleteChild();
  const isParent = useViewerRole() === 'parent';
  // Открытая смахиванием карточка: одновременно — только одна.
  const [swipedId, setSwipedId] = useState<string | null>(null);
  // Раскрытые устройства: одновременно — только у одного ребёнка.
  const [devicesOpenId, setDevicesOpenId] = useState<string | null>(null);
  const viewportRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const parents = parentProfilesMock;
  const children = childProfilesMock;
  const childrenCount = children.length + newChildren.length;

  const devicesOf = (childId: string) =>
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

  // familyId — у ребёнка с сервера, null — у мокового (его устройства
  // передаём сами).
  const devicesFooter = (
    childFamilyId: string | null,
    childId: string,
    childName: string,
  ) =>
    isParent && (
      <ChildDevices
        familyId={childFamilyId}
        childId={childId}
        childName={childName}
        mockDevices={childFamilyId ? undefined : devicesOf(childId)}
        expanded={devicesOpenId === childId}
        onExpandedChange={(open) => setDevicesOpenId(open ? childId : null)}
        onReveal={revealDevices}
      />
    );

  // Сервер не удалит ребёнка с деньгами на счету или открытыми заданиями.
  const removeChild = (child: FamilyChild) => {
    setSwipedId(null);
    deleteChild.mutate(child.id, {
      onSuccess: () =>
        showToast(t('family.childDeleted', { name: child.displayName })),
      onError: (error) => {
        const code =
          isApiError(error) && error.data && typeof error.data === 'object'
            ? (error.data as { code?: unknown }).code
            : null;
        showToast(
          code === 'CHILD_BALANCE_NOT_ZERO'
            ? t('family.deleteHasBalance', { name: child.displayName })
            : code === 'CHILD_HAS_TASKS'
              ? t('family.deleteHasTasks', { name: child.displayName })
              : t('family.deleteFailed'),
        );
      },
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
                  const total = countTasks(tasks, {
                    createdBy: String(parentMock.id),
                  });
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
                      countTasks(tasks, { createdBy: String(parent.id) }).active
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
                // Активные — все задания ребёнка, на проверке — только свои.
                const counts = countChildTasks(
                  tasks,
                  String(child.id),
                  String(parentMock.id),
                );
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
                    footer={devicesFooter(null, id, child.name)}
                  />
                );
              })}
              {newChildren.map((child) => {
                const card = (
                  <MemberCard
                    name={child.displayName}
                    avatar={
                      child.avatarUrl ? { uri: child.avatarUrl } : undefined
                    }
                    role="child"
                    subtitle={t('member.childProfile')}
                    footer={devicesFooter(
                      familyId,
                      child.id,
                      child.displayName,
                    )}
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
                          name: child.displayName,
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
