import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateTaskForm } from '@features/create-task';
import { Icon } from '@shared/ui';
import { showToast, useIsCompact } from '@shared/lib';
import { childrenMock, rewardPresetsMock } from '@shared/mocks';
import { theme } from '@shared/theme';
import { styles } from './create-task.styled';

export function CreateTaskPage() {
  const router = useRouter();
  const gutter = useIsCompact() ? 16 : 24;

  // При открытии /create-task напрямую (перезагрузка, deep link) истории нет.
  const close = () =>
    router.canGoBack() ? router.back() : router.replace('/');

  const handleCreated = () => {
    showToast('Task created');
    close();
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header, { paddingHorizontal: gutter }]}>
          {/* Пустышка слева держит заголовок по центру: справа стоит кнопка закрытия. */}
          <View style={styles.spacer} />
          <Text style={styles.title}>Create Task</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={close}
            style={styles.close}
          >
            <Icon name="close" size={22} color={theme.colors.ink} />
          </Pressable>
        </View>
        <CreateTaskForm
          assignees={childrenMock}
          rewardPresets={rewardPresetsMock}
          onCreated={handleCreated}
        />
      </SafeAreaView>
    </View>
  );
}
