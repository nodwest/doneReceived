import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ReviewActions } from '@features/review-task';
import { BottomNav } from '@widgets/bottom-nav';
import { TaskCarousel } from '@widgets/task-carousel';
import { TaskList } from '@widgets/task-list';
import {
  TasksHeader,
  type TasksTab,
  type TasksView,
} from '@widgets/tasks-header';
import { useTasks, type Task } from '@entities/task';
import { PillButton } from '@shared/ui';
import { showToast, useIsCompact } from '@shared/lib';
import { FOOTER_PADDING_VERTICAL, styles } from './tasks.styled';

const NO_TASKS: Task[] = [];

export function TasksPage() {
  const router = useRouter();
  // Список из кэша React Query: после создания или правки он перечитывается сам.
  const { data: allTasks = NO_TASKS, isPending } = useTasks();
  const reviewTasks = useMemo(
    () => allTasks.filter((task) => task.status === 'review'),
    [allTasks],
  );
  const { bottom } = useSafeAreaInsets();
  const gutter = useIsCompact() ? 16 : 24;
  // Плитка Tasks to Review на главной открывает экран сразу на вкладке проверки.
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<TasksTab>(
    initialTab === 'review' ? 'review' : 'all',
  );
  // Экран открывается списком; карточки — по кнопке вида или тапу по задаче.
  const [view, setView] = useState<TasksView>('list');
  // У каждой вкладки своя карточка: возвращаясь тоглом, видим ту, с которой ушли.
  const [currentIds, setCurrentIds] = useState<Record<TasksTab, number | null>>(
    { all: null, review: null },
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

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ paddingHorizontal: gutter }}>
          <TasksHeader
            tab={tab}
            onTabChange={setTab}
            reviewCount={reviewTasks.length}
            view={view}
            onToggleView={() =>
              setView((prev) => (prev === 'cards' ? 'list' : 'cards'))
            }
            onBack={() => router.replace('/')}
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
              {tab === 'review' ? 'No tasks to review' : 'No tasks yet'}
            </Text>
          ) : view === 'cards' ? (
            <TaskCarousel
              tasks={tasks}
              initialIndex={currentIndex}
              onIndexChange={(index) => setCurrentId(tasks[index].id)}
            />
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
            {/* Кнопки пока заглушки: показывают тост, задачи и бейдж не меняются. */}
            {current.status === 'review' ? (
              <ReviewActions
                childName={current.assignee.name}
                onApprove={() => showToast('Task approved')}
                onReject={() => showToast('Task rejected')}
              />
            ) : (
              <>
                <PillButton
                  label="Cancel task"
                  variant="outline"
                  onPress={() => showToast('Task cancelled')}
                />
                <PillButton
                  label="Edit"
                  variant="dark"
                  onPress={() =>
                    router.push({
                      pathname: '/edit-task',
                      params: { id: String(current.id) },
                    })
                  }
                />
              </>
            )}
          </View>
        ) : (
          <BottomNav activeKey="tasks" />
        )}
      </SafeAreaView>
    </View>
  );
}
