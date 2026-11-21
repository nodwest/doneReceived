import { useState } from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import type { Task } from '@entities/task';
import { buildCheckDeck, WordCard, type Word } from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { CardButton, GradientButton, Icon, RoundButton } from '@shared/ui';
import { useCheckWords } from '../model/use-check-words';
import { WordLine, WordsState } from './words-parts';
import { styles } from './words.styled';

type WordsCheckProps = {
  task: Task;
  words: readonly Word[];
  onClose: () => void;
};

type Result = 'sent-back' | null;

/**
 * Вечерняя проверка: родитель по одной карточке называет слово, ребёнок
 * переводит, родитель отмечает «Правильно» или «Неправильно». Карточки —
 * слова задания и несколько пройденных раньше, вперемешку. Всё верно —
 * награда выплачивается и экран закрывается; есть ошибки — слова возвращаются на повтор.
 */
export function WordsCheck({ task, words, onClose }: WordsCheckProps) {
  const { t } = useTranslation();
  const name = task.assignee.name;
  const amount = `$${task.reward}`;
  // Колода собирается один раз: перечитывание списка не перемешивает её.
  const [deck] = useState(() => buildCheckDeck(words));
  const newRanks = new Set(words.map((word) => word.rank));
  const [answers, setAnswers] = useState<boolean[]>([]);
  // Перевод открыт на карточке с этим номером: сначала ребёнок отвечает сам.
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [result, setResult] = useState<Result>(null);
  const { approve, reject } = useCheckWords();
  const busy = approve.isPending || reject.isPending;

  const answer = (right: boolean) =>
    setAnswers((prev) => (prev.length < deck.length ? [...prev, right] : prev));
  // Исправляем ответ — перевод на той карточке уже был открыт.
  const undo = () => {
    setRevealedIndex(answers.length - 1);
    setAnswers((prev) => prev.slice(0, -1));
  };

  const index = answers.length;
  const current = deck[index];
  const revealed = revealedIndex === index;
  const missed = deck.filter((_, i) => answers[i] === false);
  const right = answers.filter(Boolean).length;
  const allRight = index === deck.length && missed.length === 0;

  const header = (
    <View style={styles.checkHead}>
      <RoundButton
        icon="arrow-left"
        accessibilityLabel={t('common.back')}
        onPress={onClose}
      />
      <View style={styles.checkTitleBlock}>
        <Text style={styles.checkTitle}>{t('words.check.title')}</Text>
        <Text style={styles.checkSubtitle}>
          {t('words.check.subtitle', { name })}
        </Text>
      </View>
      {/* Исправить последний ответ — пока итог не отправлен. */}
      <RoundButton
        icon="undo"
        accessibilityLabel={t('words.check.undo')}
        disabled={index === 0 || result !== null || busy}
        onPress={undo}
      />
    </View>
  );

  if (result === 'sent-back') {
    return (
      <View style={styles.check}>
        <WordsState
          icon="undo"
          tone="review"
          title={t('words.check.sentBackTitle', { name })}
          text={t('words.check.sentBackText', { name })}
        >
          <GradientButton label={t('words.check.done')} onPress={onClose} />
        </WordsState>
      </View>
    );
  }

  return (
    <View style={styles.check}>
      {header}
      <View
        style={styles.dots}
        accessibilityLabel={t('words.check.progress', {
          current: Math.min(index + 1, deck.length),
          total: deck.length,
        })}
      >
        {deck.map((word, i) => (
          <View
            key={word.rank}
            style={[
              styles.dot,
              i === index && styles.dotCurrent,
              answers[i] === true && styles.dotRight,
              answers[i] === false && styles.dotWrong,
            ]}
          />
        ))}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {current ? (
          <>
            <View style={styles.askHint}>
              <Icon name="message" size={20} color={theme.colors.parentInk} />
              <Text style={styles.askHintText}>
                {t('words.check.askHint', {
                  name,
                  current: index + 1,
                  total: deck.length,
                })}
              </Text>
            </View>
            <Animated.View
              key={current.rank}
              entering={FadeInRight.duration(220)}
            >
              <WordCard
                word={current}
                tone="parent"
                badge={
                  newRanks.has(current.rank) ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {t('words.check.newWord')}
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.badge, styles.badgeReview]}>
                      <Text style={[styles.badgeText, styles.badgeTextReview]}>
                        {t('words.check.reviewWord')}
                      </Text>
                    </View>
                  )
                }
                hidden={!revealed}
                footer={
                  revealed ? (
                    <>
                      <CardButton
                        label={t('words.check.wrong')}
                        variant="outline"
                        icon="close"
                        onPress={() => answer(false)}
                      />
                      <CardButton
                        label={t('words.check.right')}
                        variant="primary"
                        icon="check"
                        onPress={() => answer(true)}
                      />
                    </>
                  ) : (
                    <CardButton
                      label={t('words.check.reveal')}
                      variant="primary"
                      icon="eye"
                      onPress={() => setRevealedIndex(index)}
                    />
                  )
                }
              />
            </Animated.View>
          </>
        ) : allRight ? (
          <WordsState
            icon="star"
            tone="success"
            title={t('words.check.allRightTitle', { total: deck.length })}
            text={t('words.check.allRightText', { name, amount })}
          >
            <GradientButton
              label={t('words.check.pay', { amount })}
              loading={approve.isPending}
              disabled={busy}
              onPress={() =>
                // Выплатили — сразу назад к карточке ребёнка: там видно, что
                // сегодня проверено и оплачено.
                approve.mutate(task, { onSuccess: onClose })
              }
            />
          </WordsState>
        ) : (
          <>
            <WordsState
              icon="refresh"
              tone="review"
              title={t('words.check.someWrongTitle', {
                right,
                total: deck.length,
              })}
              text={t('words.check.someWrongText', { name })}
            >
              <GradientButton
                label={t('words.check.sendBack')}
                icon="undo"
                loading={reject.isPending}
                disabled={busy}
                onPress={() =>
                  reject.mutate(
                    { task, missed: missed.map((word) => word.word) },
                    { onSuccess: () => setResult('sent-back') },
                  )
                }
              />
            </WordsState>
            <View style={styles.list}>
              <Text style={styles.listTitle}>{t('words.check.missed')}</Text>
              {missed.map((word) => (
                <WordLine key={word.rank} word={word} tone="parent" missed />
              ))}
            </View>
          </>
        )}
        {!current && (
          <Pressable
            accessibilityRole="button"
            style={styles.link}
            disabled={busy}
            onPress={undo}
          >
            <Text style={styles.linkText}>{t('words.check.changeLast')}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}
