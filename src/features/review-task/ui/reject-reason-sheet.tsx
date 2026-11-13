import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatRewardShort } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { withAlpha } from '@shared/lib';
import { theme } from '@shared/theme';
import { BottomSheet, Icon, SheetField, Toggle } from '@shared/ui';
import {
  REJECT_COMMENT_MAX_LENGTH,
  isCommentRequired,
  rejectReasons,
  type RejectDecision,
  type RejectReasonKey,
} from '../model/reject-reasons';
import { styles } from './review-task.styled';

const DEFAULT_REASON: RejectReasonKey = 'not-done-properly';

type RejectReasonSheetProps = {
  visible: boolean;
  childName: string;
  /** Награда задания: сколько останется в резерве или вернётся. */
  reward: number;
  /** Срок задания прошёл: переделать нельзя, только закрыть. */
  deadlinePassed: boolean;
  onCancel: () => void;
  onReject: (decision: RejectDecision) => void;
};

/**
 * Шторка отказа: причина, комментарий (у Other обязателен) и тогл «Let Emma
 * redo it». Включён (по умолчанию) — задание вернётся ребёнку, награда
 * останется в резерве; выключен — задание закроется, награда вернётся в
 * кошелёк. Срок прошёл — тогл выключен и не нажимается.
 */
export function RejectReasonSheet({
  visible,
  childName,
  reward,
  deadlinePassed,
  onCancel,
  onReject,
}: RejectReasonSheetProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState<RejectReasonKey>(DEFAULT_REASON);
  const [comment, setComment] = useState('');
  const [redo, setRedo] = useState(true);
  // Каждое открытие начинается с чистой формы.
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setReason(DEFAULT_REASON);
      setComment('');
      setRedo(true);
    }
  }

  const retry = redo && !deadlinePassed;
  const required = isCommentRequired(reason);
  const disabled = required && !comment.trim();
  const amount = formatRewardShort(reward);
  const name = childName;

  const placeholder = required
    ? t('reviewTask.commentPlaceholderOther', { name })
    : retry
      ? t('reviewTask.commentPlaceholderRedo')
      : t('reviewTask.commentPlaceholderClose');

  const submit = () => {
    if (disabled) return;
    onReject({ reason, comment: comment.trim(), retry });
  };

  const submitLabel = disabled
    ? t(retry ? 'reviewTask.needCommentRedo' : 'reviewTask.needCommentClose')
    : retry
      ? t('reviewTask.sendBack', { name })
      : t('reviewTask.closeTask');

  return (
    <BottomSheet visible={visible} onClose={onCancel} maxHeightRatio={0.94}>
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.title} accessibilityRole="header">
              {t('reviewTask.title')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              onPress={onCancel}
              hitSlop={4}
              style={styles.close}
            >
              <Icon name="close" size={14} color={theme.colors.ink} />
            </Pressable>
          </View>
          <Text style={styles.subtitle}>
            {t('reviewTask.subtitle', { name })}
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

        <SheetField
          label={
            required ? (
              <>
                {t('reviewTask.comment')}
                <Text style={styles.required}>{t('reviewTask.required')}</Text>
              </>
            ) : (
              `${t('reviewTask.comment')} ${t('common.optional')}`
            )
          }
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={REJECT_COMMENT_MAX_LENGTH}
          placeholder={placeholder}
          accessibilityLabel={t('reviewTask.comment')}
        />

        <View
          style={[
            styles.redo,
            deadlinePassed
              ? styles.redoExpired
              : retry
                ? styles.redoOn
                : styles.redoOff,
          ]}
        >
          {retry && (
            <LinearGradient
              colors={[
                withAlpha(theme.colors.violet, 0.12),
                withAlpha(theme.colors.blue, 0.06),
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={styles.redoInfo}>
            <Text
              style={[
                styles.redoTitle,
                deadlinePassed && styles.redoTitleExpired,
              ]}
            >
              {deadlinePassed
                ? t('reviewTask.expiredTitle')
                : t('reviewTask.redoTitle', { name })}
            </Text>
            <Text style={styles.redoHint}>
              {deadlinePassed
                ? t('reviewTask.expiredHint', { amount })
                : retry
                  ? t('reviewTask.redoOnHint', { name, amount })
                  : t('reviewTask.redoOffHint', { amount })}
            </Text>
          </View>
          <Toggle
            value={retry}
            onValueChange={setRedo}
            disabled={deadlinePassed}
            accessibilityLabel={t('reviewTask.redoTitle', { name })}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={submit}
          style={({ pressed }) => [
            styles.submit,
            disabled
              ? styles.submitDisabled
              : retry
                ? styles.submitRetry
                : styles.submitClose,
            pressed && styles.pressed,
          ]}
        >
          {!disabled && (
            <LinearGradient
              colors={
                retry
                  ? [theme.colors.violet, theme.colors.blue]
                  : [theme.colors.dangerFrom, theme.colors.danger]
              }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          <Icon
            name={disabled ? 'pencil' : retry ? 'undo' : 'close'}
            size={18}
            color={disabled ? theme.colors.placeholderSoft : theme.colors.white}
          />
          <Text
            style={[styles.submitLabel, disabled && styles.submitLabelDisabled]}
            numberOfLines={1}
          >
            {submitLabel}
          </Text>
        </Pressable>
      </ScrollView>
    </BottomSheet>
  );
}
