import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { CancelTaskButton } from '@features/cancel-task';
import { ReviewActions } from '@features/review-task';
import { BottomNav } from '@widgets/bottom-nav';
import { TaskCarousel } from '@widgets/task-carousel';
import { TaskList } from '@widgets/task-list';
import {
  TasksHeader,
  type TasksTab,
  type TasksView,
} from '@widgets/tasks-header';
import { useFamilyTasks } from '@features/family-tasks';
import { filterTasks, TaskCard, type Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { CardButton } from '@shared/ui';
import { useIsCompact } from '@shared/lib';
import { childrenMock, parentMock, parentProfilesMock } from '@shared/mocks';
import { CARDS_PADDING_BOTTOM, styles } from './tasks.styled';
import { ViewOnlyNote } from './view-only-note';

const NO_TASKS: Task[] = [];

// Имя автора чужого задания; автор с сервера не из моков — пусто.
const findParentName = (id: string) =>
  parentProfilesMock.find((parent) => String(parent.id) === id)?.name ?? '';

/**
 * Чей список: all — вкладка Tasks, задачи всех детей; child — задачи ребёнка
 * (/child/[id]/tasks); parent — активные задачи, созданные родителем
 * (/parent/[id]/tasks).
 */
type TasksScope = 'all' | 'child' | 'parent';

/**
 * Экран заданий. Из профиля ребёнка или родителя — только его задачи: в шапке
 * аватар и «Emma's tasks», «назад» возвращает в профиль, в навбаре подсвечен
 * Family. У родителя нет вкладки Review — показываем только активные.
 */
export function TasksPage({ scope = 'all' }: { scope?: TasksScope }) {
  const { t } = useTranslation();
  const router = useRouter();
  // Плитка Tasks to Review открывает экран сразу на вкладке проверки.
  const { tab: initialTab, id: ownerId } = useLocalSearchParams<{
    tab?: string;
    id?: string;
  }>();
  const owner =
    scope === 'child'
      ? childrenMock.find((child) => String(child.id) === ownerId)
      : scope === 'parent'
        ? parentProfilesMock.find((parent) => String(parent.id) === ownerId)
        : undefined;
  // Список из кэша React Query: после создания или правки он перечитывается сам.
  const { data = NO_TASKS, isPending } = useFamilyTasks();
  // Вкладка Tasks — только задания вошедшего родителя: их он проверяет,
  // выплачивает и правит. Задания второго родителя видны из его профиля
  // (scope parent), а в профиле ребёнка (scope child) — все его задания от
  // обоих родителей; чужие — без кнопок, чтобы знать, что уже задано, и не
  // повторять.
  const allTasks = useMemo(() => {
    if (!owner) return filterTasks(data, { createdBy: String(parentMock.id) });
    return scope === 'parent'
      ? filterTasks(data, { createdBy: String(owner.id) }).filter(
          (task) => task.status === 'active',
        )
      : filterTasks(data, { assigneeId: String(owner.id) });
  }, [data, scope, owner]);
  // На проверке — только то, что может проверить вошедший родитель.
  const reviewTasks = useMemo(
    () =>
      allTasks.filter(
        (task) =>
          task.status === 'review' && task.createdBy === String(parentMock.id),
      ),
    [allTasks],
  );
  const { bottom } = useSafeAreaInsets();
  const gutter = useIsCompact() ? 16 : 24;
  const [tab, setTab] = useState<TasksTab>(
    initialTab === 'review' ? 'review' : 'all',
  );
  // Экран открывается списком; карточки — по кнопке вида или тапу по задаче.
  const [view, setView] = useState<TasksView>('list');
  // У каждой вкладки своя карточка: возвращаясь тоглом, видим ту, с которой ушли.
  const [currentIds, setCurrentIds] = useState<Record<TasksTab, string | null>>(
    { all: null, review: null },
  );

  const tasks = tab === 'review' ? reviewTasks : allTasks;
  const currentId = currentIds[tab];
  const setCurrentId = (id: string) =>
    setCurrentIds((prev) => ({ ...prev, [tab]: id }));
  const currentIndex = Math.max(
    tasks.findIndex((task) => task.id === currentId),
    0,
  );
  const cards = view === 'cards' && tasks.length > 0;

  if (scope !== 'all' && !owner) return <Redirect href="/" />;

  const emptyText =
    scope === 'parent' && owner
      ? t('tasks.ownerNoActive', { name: owner.name })
      : owner
        ? tab === 'review'
          ? t('tasks.ownerEmptyReview', { name: owner.name })
          : t('tasks.ownerEmptyAll', { name: owner.name })
        : tab === 'review'
          ? t('tasks.emptyReview')
          : t('tasks.emptyAll');

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ paddingHorizontal: gutter }}>
          <TasksHeader
            tab={tab}
            onTabChange={setTab}
            reviewCount={reviewTasks.length}
            // Иконка — по тому, что на экране: без заданий карточек нет,
            // даже если до этого смотрели карточками.
            view={cards ? 'cards' : 'list'}
            onToggleView={() => setView(cards ? 'list' : 'cards')}
            // Назад из карточек — к списку (экран всегда открывается им);
            // из списка — туда, откуда пришли (главная, Family, профиль), без
            // истории (открыли по ссылке) — на главную.
            onBack={() =>
              cards
                ? setView('list')
                : router.canGoBack()
                  ? router.back()
                  : router.replace('/')
            }
            owner={owner}
            tabs={scope !== 'parent'}
          />
        </View>
        {cards ? (
          // Карточки во всю высоту: кнопки внутри карточки, навбара нет.
          <View
            style={[
              styles.cards,
              { paddingBottom: Math.max(bottom, CARDS_PADDING_BOTTOM) },
            ]}
          >
            <TaskCarousel
              fullWidth
              tasks={tasks}
              initialIndex={currentIndex}
              onIndexChange={(index) => setCurrentId(tasks[index].id)}
              renderTask={(task, style) => (
                <TaskCard
                  task={task}
                  style={style}
                  footer={
                    // Approve выплачивает награду и уводит задание в историю,
                    // Reject возвращает его ребёнку, Cancel task — отменяет.
                    // Всё это — только у автора задания; второй родитель
                    // чужое задание только видит.
                    task.createdBy !== String(parentMock.id) ? (
                      <ViewOnlyNote
                        author={findParentName(task.createdBy)}
                        review={task.status === 'review'}
                      />
                    ) : task.status === 'review' ? (
                      <ReviewActions task={task} />
                    ) : (
                      <>
                        <CancelTaskButton task={task} />
                        <CardButton
                          label={t('tasks.edit')}
                          variant="dark"
                          onPress={() =>
                            router.push({
                              pathname: '/edit-task',
                              params: { id: String(task.id) },
                            })
                          }
                        />
                      </>
                    )
                  }
                />
              )}
            />
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.body}
              showsVerticalScrollIndicator={false}
            >
              {isPending ? null : tasks.length === 0 ? (
                <Text style={styles.empty}>{emptyText}</Text>
              ) : (
                <TaskList
                  tasks={tasks}
                  onSelect={(task) => {
                    setCurrentId(task.id);
                    setView('cards');
                  }}
                />
              )}
            </ScrollView>
            <BottomNav activeKey={owner ? 'family' : 'tasks'} />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}

/** Задачи ребёнка: /child/[id]/tasks. */
export const ChildTasksPage = () => <TasksPage scope="child" />;

/** Активные задачи, созданные родителем: /parent/[id]/tasks. */
export const ParentTasksPage = () => <TasksPage scope="parent" />;
