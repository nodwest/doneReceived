import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { WORDS_PER_DAY, WORDS_REWARD_MAX } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { GradientButton, Icon } from '@shared/ui';
import { styles } from './words.styled';

type WordsRewardSetupProps = {
  /** Текущая награда; null — родитель выбирает впервые. */
  initial: number | null;
  onSave: (reward: number) => void;
  /** Правка (есть Cancel); при первом выборе отменить нельзя. */
  onCancel?: () => void;
};

/**
 * Сколько родитель платит за сданный день (10 слов): сумма целыми долларами. При первом входе на вкладку и по карандашу в
 * шапке.
 */
export function WordsRewardSetup({
  initial,
  onSave,
  onCancel,
}: WordsRewardSetupProps) {
  const { t } = useTranslation();
  const [text, setText] = useState(initial ? String(initial) : '');
  const value = Number(text);
  const valid =
    text !== '' &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= WORDS_REWARD_MAX;

  return (
    <View style={styles.state}>
      <View style={[styles.stateIcon, styles.stateIconSuccess]}>
        <Icon name="coins" size={34} color={theme.colors.earnedInk} />
      </View>
      <Text style={styles.stateTitle} accessibilityRole="header">
        {initial
          ? t('words.reward.editTitle')
          : t('words.reward.title', { count: WORDS_PER_DAY })}
      </Text>
      <Text style={styles.stateText}>
        {t('words.reward.text', { count: WORDS_PER_DAY })}
      </Text>

      <View style={styles.amountField}>
        <Text style={styles.amountPrefix}>$</Text>
        <TextInput
          value={text}
          onChangeText={(next) => setText(next.replace(/\D/g, '').slice(0, 4))}
          keyboardType="number-pad"
          placeholder={t('words.reward.placeholder')}
          placeholderTextColor={theme.colors.placeholder}
          accessibilityLabel={t('words.reward.inputLabel')}
          style={styles.amountInput}
        />
        <Text style={styles.amountSuffix} numberOfLines={1}>
          {t('words.reward.perDay')}
        </Text>
      </View>
      <Text style={styles.listHint}>
        {valid || text === ''
          ? t('words.reward.changeLater')
          : t('words.reward.invalid', { max: WORDS_REWARD_MAX })}
      </Text>

      <View style={styles.stateActions}>
        <GradientButton
          label={
            initial
              ? t('words.reward.save')
              : t('words.reward.start', { amount: valid ? `$${value}` : '' })
          }
          disabled={!valid}
          onPress={() => onSave(value)}
        />
        {onCancel ? (
          <Pressable
            accessibilityRole="button"
            style={styles.link}
            onPress={onCancel}
          >
            <Text style={styles.linkText}>{t('common.cancel')}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
