import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskForm } from '@features/create-task';
import type { UpdateTaskPayload } from '@entities/task';
import { RoundButton } from '@shared/ui';
import { showToast, useIsCompact } from '@shared/lib';
import { childrenMock, rewardPresetsMock } from '@shared/mocks';
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
  const router = useRouter();
  const gutter = useIsCompact() ? 16 : 24;

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
            accessibilityLabel="Close"
            onPress={close}
          />
        </View>
        <CreateTaskForm
          assignees={childrenMock}
          rewardPresets={rewardPresetsMock}
          task={task}
          onSubmitted={handleSubmitted}
        />
      </SafeAreaView>
    </View>
  );
}
