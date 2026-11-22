import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTranslation } from '@shared/i18n';
import type { Word } from '../model/word';
import { SpeakButton } from './speak-button';
import { styles } from './word-card.styled';

type WordCardProps = {
  word: Word;
  /** child — голубая (учит ребёнок), parent — тёмно-синяя (проверка). */
  tone?: 'child' | 'parent';
  /** Над словом справа от номера: например, чип «Повтор». */
  badge?: ReactNode;
  /**
   * Переводы скрыты (проверка): ребёнок смотрит на слово и отвечает сам,
   * родитель открывает перевод, чтобы сверить. Скрытые переводы размыты на
   * своих местах — карточка не меняет высоту, когда их открывают.
   */
  hidden?: boolean;
  /** Кнопки внизу карточки. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Размытый текст скрыт и от экранного диктора: иначе он прочитает перевод. */
const hiddenProps = (hidden: boolean) =>
  hidden
    ? ({
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants',
        'aria-hidden': true,
      } as const)
    : null;

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Части примера: слово выделено, остальное — обычным текстом. В примере
 * слово бывает в другой форме: makes, making, went.
 */
function splitExample(example: string, word: Word) {
  const base = word.word;
  const stems = [base, base.replace(/e$/, ''), base.replace(/y$/, 'i')];
  const regular = stems.map(
    (stem) => `${escape(stem)}(?:s|es|ed|d|ing|er|est|ies|ied)?`,
  );
  // Удвоенная согласная: stop → stopped, big → bigger.
  regular.push(`${escape(base)}${escape(base.slice(-1))}(?:ed|ing|er|est)`);
  const irregular = (word.forms ?? '').split(', ').filter(Boolean).map(escape);
  const forms = [...irregular, ...regular].join('|');
  return example.split(new RegExp(`\\b(${forms})\\b`, 'i'));
}

/**
 * Карточка слова: слово крупно с транскрипцией и неправильными
 * формами, над ним номер («Ранг 1»), справа динамик; сочетания с переводом; пример с этим
 * словом (выделено) и динамиком, перевод примера; перевод слова крупно.
 */
export function WordCard({
  word,
  tone = 'child',
  badge,
  hidden = false,
  footer,
  style,
}: WordCardProps) {
  const { t } = useTranslation();
  const parts = splitExample(word.example, word);
  return (
    <View style={[styles.card, style]}>
      <View style={styles.head}>
        <View style={styles.wordBlock}>
          {/* Номер в колоде — мелко над словом. */}
          <Text style={styles.rank}>
            {t('words.rankLabel', { rank: word.rank })}
          </Text>
          {/* Динамик — справа, по центру строки со словом. */}
          <View style={styles.wordRow}>
            <Text style={styles.word} accessibilityRole="header">
              {word.word}
            </Text>
            <SpeakButton
              text={word.word}
              tone={tone}
              accessibilityLabel={t('words.sayWord', { word: word.word })}
            />
          </View>
          <Text style={styles.transcription}>/{word.transcription}/</Text>
          {word.forms ? (
            <Text style={styles.forms}>
              {t('words.forms', { forms: word.forms })}
            </Text>
          ) : null}
        </View>
      </View>
      {badge}

      <View style={styles.example}>
        <View style={styles.exampleRow}>
          <Text style={styles.exampleText}>
            {parts.map((part, index) =>
              // Нечётные части — совпадения со словом.
              index % 2 === 1 ? (
                <Text key={index} style={styles.exampleHighlight}>
                  {part}
                </Text>
              ) : (
                part
              ),
            )}
          </Text>
          <SpeakButton
            size="sm"
            tone={tone}
            text={word.example}
            accessibilityLabel={t('words.sayExample')}
          />
        </View>
        <Text
          style={[styles.exampleTranslation, hidden && styles.blurred]}
          {...hiddenProps(hidden)}
        >
          {word.exampleTranslation}
        </Text>
      </View>

      <View style={styles.divider} />
      <View style={styles.translationBlock}>
        <Text style={styles.label}>{t('words.translation')}</Text>
        <Text
          style={[
            styles.translation,
            hidden && styles.blurred,
            hidden && styles.blurredLarge,
          ]}
          {...(hidden
            ? { accessibilityLabel: t('words.translationHidden') }
            : null)}
        >
          {word.translation}
        </Text>
      </View>

      {/* Сочетания: на проверке перевод размыт вместе с переводом слова. */}
      {word.collocations.length > 0 ? (
        <View style={styles.collocations}>
          <Text style={styles.label}>{t('words.collocations')}</Text>
          {word.collocations.map((item) => (
            <Text
              key={item.en}
              style={styles.collocation}
              {...(hidden ? { accessibilityLabel: item.en } : null)}
            >
              <Text style={styles.collocationEn}>{item.en}</Text>
              {' — '}
              <Text style={hidden ? styles.blurred : undefined}>{item.ru}</Text>
            </Text>
          ))}
        </View>
      ) : null}

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}
