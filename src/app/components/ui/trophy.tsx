import React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '@app/components/ui/text';
import { Icon } from '@shared/ui/icons/icon';

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

  const containerBase =
    'flex-row items-center gap-3 rounded-xl px-4 py-3 shadow-sm w-[130]';
  const containerVariant = isReward ? 'bg-green-100' : 'bg-red-100';
  const containerClasses = `${containerBase} ${containerVariant}`;

  const circleBase = 'w-10 h-10 rounded-full items-center justify-center';
  const circleVariant = isReward ? 'bg-green-300' : 'bg-red-300';
  const circleClasses = `${circleBase} ${circleVariant}`;

  const labelText = isReward ? 'Награда' : 'Штраф';

  const amountClasses = isReward
    ? 'text-[18px] font-semibold text-green-400'
    : 'text-[18px] font-semibold text-red-400';

  const defaultIcon = isReward ? (
    <Icon name="price" size={35} color="green" />
  ) : (
    <Icon name="penalty" size={31} color="red" />
  );

  return (
    <Pressable onPress={onPress} className={containerClasses}>
      <View className={circleClasses}>{icon ?? defaultIcon}</View>

      <View className="gap-1">
        <Text className="text-[13px] text-[#555]">{labelText}</Text>
        <Text className={amountClasses}>{amount}</Text>
      </View>
    </Pressable>
  );
}
