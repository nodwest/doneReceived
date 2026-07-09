import { View } from 'react-native';
import { Text } from '@app/components/ui/text';
import { StatusBar } from 'expo-status-bar';
import { styles } from '@widgets/task-short-view/ui/task-short-view.styled';
import { TaskShortViewProps } from '@shared/lib';
import { RewardButton } from '@app/components/ui/trophy';
import { Icon } from '@shared/ui/icons/icon';
import React from 'react';

export function TaskShortView(prop: TaskShortViewProps) {
  const { taskName, taskDescription, autor } = prop;

  return (
    <View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View
            className={
              'w-10 h-10 rounded-full items-center justify-center bg-blue-300'
            }
          >
            <Icon name="сheque" size={30} color="blue" />
          </View>
          <Text variant={'large'}>{taskName || 'Название задачи'}</Text>
        </View>
        <Text variant={'small'} className={'text-gray-400'}>
          {taskDescription || 'Описание задачи'}
        </Text>
        <StatusBar style="auto" />
        <View style={styles.reward}>
          <RewardButton amount={100} variant="reward" />
          <RewardButton amount={200} variant="penalty" />
        </View>
      </View>
    </View>
  );
}
