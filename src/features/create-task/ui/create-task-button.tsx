import { useTranslation } from '@shared/i18n';
import { GradientButton } from '@shared/ui';

type CreateTaskButtonProps = {
  onPress?: () => void;
  label?: string;
  withIcon?: boolean;
  disabled?: boolean;
};

export function CreateTaskButton({
  onPress,
  label,
  withIcon = true,
  disabled,
}: CreateTaskButtonProps) {
  const { t } = useTranslation();
  return (
    <GradientButton
      label={label ?? t('createTask.create')}
      icon={withIcon ? 'plus' : undefined}
      onPress={onPress}
      disabled={disabled}
    />
  );
}
