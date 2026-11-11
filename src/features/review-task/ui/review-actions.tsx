import { useState } from 'react';
import { View } from 'react-native';
import type { Task } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { CardButton } from '@shared/ui';
import { useReviewTask } from '../model/use-review-task';
import { RejectReasonSheet } from './reject-reason-sheet';
import { styles } from './review-task.styled';

/**
 * Кнопки проверки внизу карточки задания: Reject открывает шторку с причиной
 * и возвращает задание ребёнку (задание с сервера пока закрывает), Approve
 * подтверждает и выплачивает награду.
 */
export function ReviewActions({ task }: { task: Task }) {
  const { t } = useTranslation();
  const [rejecting, setRejecting] = useState(false);
  const { approve, reject, isPending } = useReviewTask();

  return (
    <View style={styles.reviewActions}>
      <CardButton
        label={t('reviewTask.reject')}
        variant="danger-outline"
        disabled={isPending}
        onPress={() => setRejecting(true)}
      />
      <CardButton
        label={t('reviewTask.approve')}
        variant="primary"
        disabled={isPending}
        onPress={() => approve(task)}
      />
      <RejectReasonSheet
        visible={rejecting}
        childName={task.assignee.name}
        closes={!!task.serverTaskId}
        onCancel={() => setRejecting(false)}
        onReject={(decision) => {
          setRejecting(false);
          reject(task, decision);
        }}
      />
    </View>
  );
}
