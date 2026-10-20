import { useState } from 'react';
import { View } from 'react-native';
import { PillButton } from '@shared/ui';
import type { RejectDecision } from '../model/reject-reasons';
import { RejectReasonSheet } from './reject-reason-sheet';
import { styles } from './review-task.styled';

type ReviewActionsProps = {
  childName: string;
  onApprove: () => void;
  onReject: (decision: RejectDecision) => void;
};

/** Кнопки проверки задания: Reject открывает шторку с причиной, Approve подтверждает. */
export function ReviewActions({
  childName,
  onApprove,
  onReject,
}: ReviewActionsProps) {
  const [rejecting, setRejecting] = useState(false);

  return (
    <View style={styles.reviewActions}>
      <PillButton
        label="Reject"
        variant="danger"
        onPress={() => setRejecting(true)}
      />
      <PillButton label="Approve" variant="primary" onPress={onApprove} />
      <RejectReasonSheet
        visible={rejecting}
        childName={childName}
        onCancel={() => setRejecting(false)}
        onReject={(decision) => {
          setRejecting(false);
          onReject(decision);
        }}
      />
    </View>
  );
}
