import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DoneButton, TaskFooterAction } from '@features/complete-task';
import { BottomNav } from '@widgets/bottom-nav';
import { TaskCarousel } from '@widgets/task-carousel';
import { TaskList } from '@widgets/task-list';
import {
  TasksHeader,
  type TasksTab,
  type TasksView,
} from '@widgets/tasks-header';
import {
  ChildTaskCard,
  ChildTaskRow,
  filterTasks,
  useTasks,
  type Task,
} from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { showToast, useIsCompact } from '@shared/lib';
import { childAccountMock, parentProfilesMock } from '@shared/mocks';
import { FOOTER_PADDING_VERTICAL, styles } from './my-tasks.styled';

const NO_TASKS: Task[] = [];

// Автор задания для «Task from Sarah»; неизвестный — первый родитель.
const findAuthor = (id: number) =>
  parentProfilesMock.find((parent) => parent.id === id) ??
  parentProfilesMock[0];

/**
 * Вкладка Tasks у ребёнка (Emma, временный режим ребёнка): его задания
 * списком или карточками, вкладки All / On review. В списке у активного —
 * I did it!, у задания на проверке — «Waiting for approval…». Тап по строке
 * открывает карточку; в футере карточки I did it! отправляет на проверку,
 * «Переделать» возвращает в активные. `?tab=review` открывает вкладку
 * проверки, `?task=<id>` — сразу карточку задания.
 */
export function MyTasksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string; task?: string }>();
  const { data = NO_TASKS, isPending } = useTasks();
  const allTasks = useMemo(
    () => filterTasks(data, { assigneeId: childAccountMock.id }),
    [data],
  );
  const reviewTasks = useMemo(
    () => allTasks.filter((task) => task.status === 'review'),
    [allTasks],
  );
  const { bottom } = useSafeAreaInsets();
  const gutter = useIsCompact() ? 16 : 24;
  const initialTaskId = params.task ? Number(params.task) : null;
  const [tab, setTab] = useState<TasksTab>(
    params.tab === 'review' ? 'review' : 'all',
  );
  // С главной по заданию — сразу его карточка, иначе список.
  const [view, setView] = useState<TasksView>(
    initialTaskId === null ? 'list' : 'cards',
  );
  // У каждой вкладки своя карточка: возвращаясь тоглом, видим ту, с которой ушли.
  const [currentIds, setCurrentIds] = useState<Record<TasksTab, number | null>>(
    { all: initialTaskId, review: null },
  );

  const tasks = tab === 'review' ? reviewTasks : allTasks;
  const currentId = currentIds[tab];
  const setCurrentId = (id: number) =>
    setCurrentIds((prev) => ({ ...prev, [tab]: id }));
  const currentIndex = Math.max(
    tasks.findIndex((task) => task.id === currentId),
    0,
  );
  const current: Task | undefined = tasks[currentIndex];
  const showFooter = view === 'cards' && current;

  const openCard = (task: Task) => {
    setCurrentId(task.id);
    setView('cards');
  };
  const photoStub = () => showToast(t('taskCard.photoSoon'));

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ paddingHorizontal: gutter }}>
          <TasksHeader
            tone="child"
            tab={tab}
            onTabChange={setTab}
            reviewCount={reviewTasks.length}
            view={view}
            onToggleView={() =>
              setView((prev) => (prev === 'cards' ? 'list' : 'cards'))
            }
            onBack={() =>
              router.canGoBack() ? router.back() : router.replace('/')
            }
          />
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.body,
            view === 'cards' && styles.bodyCards,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {isPending ? null : tasks.length === 0 ? (
            <Text style={styles.empty}>
              {tab === 'review' ? t('tasks.emptyReview') : t('tasks.emptyAll')}
            </Text>
          ) : view === 'cards' ? (
            <TaskCarousel
              tone="child"
              tasks={tasks}
              initialIndex={currentIndex}
              onIndexChange={(index) => setCurrentId(tasks[index].id)}
              renderTask={(task, style) => (
                <ChildTaskCard
                  task={task}
                  author={findAuthor(task.createdBy)}
                  onTakePhoto={photoStub}
                  onPickPhoto={photoStub}
                  style={style}
                />
              )}
            />
          ) : (
            <TaskList
              tasks={tasks}
              renderTask={(task) => (
                <ChildTaskRow
                  task={task}
                  onPress={openCard}
                  action={<DoneButton task={task} size="sm" />}
                />
              )}
            />
          )}
        </ScrollView>
        {showFooter ? (
          <View
            style={[
              styles.footer,
              {
                paddingHorizontal: gutter,
                paddingBottom: Math.max(bottom, FOOTER_PADDING_VERTICAL),
              },
            ]}
          >
            <TaskFooterAction task={current} />
          </View>
        ) : (
          <BottomNav activeKey="tasks" />
        )}
      </SafeAreaView>
    </View>
  );
}
