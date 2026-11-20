import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { TaskFormScreen } from './task-form-screen';

export function CreateTaskPage() {
  useTheme();
  const { t } = useTranslation();
  return (
    <TaskFormScreen
      title={t('createTask.createTitle')}
      successMessage={t('createTask.createdToast')}
    />
  );
}
