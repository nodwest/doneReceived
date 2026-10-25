import { Text, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { Icon } from '@shared/ui';
import { useIsCompact } from '@shared/lib';
import { theme } from '@shared/theme';
import { useCreateTaskStore } from '../model/create-task-store';
import { ChipRow } from './chip-row';
import { FormField } from './form-field';
import { OptionChip } from './option-chip';
import { styles } from './create-task-form.styled';

type RewardInputProps = {
  presets: readonly number[];
};

export function RewardInput({ presets }: RewardInputProps) {
  const { t } = useTranslation();
  const compact = useIsCompact();
  const reward = useCreateTaskStore((state) => state.reward);
  const rewardPreset = useCreateTaskStore((state) => state.rewardPreset);
  const setReward = useCreateTaskStore((state) => state.setReward);
  const pickRewardPreset = useCreateTaskStore(
    (state) => state.pickRewardPreset,
  );

  return (
    <FormField label={t('createTask.reward')}>
      <LinearGradient
        colors={[theme.colors.yellowSoft, theme.colors.white]}
        locations={[0, 0.7071]}
        start={{ x: 0.46, y: 0 }}
        end={{ x: 0.54, y: 1 }}
        style={styles.reward}
      >
        <Text style={styles.rewardSign}>$</Text>
        <TextInput
          value={reward}
          onChangeText={setReward}
          placeholder="0"
          placeholderTextColor={theme.colors.placeholder}
          keyboardType="number-pad"
          inputMode="numeric"
          selectTextOnFocus
          maxLength={5}
          style={[styles.rewardInput, compact && styles.rewardInputCompact]}
        />
        <Icon name="coin" size={28} color={theme.colors.yellow} />
      </LinearGradient>
      <ChipRow>
        {presets.map((preset) => (
          <OptionChip
            key={preset}
            label={`$${preset}`}
            selected={rewardPreset === preset}
            onPress={() => pickRewardPreset(preset)}
          />
        ))}
      </ChipRow>
    </FormField>
  );
}
