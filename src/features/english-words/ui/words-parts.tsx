import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SpeakButton, type Word } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon, type IconName } from '@shared/ui';
import { styles } from './words.styled';

/** Полоса «выучено / запомнено N из M». */
export function WordsProgress({
  label,
  value,
  total,
  tone = 'child',
}: {
  label: string;
  value: number;
  total: number;
  tone?: 'child' | 'parent';
}) {
  const parent = tone === 'parent';
  const share = total > 0 ? Math.min(value / total, 1) : 0;
  return (
    <View
      style={styles.progress}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: total, now: value }}
    >
      <View style={styles.progressHead}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text
          style={[styles.progressValue, parent && styles.progressValueParent]}
        >
          {value} / {total}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            parent && styles.fillParent,
            { width: `${share * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

type StateTone = 'child' | 'parent' | 'success' | 'review' | 'danger';

const ICON_COLORS: Record<StateTone, () => string> = {
  child: () => theme.colors.childInk,
  parent: () => theme.colors.parentInk,
  success: () => theme.colors.earnedInk,
  review: () => theme.colors.reviewAccent,
  danger: () => theme.colors.dangerText,
};

/** Карточка состояния: крупная иконка, заголовок, текст и кнопки. */
export function WordsState({
  icon,
  tone = 'child',
  title,
  text,
  compact = false,
  children,
}: {
  icon: IconName;
  tone?: StateTone;
  title: string;
  text?: string;
  /** Строкой: иконка слева, текст справа — над списком слов. */
  compact?: boolean;
  children?: ReactNode;
}) {
  if (compact) {
    return (
      <View
        style={[
          styles.stateCompact,
          tone === 'success' && styles.stateCompactSuccess,
          tone === 'review' && styles.stateCompactReview,
        ]}
      >
        <View
          style={[
            styles.stateCompactIcon,
            tone === 'success' && styles.stateIconSuccess,
            tone === 'review' && styles.stateIconReview,
            tone === 'parent' && styles.stateIconParent,
            tone === 'danger' && styles.stateIconDanger,
          ]}
        >
          <Icon name={icon} size={24} color={ICON_COLORS[tone]()} />
        </View>
        <View style={styles.stateCompactText}>
          <Text style={styles.stateCompactTitle} accessibilityRole="header">
            {title}
          </Text>
          {text ? <Text style={styles.stateCompactBody}>{text}</Text> : null}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.state}>
      <View
        style={[
          styles.stateIcon,
          tone === 'success' && styles.stateIconSuccess,
          tone === 'review' && styles.stateIconReview,
          tone === 'parent' && styles.stateIconParent,
          tone === 'danger' && styles.stateIconDanger,
        ]}
      >
        <Icon name={icon} size={34} color={ICON_COLORS[tone]()} />
      </View>
      <Text style={styles.stateTitle} accessibilityRole="header">
        {title}
      </Text>
      {text ? <Text style={styles.stateText}>{text}</Text> : null}
      {children ? <View style={styles.stateActions}>{children}</View> : null}
    </View>
  );
}

/** Строка слова: номер, слово, перевод и динамик. */
export function WordLine({
  word,
  missed,
  tone = 'child',
}: {
  word: Word;
  /** Не вспомнил на проверке: красноватая строка. */
  missed?: boolean;
  tone?: 'child' | 'parent';
}) {
  const { t } = useTranslation();
  return (
    <View style={[styles.wordRow, missed && styles.wordRowMissed]}>
      <Text style={styles.wordRowRank}>
        {t('words.rank', { rank: word.rank })}
      </Text>
      <View style={styles.wordRowText}>
        <Text style={styles.wordRowWord}>{word.word}</Text>
        <Text style={styles.wordRowTranslation}>{word.translation}</Text>
      </View>
      <SpeakButton
        size="sm"
        tone={tone}
        text={word.word}
        accessibilityLabel={t('words.sayWord', { word: word.word })}
      />
    </View>
  );
}
