import { Text, View } from 'react-native';
import { Icon } from '@shared/ui';
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
          <Text style={styles.title}>{title || 'Название задачи'}</Text>
        </View>
        <Text style={styles.description}>
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
