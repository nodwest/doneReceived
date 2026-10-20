import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { BottomSheet, PillButton } from '@shared/ui';
import { theme } from '@shared/theme';
import {
  rejectReasons,
  type RejectDecision,
  type RejectReasonKey,
} from '../model/reject-reasons';
import { styles } from './review-task.styled';

const DEFAULT_REASON: RejectReasonKey = 'not-done-properly';

type RejectReasonSheetProps = {
  visible: boolean;
  childName: string;
  onCancel: () => void;
  onReject: (decision: RejectDecision) => void;
};

/** Шторка отказа: причина и необязательный комментарий для ребёнка. */
export function RejectReasonSheet({
  visible,
  childName,
  onCancel,
  onReject,
}: RejectReasonSheetProps) {
  const [reason, setReason] = useState<RejectReasonKey>(DEFAULT_REASON);
  const [comment, setComment] = useState('');
  // Каждое открытие начинается с чистой формы.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setReason(DEFAULT_REASON);
      setComment('');
    }
  }

  return (
    <BottomSheet visible={visible} onClose={onCancel} maxHeightRatio={0.9}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title}>Reject task</Text>
          <Text style={styles.subtitle}>
            Tell {childName} what to fix. {childName} will see your reason and
            can try again.
          </Text>
        </View>

        <View style={styles.reasons} accessibilityRole="radiogroup">
          {rejectReasons.map(({ key, label }) => {
            const selected = key === reason;
            return (
              <Pressable
                key={key}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => setReason(key)}
                style={[styles.reason, selected && styles.reasonSelected]}
              >
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
                <Text
                  style={[
                    styles.reasonLabel,
                    selected && styles.reasonLabelSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Add a comment</Text>
            <Text style={styles.optional}>(optional)</Text>
          </View>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder='Show what needs to be fixed, for example "the bed is not made".'
            placeholderTextColor={theme.colors.placeholder}
            style={styles.comment}
          />
        </View>

        <View style={styles.actions}>
          <PillButton
            label="Cancel"
            variant="ghost"
            size="md"
            onPress={onCancel}
          />
          <PillButton
            label="Reject"
            variant="danger"
            size="md"
            onPress={() => onReject({ reason, comment: comment.trim() })}
          />
        </View>
      </View>
    </BottomSheet>
  );
}
