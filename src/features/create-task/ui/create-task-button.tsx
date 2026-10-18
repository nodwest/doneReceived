import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { styles } from './create-task-button.styled';

type CreateTaskButtonProps = {
  onPress?: () => void;
  label?: string;
  withIcon?: boolean;
  disabled?: boolean;
};

export function CreateTaskButton({
  onPress,
  label = 'Create Task',
  withIcon = true,
  disabled,
}: CreateTaskButtonProps) {
  return (
    <LinearGradient
      colors={[theme.colors.violet, theme.colors.blue]}
      start={{ x: 0, y: 0.2 }}
      end={{ x: 1, y: 0.8 }}
      locations={[0, 0.7071]}
      style={[styles.gradient, disabled && styles.disabled]}
    >
      <Button
        variant="void"
        className="overflow-hidden rounded-[28px] hover:bg-transparent active:bg-[#6C5CE7] active:opacity-100"
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled}
      >
        {withIcon && <Icon name="plus" size={22} color={theme.colors.white} />}
        <Text style={styles.title}>{label}</Text>
      </Button>
    </LinearGradient>
  );
}
