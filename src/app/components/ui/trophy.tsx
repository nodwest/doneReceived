import { Pressable, View } from 'react-native';
import { Text } from '@app/components/ui/text';
import { GiftIcon } from '@shared/ui/icons/prize';

type RewardButtonProps = {
  amount: number;
  onPress?: () => void;
};

export function RewardButton({ amount, onPress }: RewardButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-xl bg-green-100 px-4 py-3 shadow-sm"
    >
      <View className="w-10 h-10 rounded-full items-center justify-center bg-green-300">
        <GiftIcon size={30} color="#008000" />
      </View>
      <View className="gap-1">
        <Text className="text-[13px] text-[#555]">Награда</Text>
        <Text className="text-[18px] font-semibold text-green-400">
          {amount}
        </Text>
      </View>
    </Pressable>
  );
}

export { RewardButton };
