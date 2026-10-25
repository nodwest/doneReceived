import { useTranslation } from '@shared/i18n';
import { TaskFormScreen } from './task-form-screen';

export function CreateTaskPage() {
  const { t } = useTranslation();
  return (
    <TaskFormScreen
      title={t('createTask.createTitle')}
      successMessage={t('createTask.createdToast')}
    />
  );
}
