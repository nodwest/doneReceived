import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import type { StepComment } from '../model';
import { styles } from './activity-history.styled';

/** Шаг статуса в истории задания. */
export interface ActivityStep {
  id: string;
  /** Статус с заглавной буквы: «On review». */
  label: string;
  /** Кто и когда: «Sarah · yesterday, 9:30 AM». */
  detail: string;
  /** Цвет точки: свой у каждого статуса. */
  color: string;
  /** Комментарий ребёнка к сдаче или родителя к отказу. */
  comment?: StepComment;
}

type ActivityHistoryProps = {
  /** Шаги от нового к старому. */
  steps: ActivityStep[];
  /** Цвет линии между точками. */
  lineColor: string;
  /** Цвет первого, текущего статуса — как у статуса в шапке карточки. */
  currentStyle: StyleProp<TextStyle>;
  /** Комментарии не загрузились: внизу — «повторить». */
  onRetryComments?: () => void;
};

/**
 * Раскрытая история задания: сверху текущий статус (выделен), ниже — всё
 * более старые.
 */
export function ActivityHistory({
  steps,
  lineColor,
  currentStyle,
  onRetryComments,
}: ActivityHistoryProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.panel}>
      {steps.map((step, index) => {
        const current = index === 0;
        const last = index === steps.length - 1;
        return (
          <View key={step.id} style={styles.step} accessible>
            <View style={styles.rail}>
              <View
                style={[
                  styles.lineTop,
                  index > 0 && { backgroundColor: lineColor },
                ]}
              />
              <View style={[styles.dot, { backgroundColor: step.color }]} />
              {!last && (
                <View style={[styles.line, { backgroundColor: lineColor }]} />
              )}
            </View>
            <View
              style={[
                styles.text,
                !last && (step.comment ? styles.textGapWide : styles.textGap),
              ]}
            >
              <Text
                style={[
                  styles.label,
                  current && [styles.current, currentStyle],
                ]}
              >
                {step.label}
              </Text>
              <Text style={styles.detail}>{step.detail}</Text>
              {step.comment && (
                <View style={styles.comment}>
                  {step.comment.reason && (
                    <Text style={styles.reason}>
                      {t(`reviewTask.reasons.${step.comment.reason}`)}
                    </Text>
                  )}
                  {!!step.comment.text && (
                    <Text style={styles.commentText}>{step.comment.text}</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        );
      })}
      {onRetryComments && (
        <View style={styles.failed}>
          <Text style={styles.detail}>{t('activity.commentsError')}</Text>
          <Pressable
            accessibilityRole="button"
            hitSlop={12}
            onPress={onRetryComments}
          >
            <Text style={styles.retry}>{t('common.retry')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
