import { View } from 'react-native';
import { Text } from '@app/components/ui/text';
import { StatusBar } from 'expo-status-bar';
import { styles } from '@widgets/task-short-view/ui/task-short-view.styled';
import { TaskShortViewProps } from '@shared/lib';
import { RewardButton } from '@app/components/ui/trophy';
import { Icon } from '@shared/ui/icons/icon';
import React from 'react';

export function TaskShortView(props: TaskShortViewProps) {
  const { title, description } = props;
  return (
    <View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Icon name="сheque" size={30} color="blue" />
          </View>
          <Text variant={'large'}>{title || 'Название задачи'}</Text>
        </View>
        <Text variant={'small'} className={'text-gray-400'}>
          {description || 'Описание задачи'}
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
