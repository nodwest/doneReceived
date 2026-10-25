import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
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
  const { t } = useTranslation();
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
          <Text style={styles.title}>{t('reviewTask.title')}</Text>
          <Text style={styles.subtitle}>
            {t('reviewTask.subtitle', { name: childName })}
          </Text>
        </View>

        <View style={styles.reasons} accessibilityRole="radiogroup">
          {rejectReasons.map((key) => {
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
                  {t(`reviewTask.reasons.${key}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('reviewTask.comment')}</Text>
            <Text style={styles.optional}>{t('common.optional')}</Text>
          </View>
          <TextInput
            value={comment}
            onChangeText={setComment}
            multiline
            placeholder={t('reviewTask.commentPlaceholder')}
            placeholderTextColor={theme.colors.placeholder}
            style={styles.comment}
          />
        </View>

        <View style={styles.actions}>
          <PillButton
            label={t('common.cancel')}
            variant="ghost"
            size="md"
            onPress={onCancel}
          />
          <PillButton
            label={t('reviewTask.reject')}
            variant="danger"
            size="md"
            onPress={() => onReject({ reason, comment: comment.trim() })}
          />
        </View>
      </View>
    </BottomSheet>
  );
}
