import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskForm } from '@features/create-task';
import {
  reservedRewards,
  useTasks,
  type UpdateTaskPayload,
} from '@entities/task';
import { useWallet } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { RoundButton } from '@shared/ui';
import { showToast, useIsCompact } from '@shared/lib';
import { childrenMock, parentMock, rewardPresetsMock } from '@shared/mocks';
import { styles } from './create-task.styled';

type TaskFormScreenProps = {
  title: string;
  /** Тост после успешной отправки. */
  successMessage: string;
  task?: UpdateTaskPayload;
};

/** Модальный экран с формой задачи: создание и редактирование. */
export function TaskFormScreen({
  title,
  successMessage,
  task,
}: TaskFormScreenProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const gutter = useIsCompact() ? 16 : 24;
  // Деньги родителя: кошелёк и резерв за его невыплаченные задания. Пока
  // на моках ($1000); с API — GET /families/:id/wallet.
  const { data: wallet } = useWallet();
  const { data: tasks } = useTasks();
  const funds =
    wallet && tasks
      ? {
          total: wallet.balance,
          reserved: reservedRewards(tasks, parentMock.id),
        }
      : undefined;

  // При открытии экрана напрямую (перезагрузка, deep link) истории нет.
  const close = () =>
    router.canGoBack() ? router.back() : router.replace('/');

  const handleSubmitted = () => {
    showToast(successMessage);
    close();
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: gutter }]}>
          {/* Пустышка слева держит заголовок по центру: справа стоит кнопка закрытия. */}
          <View style={styles.spacer} />
          <Text style={styles.title}>{title}</Text>
          <RoundButton
            icon="close"
            accessibilityLabel={t('common.close')}
            onPress={close}
          />
        </View>
        <CreateTaskForm
          assignees={childrenMock}
          rewardPresets={rewardPresetsMock}
          task={task}
          funds={funds}
          onSubmitted={handleSubmitted}
        />
      </SafeAreaView>
    </View>
  );
}
