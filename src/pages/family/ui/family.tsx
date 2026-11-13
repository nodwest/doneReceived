import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AddMember } from '@widgets/add-member';
import { TabScreen } from '@widgets/bottom-nav';
import { ChildDevices } from '@widgets/child-devices';
import { useDeleteChild } from '@features/delete-child';
import { useFamilyTasks } from '@features/family-tasks';
import { TransferOwnershipButton } from '@features/transfer-ownership';
import {
  useCurrentFamily,
  useFamilyDetails,
  useFamilyMembers,
  type FamilyChildDetails,
  type FamilyMember,
} from '@entities/family';
import { useMyId, useSessionUser } from '@entities/session';
import { countChildTasks, countTasks, type Task } from '@entities/task';
import { MemberCard } from '@entities/user';
import { formatMoney } from '@entities/wallet';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, ScreenSection, SwipeableRow } from '@shared/ui';
import { DELETE_ACTION_WIDTH, REVEAL_GAP, styles } from './family.styled';

const NO_TASKS: Task[] = [];
const NO_MEMBERS: FamilyMember[] = [];

/** Фото с сервера; без него — буква имени в карточке. */
const photo = (url: string | null) => (url ? { uri: url } : undefined);

/**
 * Вкладка Family. Родитель видит семью целиком (GET /families/:id): кнопки
 * приглашения, родителей с ролями и детей с балансом. Тап по карточке —
 * профиль, по чипу задач — его задачи; карточка «You» ведёт на главную и
 * вкладку Tasks. Внизу карточки ребёнка — его устройства и код подключения,
 * смахивание влево удаляет профиль; владелец может передать семью второму
 * родителю. Ребёнку детали семьи закрыты — он видит участников (только
 * имена).
 */
export function FamilyPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useSessionUser();
  const myId = useMyId();
  const isParent = user?.kind !== 'child';
  // Счётчики — из того же списка заданий, что на главной и в профилях.
  const { data: tasks = NO_TASKS } = useFamilyTasks();
  const family = useCurrentFamily();
  const familyId = family?.id ?? user?.family?.id ?? null;
  const { data: details } = useFamilyDetails(isParent ? familyId : null);
  const { data: members = NO_MEMBERS } = useFamilyMembers(
    isParent ? null : familyId,
  );
  const deleteChild = useDeleteChild();
  const isOwner = details?.myRole === 'owner';
  // Открытая смахиванием карточка: одновременно — только одна.
  const [swipedId, setSwipedId] = useState<string | null>(null);
  // Раскрытые устройства: одновременно — только у одного ребёнка.
  const [devicesOpenId, setDevicesOpenId] = useState<string | null>(null);
  const viewportRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);

  const parentsCount = isParent
    ? (details?.parents.length ?? 0)
    : members.filter((member) => member.kind === 'parent').length;
  const childrenCount = isParent
    ? (details?.children.length ?? 0)
    : members.filter((member) => member.kind === 'child').length;

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

  // Сервер не удалит ребёнка с деньгами на счету или открытыми заданиями.
  const removeChild = (child: FamilyChildDetails) => {
    setSwipedId(null);
    deleteChild.mutate(child.childId, {
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

  const parentCards = isParent
    ? (details?.parents ?? []).map((parent) => {
        // Вошедший: те же цифры, что на главной, карточка — на главную.
        if (parent.userId === myId) {
          const total = countTasks(tasks, { createdBy: myId });
          const openTasks = (tab: 'all' | 'review') =>
            router.push({ pathname: '/tasks', params: { tab } });
          return (
            <MemberCard
              key={parent.memberId}
              name={parent.displayName}
              avatar={photo(parent.avatarUrl)}
              role="parent"
              subtitle={t(`family.role.${parent.role}`)}
              isYou
              activeTasks={total.active}
              reviewTasks={total.review}
              onPress={() => router.dismissTo('/')}
              onActiveTasksPress={() => openTasks('all')}
              onReviewTasksPress={() => openTasks('review')}
            />
          );
        }
        // Второй родитель: только его активные задания — его задания на
        // проверке нам не видны. Владелец может передать ему семью.
        const id = parent.userId;
        return (
          <MemberCard
            key={parent.memberId}
            name={parent.displayName}
            avatar={photo(parent.avatarUrl)}
            role="parent"
            subtitle={t(`family.role.${parent.role}`)}
            activeTasks={countTasks(tasks, { createdBy: id }).active}
            onPress={() =>
              router.push({ pathname: '/parent/[id]', params: { id } })
            }
            onActiveTasksPress={() =>
              router.push({ pathname: '/parent/[id]/tasks', params: { id } })
            }
            footer={
              isOwner && (
                <TransferOwnershipButton
                  familyId={familyId}
                  memberId={parent.memberId}
                  name={parent.displayName}
                />
              )
            }
          />
        );
      })
    : members
        .filter((member) => member.kind === 'parent')
        .map((member) => (
          <MemberCard
            key={member.id}
            name={member.displayName}
            avatar={photo(member.avatarUrl)}
            role="parent"
            subtitle={t(`family.role.${member.role}`)}
          />
        ));

  const childCards = isParent
    ? (details?.children ?? []).map((child) => {
        const id = child.childId;
        // Активные — все задания ребёнка, на проверке — только свои.
        const counts = countChildTasks(tasks, id, myId);
        const openTasks = (tab: 'all' | 'review') =>
          router.push({ pathname: '/child/[id]/tasks', params: { id, tab } });
        return (
          <SwipeableRow
            key={id}
            open={swipedId === id}
            onOpenChange={(open) => setSwipedId(open ? id : null)}
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
                <Icon name="trash" size={20} color={theme.colors.white} />
                <Text style={styles.deleteLabel}>
                  {t('family.deleteChild')}
                </Text>
              </Pressable>,
            ]}
          >
            <MemberCard
              name={child.displayName}
              avatar={photo(child.avatarUrl)}
              role="child"
              subtitle={t('family.childBalance', {
                amount: formatMoney(child.balance),
              })}
              activeTasks={counts.active}
              reviewTasks={counts.review}
              onPress={() =>
                router.push({ pathname: '/child/[id]', params: { id } })
              }
              onActiveTasksPress={() => openTasks('all')}
              onReviewTasksPress={() => openTasks('review')}
              footer={
                <ChildDevices
                  familyId={familyId}
                  childId={id}
                  childName={child.displayName}
                  expanded={devicesOpenId === id}
                  onExpandedChange={(open) =>
                    setDevicesOpenId(open ? id : null)
                  }
                  onReveal={revealDevices}
                />
              }
            />
          </SwipeableRow>
        );
      })
    : members
        .filter((member) => member.kind === 'child')
        .map((member) => (
          <MemberCard
            key={member.id}
            name={member.displayName}
            avatar={photo(member.avatarUrl)}
            role="child"
            isYou={member.userId === myId}
            subtitle={t('member.childProfile')}
          />
        ));

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
              {t('family.parents', { count: parentsCount })} ·{' '}
              {t('family.children', { count: childrenCount })}
            </Text>
          </View>
          {isParent && <AddMember />}
          <ScreenSection title={t('family.parentsSection')}>
            <View style={styles.list}>{parentCards}</View>
          </ScreenSection>
          <ScreenSection title={t('family.childrenSection')}>
            <View style={styles.list}>{childCards}</View>
          </ScreenSection>
        </ScrollView>
      </View>
    </TabScreen>
  );
}
