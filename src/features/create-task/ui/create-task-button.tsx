import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Icon } from '@shared/ui';
import { theme } from '@shared/theme';
import { styles } from './create-task-button.styled';

type CreateTaskButtonProps = {
  onPress?: () => void;
};

export function CreateTaskButton({ onPress }: CreateTaskButtonProps) {
  return (
    <LinearGradient
      colors={[theme.colors.violet, theme.colors.blue]}
      start={{ x: 0, y: 0.2 }}
      end={{ x: 1, y: 0.8 }}
      locations={[0, 0.7071]}
      style={styles.gradient}
    >
      <Button variant="void" style={styles.button} onPress={onPress}>
        <Icon name="plus" size={22} color={theme.colors.white} />
        <Text style={styles.title}>Create Task</Text>
      </Button>
    </LinearGradient>
  );
}
