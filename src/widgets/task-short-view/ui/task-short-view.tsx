import { Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@app/components/ui/button';
import { Text } from '@app/components/ui/text';
import { styles } from '@widgets/task-short-view/ui/task-short-view.styled';
import { TaskShortViewProps } from '@shared/lib';
import { RewardButton } from '@app/components/ui/trophy';

export function TaskShortView({
  taskName,
  taskDescription,
  taskAward,
  taskPenalty,
  autor,
}: TaskShortViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>{taskName || 'Название задачи'}</Text>
        <Text>{taskDescription || 'Описание задачи'}</Text>
        <Text>{autor || 1}</Text>
        <StatusBar style="auto" />
        <RewardButton />
      </View>
    </View>
  );
}
