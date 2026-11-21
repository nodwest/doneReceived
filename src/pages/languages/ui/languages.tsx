import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import {
  useWordsReward,
  WordsCheck,
  WordsRewardSetup,
  WordsState,
} from '@features/english-words';
import { useFamilyTasks, useTaskFamilyId } from '@features/family-tasks';
import { useFamilyChildren } from '@entities/family';
import type { Task } from '@entities/task';
import {
  parseWordsRange,
  WORDS_PER_DAY,
  WORDS_REWARD,
  wordsOfTask,
} from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { showToast, useIsCompact } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { GradientButton, RoundButton } from '@shared/ui';
import { ChildWordsCard } from './child-words-card';
import { LanguagesHeader } from './languages-header';
import { styles } from './languages.styled';

const NO_TASKS: Task[] = [];

/**
 * Вкладка «Языки» у родителя: у каждого ребёнка — сколько слов выучено, что
 * он учит сейчас и кнопка «Выдать слова» или «Проверить слова».
 * `?check=<id назначения>` — сразу проверка этих слов (из Tasks to review).
 */
export function LanguagesPage() {
  const { check } = useLocalSearchParams<{ check?: string }>();
  return check ? <CheckScreen taskId={check} /> : <Overview />;
}

function Overview() {
  useTheme();
  const { t } = useTranslation();
  const gutter = useIsCompact() ? 16 : 24;
  const familyId = useTaskFamilyId();
  const { data: children, isPending: childrenPending } =
    useFamilyChildren(familyId);
  const { data: tasks = NO_TASKS, isPending: tasksPending } = useFamilyTasks();
  const loading = !familyId || childrenPending || tasksPending;
  // Награда за сданный день: при первом входе родитель выбирает её, потом
  // меняет карандашом в шапке (со следующей порции слов).
  const { reward, setReward } = useWordsReward(familyId);
  const [editing, setEditing] = useState(false);
  const choosing = familyId !== null && (reward === null || editing);

  return (
    <TabScreen activeKey="languages">
      <ScrollView
        contentContainerStyle={[styles.body, { paddingHorizontal: gutter }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <LanguagesHeader
          tone="parent"
          action={
            reward !== null && !editing ? (
              <RoundButton
                icon="pencil"
                accessibilityLabel={t('words.reward.edit')}
                onPress={() => setEditing(true)}
              />
            ) : null
          }
        />
        {choosing ? (
          <WordsRewardSetup
            initial={reward}
            onSave={(value) => {
              setReward(value);
              setEditing(false);
              if (reward !== null) {
                showToast(t('words.reward.saved', { amount: `$${value}` }));
              }
            }}
            onCancel={reward !== null ? () => setEditing(false) : undefined}
          />
        ) : (
          <Text style={styles.hint}>
            {t('words.parent.hint', {
              count: WORDS_PER_DAY,
              amount: `$${reward ?? WORDS_REWARD}`,
            })}
          </Text>
        )}
        {choosing ? null : loading ? (
          <ActivityIndicator
            style={styles.loading}
            color={theme.colors.parentInk}
          />
        ) : !children?.length ? (
          <Text style={styles.empty}>{t('words.parent.noChildren')}</Text>
        ) : (
          children.map((child) => (
            <ChildWordsCard
              key={child.id}
              child={child}
              familyId={familyId}
              tasks={tasks}
            />
          ))
        )}
      </ScrollView>
    </TabScreen>
  );
}

/**
 * Проверка слов одного задания на весь экран, без навбара. Задание
 * запоминается при открытии: после выплаты оно уходит из списка, а экран
 * итога должен остаться.
 */
function CheckScreen({ taskId }: { taskId: string }) {
  useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const gutter = useIsCompact() ? 16 : 24;
  const { data: tasks, isPending } = useFamilyTasks();
  const [task, setTask] = useState<Task | null>(null);
  const found = tasks?.find(
    (item) =>
      item.id === taskId &&
      item.status === 'review' &&
      parseWordsRange(item.title) !== null,
  );
  if (!task && found) setTask(found);

  const close = () =>
    router.canGoBack() ? router.back() : router.replace('/languages');

  return (
    <TabScreen activeKey="languages" navHidden>
      <View style={[styles.checkScreen, { paddingHorizontal: gutter }]}>
        {task ? (
          <WordsCheck
            task={task}
            words={wordsOfTask(task.title, task.checklist)}
            onClose={close}
          />
        ) : isPending ? (
          <ActivityIndicator
            style={styles.loading}
            color={theme.colors.parentInk}
          />
        ) : (
          <WordsState
            icon="badge-check"
            tone="parent"
            title={t('words.parent.checkGone')}
          >
            <GradientButton label={t('words.check.done')} onPress={close} />
          </WordsState>
        )}
      </View>
    </TabScreen>
  );
}
