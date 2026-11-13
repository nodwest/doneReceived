import { useMemo, useState, type ComponentProps } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  DoneButton,
  TaskFooterAction,
  useNoteDraft,
  usePhotoDraft,
  useTaskActions,
} from '@features/complete-task';
import { BottomNav } from '@widgets/bottom-nav';
import { TaskCarousel } from '@widgets/task-carousel';
import {
  TasksHeader,
  type TasksTab,
  type TasksView,
} from '@widgets/tasks-header';
import {
  useChildTasks,
  useMyChildBalance,
  useMyWishlistOwner,
} from '@features/family-tasks';
import {
  ChildReviewRow,
  ChildTaskCard,
  ChildTaskTile,
  sortTasksByUrgency,
  type Task,
} from '@entities/task';
import { useWishlistProgress } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { useIsCompact } from '@shared/lib';
import { EarnGoalCard } from './earn-goal-card';
import { SectionHead } from './section-head';
import { CARDS_PADDING_BOTTOM, styles } from './my-tasks.styled';

const NO_TASKS: Task[] = [];

/**
 * Кто дал задание: имя из участников семьи (без фото — буква), не знаем —
 * просто «Родитель».
 */
const authorOf = (task: Task, parentLabel: string) => ({
  name: task.authorName ?? parentLabel,
  avatar: null,
});

/**
 * Карточка ребёнка с полем комментария: черновик живёт в сторе, чтобы его
 * отправила и I did it! из плитки списка.
 */
function MyTaskCard(
  props: Omit<ComponentProps<typeof ChildTaskCard>, 'note' | 'photos'>,
) {
  const note = useNoteDraft(props.task.id);
  const photos = usePhotoDraft(props.task.id);
  return <ChildTaskCard {...props} note={note} photos={photos} />;
}

/**
 * Вкладка Tasks у ребёнка (Emma, временный режим ребёнка). Списком: сверху
 * «You can earn» — сколько принесут активные задания и насколько приблизят
 * текущее желание, дальше разделы To do (плитки с I did it!) и On review
 * (кто проверяет и сколько придёт). Тап открывает карточку: внизу карточки
 * I did it! отправляет на проверку, Redo task возвращает в активные.
 * `?tab=review` открывает вкладку проверки, `?task=<id>` — сразу карточку.
 */
export function MyTasksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string; task?: string }>();
  const { data = NO_TASKS, isPending } = useChildTasks();
  // Шаги чеклиста отмечаются тапом прямо в карточке.
  const { toggleStep } = useTaskActions();
  // Порядок как в списке: активные по сроку, затем на проверке — карточки
  // листаются в том же порядке.
  const allTasks = useMemo(() => sortTasksByUrgency(data), [data]);
  const activeTasks = useMemo(
    () => allTasks.filter((task) => task.status === 'active'),
    [allTasks],
  );
  const reviewTasks = useMemo(
    () => allTasks.filter((task) => task.status === 'review'),
    [allTasks],
  );
  // Баланс — из кошелька ребёнка: после подтверждения задания он растёт.
  const { balance } = useMyChildBalance();
  const { current: currentWish } = useWishlistProgress(
    useMyWishlistOwner(),
    balance,
  );
  const { bottom } = useSafeAreaInsets();
  const gutter = useIsCompact() ? 16 : 24;
  const initialTaskId = params.task ?? null;
  const [tab, setTab] = useState<TasksTab>(
    params.tab === 'review' ? 'review' : 'all',
  );
  // С главной по заданию — сразу его карточка, иначе список.
  const [view, setView] = useState<TasksView>(
    initialTaskId === null ? 'list' : 'cards',
  );
  // У каждой вкладки своя карточка: возвращаясь тоглом, видим ту, с которой ушли.
  const [currentIds, setCurrentIds] = useState<Record<TasksTab, string | null>>(
    { all: initialTaskId, review: null },
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
  // Список уже был на экране: назад из карточек ведёт к нему. Открыли сразу
  // карточку (с главной) — назад туда, откуда пришли.
  const [listSeen, setListSeen] = useState(initialTaskId === null);
  if (view === 'list' && !listSeen) setListSeen(true);
  const earn = activeTasks.reduce((sum, task) => sum + task.reward, 0);

  const openCard = (task: Task) => {
    setCurrentId(task.id);
    setView('cards');
  };

  const reviewSection = reviewTasks.length > 0 && (
    <View style={styles.section}>
      <SectionHead
        tone="review"
        title={t('tasks.onReview')}
        count={reviewTasks.length}
        hint={t('myTasks.waitingParent')}
      />
      {reviewTasks.map((task) => (
        <ChildReviewRow
          key={task.id}
          task={task}
          author={authorOf(task, t('member.parent'))}
          onPress={openCard}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ paddingHorizontal: gutter }}>
          <TasksHeader
            tone="child"
            tab={tab}
            onTabChange={setTab}
            reviewCount={reviewTasks.length}
            // Иконка — по тому, что на экране: без заданий карточек нет,
            // даже если до этого смотрели карточками.
            view={cards ? 'cards' : 'list'}
            onToggleView={() => setView(cards ? 'list' : 'cards')}
            onBack={() =>
              cards && listSeen
                ? setView('list')
                : router.canGoBack()
                  ? router.back()
                  : router.replace('/')
            }
          />
        </View>
        {cards ? (
          // Карточки во всю высоту: кнопка внутри карточки, навбара нет.
          <View
            style={[
              styles.cards,
              { paddingBottom: Math.max(bottom, CARDS_PADDING_BOTTOM) },
            ]}
          >
            <TaskCarousel
              fullWidth
              tone="child"
              tasks={tasks}
              initialIndex={currentIndex}
              onIndexChange={(index) => setCurrentId(tasks[index].id)}
              renderTask={(task, style) => (
                <MyTaskCard
                  task={task}
                  author={authorOf(task, t('member.parent'))}
                  onToggleStep={(item) => toggleStep(task, item)}
                  footer={<TaskFooterAction task={task} />}
                  style={style}
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
                <Text style={styles.empty}>
                  {tab === 'review'
                    ? t('tasks.emptyReview')
                    : t('tasks.emptyAll')}
                </Text>
              ) : tab === 'review' ? (
                reviewSection
              ) : (
                <>
                  {earn > 0 && (
                    <EarnGoalCard
                      earn={earn}
                      count={activeTasks.length}
                      goal={
                        currentWish && {
                          title: currentWish.wish.title,
                          saved: currentWish.saved,
                          price: currentWish.wish.price,
                        }
                      }
                    />
                  )}
                  {activeTasks.length > 0 && (
                    <View style={styles.section}>
                      <SectionHead
                        tone="child"
                        title={t('myTasks.toDo')}
                        count={activeTasks.length}
                        hint={t('myTasks.soonestFirst')}
                      />
                      {activeTasks.map((task) => (
                        <ChildTaskTile
                          key={task.id}
                          task={task}
                          author={authorOf(task, t('member.parent'))}
                          onPress={openCard}
                          action={<DoneButton task={task} />}
                        />
                      ))}
                    </View>
                  )}
                  {reviewSection}
                </>
              )}
            </ScrollView>
            <BottomNav activeKey="tasks" />
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
