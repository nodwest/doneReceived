import { GradientButton } from '@shared/ui';

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
    <GradientButton
      label={label}
      icon={withIcon ? 'plus' : undefined}
      onPress={onPress}
      disabled={disabled}
    />
  );
}
