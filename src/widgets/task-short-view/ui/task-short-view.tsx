import { View } from 'react-native';
import { ButtonText, Icon } from '@shared/ui';
import { StatusBar } from 'expo-status-bar';
import { styles } from './task-short-view.styled';
import type { TaskShortViewProps } from '@entities/task';
import { RewardButton } from '@entities/task';
import React from 'react';

export function TaskShortView(props: TaskShortViewProps) {
  const { title, description } = props;

  return (
    <View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Icon name="cheque" size={30} color="blue" />
          </View>
          <ButtonText variant={'large'}>
            {title || 'Название задачи'}
          </ButtonText>
        </View>
        <ButtonText variant={'small'} className={'text-gray-400'}>
          {description || 'Описание задачи'}
        </ButtonText>
        <StatusBar style="auto" />
        <View style={styles.reward}>
          <RewardButton amount={100} variant="reward" />
          <RewardButton amount={200} variant="penalty" />
        </View>
      </View>
    </View>
  );
}
