import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@shared/ui';
import { styles } from './reward-button.styled';

type RewardVariant = 'reward' | 'penalty';

type RewardButtonProps = {
  amount: number;
  variant?: RewardVariant;
  onPress?: () => void;
  icon?: React.ReactNode;
};

export function RewardButton({
  amount,
  variant = 'reward',
  onPress,
  icon,
}: RewardButtonProps) {
  const isReward = variant === 'reward';

  const labelText = isReward ? 'Награда' : 'Штраф';

  const defaultIcon = isReward ? (
    <Icon name="price" size={35} color="green" />
  ) : (
    <Icon name="penalty" size={31} color="red" />
  );

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        isReward ? styles.containerReward : styles.containerPenalty,
      ]}
    >
      <View
        style={[
          styles.circle,
          isReward ? styles.circleReward : styles.circlePenalty,
        ]}
      >
        {icon ?? defaultIcon}
      </View>

      <View style={styles.texts}>
        <Text style={styles.label}>{labelText}</Text>
        <Text
          style={[
            styles.amount,
            isReward ? styles.amountReward : styles.amountPenalty,
          ]}
        >
          {amount}
        </Text>
      </View>
    </Pressable>
  );
}
