import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  deckFocus,
  useSaveWordsSettings,
  useWordsOverview,
  WordsProgress,
  WordsRewardSetup,
  type WordsReward,
  type WordsStatus,
} from '@features/english-words';
import type { FamilyChild } from '@entities/family';
import { useMyId } from '@entities/session';
import type { Task } from '@entities/task';
import { WORDS_PER_DAY, wordsDay, wordsInRange } from '@entities/word';
import { authorizedImage, hasApiErrorCode, isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { GradientButton, Icon, LetterAvatar, type IconName } from '@shared/ui';
import { styles } from './languages.styled';

type ChildWordsCardProps = {
  child: FamilyChild;
  familyId: string;
  /** Задания семьи: из них — порция слов этого ребёнка. */
  tasks: readonly Task[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Итоги слов по наградам за слова в кошельке ребёнка: сколько дней сдано,
 * серия дней подряд (до сегодня или вчера), сколько заработано и сколько
 * выплачено сегодня.
 */
function wordsStats(rewards: readonly WordsReward[], now = new Date()) {
  const days = new Set(rewards.map((item) => wordsDay(item.at)));
  const today = wordsDay(now);
  let streak = 0;
  // Сегодня ещё не сдали — серия не прервана, считаем со вчера.
  let offset = days.has(today) ? 0 : 1;
  while (days.has(wordsDay(new Date(now.getTime() - offset * DAY_MS)))) {
    streak += 1;
    offset += 1;
  }
  return {
    days: days.size,
    streak,
    earned: rewards.reduce((sum, item) => sum + item.amount, 0),
    paidToday: rewards
      .filter((item) => wordsDay(item.at) === today)
      .reduce((sum, item) => sum + item.amount, 0),
  };
}

/** Иконка плашки состояния. */
const STATUS_ICON: Record<WordsStatus, IconName> = {
  off: 'book',
  learning: 'book',
  redo: 'refresh',
  review: 'clock',
  tomorrow: 'badge-check',
  noFunds: 'coins',
  finished: 'star',
};

const statusColor = (status: WordsStatus) =>
  status === 'review' || status === 'noFunds'
    ? theme.colors.reviewAccent
    : status === 'tomorrow' || status === 'finished'
      ? theme.colors.earnedInk
      : status === 'learning' || status === 'redo'
        ? theme.colors.childInk
        : theme.colors.parentInk;

/**
 * Слова ребёнка глазами родителя. Сверху — имя и сколько выучено, под ним
 * цветная плашка: учит (голубая), ждёт проверки или не хватает денег
 * (оранжевая), сегодня проверено (зелёная), слова не включены. Ниже — слова
 * дня, прогресс по словарю, итоги (дней подряд, всего дней, заработано),
 * награда за день и одна главная кнопка. Слова выдаёт сервер сам: родитель
 * только включает их и выбирает награду.
 */
export function ChildWordsCard({
  child,
  familyId,
  tasks,
}: ChildWordsCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const myId = useMyId();
  const { overview, rewards } = useWordsOverview(familyId, child.id, tasks);
  const save = useSaveWordsSettings(familyId);
  const [editing, setEditing] = useState(false);
  const stats = useMemo(() => wordsStats(rewards), [rewards]);
  const name = child.displayName;

  if (!overview) {
    return (
      <View style={styles.childCard}>
        <ChildHead child={child} subtitle={null} />
      </View>
    );
  }

  const { status, task, range, learned, total, reward } = overview;
  const amount = `$${reward ?? 0}`;

  // Сегодняшние слова: пока учит или на проверке — слова порции (после
  // неудачной проверки — и пройденные, которые не вспомнил); сдано —
  // последняя оплаченная порция.
  const focus = deckFocus(overview);
  const missedRanks = new Set(overview.missed.map((word) => word.rank));
  const shownWords =
    status === 'learning' || status === 'review'
      ? overview.words
      : status === 'redo'
        ? [
            ...overview.words,
            ...overview.missed.filter(
              (word) => !overview.words.some((item) => item.rank === word.rank),
            ),
          ]
        : status === 'tomorrow' && focus.today
          ? wordsInRange(focus.today)
          : [];

  const banner = {
    off: {
      title: t('words.parent.card.noneTitle'),
      text: t('words.parent.card.noneText', { count: WORDS_PER_DAY }),
    },
    learning: {
      title: t('words.parent.card.learningTitle', {
        from: range?.from ?? 0,
        to: range?.to ?? 0,
      }),
      text: task?.rejection
        ? t('words.parent.card.learningRedo', { name })
        : t('words.parent.card.learningText', { name }),
    },
    redo: {
      title: t('words.parent.card.learningTitle', {
        from: range?.from ?? 0,
        to: range?.to ?? 0,
      }),
      text: t('words.parent.card.learningRedo', { name }),
    },
    review: {
      title: t('words.parent.card.reviewTitle'),
      text: t('words.parent.card.reviewText', {
        name,
        from: range?.from ?? 0,
        to: range?.to ?? 0,
      }),
    },
    tomorrow: {
      title: t('words.parent.card.doneTitle'),
      text: t('words.parent.card.doneText', {
        amount: `$${stats.paidToday || reward || 0}`,
        name,
      }),
    },
    noFunds: {
      title: t('words.parent.card.noFundsTitle'),
      text: t('words.parent.card.noFundsText', { name, amount }),
    },
    finished: {
      title: t('words.parent.card.finishedTitle'),
      text: t('words.parent.card.finishedText', { total }),
    },
  }[status];

  // Включить слова или сменить награду. Не хватило денег на первую порцию —
  // настройки всё равно сохранены (тост), порция ждёт пополнения.
  const saveReward = (rewardPoints: number) =>
    save.mutate(
      { childId: child.id, enabled: true, rewardPoints },
      {
        onSuccess: () => {
          setEditing(false);
          if (status !== 'off') {
            showToast(t('words.reward.saved', { amount: `$${rewardPoints}` }));
          }
        },
        onError: (error) => {
          if (
            isApiError(error) &&
            hasApiErrorCode(error, 'INSUFFICIENT_FUNDS')
          ) {
            setEditing(false);
          }
        },
      },
    );

  if (editing) {
    return (
      <View style={styles.childCard}>
        <ChildHead child={child} subtitle={null} />
        <WordsRewardSetup
          initial={status === 'off' ? null : reward}
          saving={save.isPending}
          onSave={saveReward}
          onCancel={() => setEditing(false)}
        />
      </View>
    );
  }

  const done = status === 'tomorrow' || status === 'finished';
  const warn = status === 'review' || status === 'noFunds';

  return (
    <View
      style={[
        styles.childCard,
        warn && styles.childCardReview,
        status === 'tomorrow' && styles.childCardDone,
      ]}
    >
      <ChildHead
        child={child}
        subtitle={t('words.parent.card.learnedCount', {
          count: learned,
          total,
        })}
      />

      <View
        style={[
          styles.banner,
          (status === 'learning' || status === 'redo') && styles.bannerLearning,
          warn && styles.bannerReview,
          done && styles.bannerDone,
        ]}
      >
        <View
          style={[
            styles.bannerIcon,
            (status === 'learning' || status === 'redo') &&
              styles.bannerIconLearning,
            warn && styles.bannerIconReview,
            done && styles.bannerIconDone,
          ]}
        >
          <Icon
            name={STATUS_ICON[status]}
            size={24}
            color={statusColor(status)}
          />
        </View>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>{banner.title}</Text>
          {banner.text ? (
            <Text style={styles.bannerBody}>{banner.text}</Text>
          ) : null}
        </View>
      </View>

      {shownWords.length > 0 ? (
        <View style={styles.words}>
          <Text style={styles.smallLabel}>{t('words.parent.todayWords')}</Text>
          <View style={styles.chips}>
            {shownWords.map((word) => (
              <View
                key={word.rank}
                style={[
                  styles.chip,
                  (status === 'learning' || status === 'redo') &&
                    styles.chipLearning,
                  status === 'tomorrow' && styles.chipDone,
                  status === 'review' && styles.chipReview,
                  missedRanks.has(word.rank) && styles.chipMissed,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    (status === 'learning' || status === 'redo') &&
                      styles.chipTextLearning,
                    status === 'tomorrow' && styles.chipTextDone,
                    status === 'review' && styles.chipTextReview,
                    missedRanks.has(word.rank) && styles.chipTextMissed,
                  ]}
                >
                  {word.word}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {status !== 'off' ? (
        <>
          <WordsProgress
            tone="parent"
            label={t('words.parent.card.dictionary')}
            value={learned}
            total={total}
          />

          <View style={styles.stats}>
            <Stat
              value={String(stats.streak)}
              label={t('words.parent.card.streak')}
            />
            <Stat
              value={String(stats.days)}
              label={t('words.parent.card.days')}
            />
            <Stat
              value={`$${stats.earned}`}
              label={t('words.parent.card.earned')}
            />
          </View>

          {reward !== null ? (
            <View style={styles.rewardLine}>
              <Text style={styles.rewardLineText} numberOfLines={1}>
                {t('words.parent.card.rewardLine', { amount })}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('words.reward.edit')}
                hitSlop={8}
                onPress={() => setEditing(true)}
              >
                <Text style={styles.rewardLineLink}>
                  {t('words.parent.card.changeReward')}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </>
      ) : null}

      {status === 'off' ? (
        <View style={styles.actions}>
          <GradientButton
            label={t('words.parent.enable')}
            icon="plus"
            onPress={() => setEditing(true)}
          />
          <Text style={styles.note}>{t('words.parent.giveHint')}</Text>
        </View>
      ) : null}

      {status === 'noFunds' ? (
        overview.payerId === myId ? (
          <GradientButton
            label={t('words.parent.card.deposit')}
            icon="coins"
            onPress={() => router.dismissTo('/wallet')}
          />
        ) : (
          <Text style={styles.note}>{t('words.parent.card.noFundsOther')}</Text>
        )
      ) : null}

      {status === 'review' && task ? (
        <GradientButton
          label={t('words.parent.check')}
          icon="check"
          onPress={() =>
            router.push({
              pathname: '/languages',
              params: { check: task.id },
            })
          }
        />
      ) : null}
    </View>
  );
}

/** Шапка карточки: фото или буква, имя и строка под ним. */
function ChildHead({
  child,
  subtitle,
}: {
  child: FamilyChild;
  subtitle: string | null;
}) {
  return (
    <View style={styles.childHead}>
      <LetterAvatar
        source={child.avatarUrl ? authorizedImage(child.avatarUrl) : null}
        name={child.displayName}
        style={styles.avatar}
      />
      <View style={styles.childHeadText}>
        <Text style={styles.childName} numberOfLines={1}>
          {child.displayName}
        </Text>
        {subtitle ? <Text style={styles.childStatus}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

/**
 * Плитка итога, как плитки «Created / Due» в карточке задания: голубая
 * подложка, чуть вдавлена (внутренняя тень); крупное число и подпись под
 * ним, по центру — три плитки одинаковые.
 */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>
        {label}
      </Text>
    </View>
  );
}
