import { Text, View } from 'react-native';
import { WORDS_PER_DAY, WORDS_REVIEW_COUNT } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { GradientButton, Icon } from '@shared/ui';
import { styles } from './words.styled';

/**
 * Как устроены слова — ребёнку при первом входе на вкладку (и по кнопке «?»
 * в шапке): учишь, родитель проверяет, с прошлыми словами, награда.
 */
export function WordsIntro({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const steps = [
    t('words.intro.step1', { count: WORDS_PER_DAY }),
    t('words.intro.step2'),
    t('words.intro.step3'),
    t('words.intro.step4'),
    t('words.intro.step5', { count: WORDS_REVIEW_COUNT }),
    t('words.intro.step6'),
  ];
  return (
    <View style={styles.state}>
      <View style={styles.stateIcon}>
        <Icon name="book" size={34} color={theme.colors.childInk} />
      </View>
      <Text style={styles.stateTitle} accessibilityRole="header">
        {t('words.intro.title')}
      </Text>
      <View style={styles.steps}>
        {steps.map((step, index) => (
          <View key={index} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
      <View style={styles.stateActions}>
        <GradientButton
          tone="blue"
          label={t('words.intro.start')}
          onPress={onDone}
        />
      </View>
    </View>
  );
}
