import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from '@app/components/ui/text';
import { styles } from '@widgets/task-short-view/ui/task-short-view.styled';
import { TaskShortViewProps } from '@shared/lib';
import { RewardButton } from '@app/components/ui/trophy';
import { Icon } from '@shared/ui/icons/icon';

export function TaskShortView({
  taskName,
  taskDescription,
  autor,
}: TaskShortViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>{taskName || 'Название задачи'}</Text>
        <Text>{taskDescription || 'Описание задачи'}</Text>
        <Text>{autor || 1}</Text>
        <StatusBar style="auto" />
        <View style={styles.reward}>
          <RewardButton amount={100} variant="reward" />
          <RewardButton amount={200} variant="penalty" />
        </View>
      </View>
    </View>
  );
}
