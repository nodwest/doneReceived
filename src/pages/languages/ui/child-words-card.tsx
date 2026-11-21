import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  deckFocus,
  getWordsOverview,
  giveWordsError,
  rewardsOf,
  useGiveWords,
  useWordsReward,
  WordsProgress,
  type WordsStatus,
} from '@features/english-words';
import type { FamilyChild } from '@entities/family';
import { useMyId } from '@entities/session';
import type { Task } from '@entities/task';
import { useChildWallet, type ChildWallet } from '@entities/wallet';
import {
  nextWordsRange,
  parseWordsRange,
  WORDS_PER_DAY,
  WORDS_REWARD,
  WORDS_TOTAL,
  wordsDay,
  wordsInRange,
} from '@entities/word';
import { authorizedImage } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { GradientButton, Icon, LetterAvatar, type IconName } from '@shared/ui';
import { styles } from './languages.styled';

type ChildWordsCardProps = {
  child: FamilyChild;
  familyId: string;
  /** Задания семьи: из них — слова этого ребёнка. */
  tasks: readonly Task[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Итоги слов по наградам в кошельке ребёнка: сколько дней сдано, серия
 * дней подряд (до сегодня или вчера), сколько заработано и сколько
 * выплачено сегодня.
 */
function wordsStats(wallet: ChildWallet | undefined, now = new Date()) {
  const rewards = (wallet?.transactions ?? []).filter(
    (item) => item.kind === 'reward' && parseWordsRange(item.task) !== null,
  );
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
  none: 'book',
  learning: 'book',
  review: 'clock',
  tomorrow: 'badge-check',
  finished: 'star',
};

const statusColor = (status: WordsStatus) =>
  status === 'review'
    ? theme.colors.reviewAccent
    : status === 'tomorrow' || status === 'finished'
      ? theme.colors.earnedInk
      : status === 'learning'
        ? theme.colors.childInk
        : theme.colors.parentInk;

/**
 * Слова ребёнка глазами родителя. Сверху — имя и чип состояния, под ним
 * цветная плашка: учит (голубая), ждёт проверки (оранжевая), сегодня
 * проверено (зелёная), слова не выданы. Ниже — прогресс по словарю, итоги
 * (дней подряд, всего дней, заработано), слова дня и одна главная кнопка.
 */
export function ChildWordsCard({
  child,
  familyId,
  tasks,
}: ChildWordsCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const myId = useMyId();
  const { data: wallet } = useChildWallet(child.id, familyId);
  const giveWords = useGiveWords();
  const { reward } = useWordsReward(familyId);
  const overview = useMemo(
    () =>
      getWordsOverview(
        tasks.filter((task) => task.assignee.id === child.id),
        rewardsOf(wallet),
      ),
    [tasks, wallet, child.id],
  );
  const stats = useMemo(() => wordsStats(wallet), [wallet]);
  const { status, task, range, learned } = overview;
  const canCheck = task ? (task.canManage ?? task.createdBy === myId) : false;
  const name = child.displayName;
  const next = nextWordsRange(learned);
  const amount = `$${reward ?? WORDS_REWARD}`;

  // Сегодняшние слова: пока учит или на проверке — слова задания; сдано —
  // проверенные сегодня.
  const focus = deckFocus(overview);
  const shownWords =
    status === 'learning' || status === 'review'
      ? overview.words
      : status === 'tomorrow' && focus.today
        ? wordsInRange(focus.today)
        : [];

  const banner = {
    none: {
      title: t('words.parent.card.noneTitle'),
      text: next
        ? learned > 0
          ? t('words.parent.card.noneNext', { from: next.from, to: next.to })
          : t('words.parent.card.noneText', { count: WORDS_PER_DAY, amount })
        : '',
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
        amount: `$${stats.paidToday}`,
        name,
      }),
    },
    finished: {
      title: t('words.parent.card.finishedTitle'),
      text: t('words.parent.card.finishedText', { total: WORDS_TOTAL }),
    },
  }[status];

  const give = () => {
    if (!next) return;
    giveWords.mutate(
      { childId: child.id, range: next },
      {
        onError: (error) =>
          showToast(t(`words.errors.${giveWordsError(error)}`)),
      },
    );
  };

  return (
    <View
      style={[
        styles.childCard,
        status === 'review' && styles.childCardReview,
        status === 'tomorrow' && styles.childCardDone,
      ]}
    >
      <View style={styles.childHead}>
        <LetterAvatar
          source={child.avatarUrl ? authorizedImage(child.avatarUrl) : null}
          name={name}
          style={styles.avatar}
        />
        <View style={styles.childHeadText}>
          <Text style={styles.childName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.childStatus}>
            {t('words.parent.card.learnedCount', {
              count: learned,
              total: WORDS_TOTAL,
            })}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.banner,
          status === 'learning' && styles.bannerLearning,
          status === 'review' && styles.bannerReview,
          (status === 'tomorrow' || status === 'finished') && styles.bannerDone,
        ]}
      >
        <View
          style={[
            styles.bannerIcon,
            status === 'learning' && styles.bannerIconLearning,
            status === 'review' && styles.bannerIconReview,
            (status === 'tomorrow' || status === 'finished') &&
              styles.bannerIconDone,
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
                  status === 'tomorrow' && styles.chipDone,
                  status === 'review' && styles.chipReview,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    status === 'tomorrow' && styles.chipTextDone,
                    status === 'review' && styles.chipTextReview,
                  ]}
                >
                  {word.word}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <WordsProgress
        tone="parent"
        label={t('words.parent.card.dictionary')}
        value={learned}
        total={WORDS_TOTAL}
      />

      <View style={styles.stats}>
        <Stat
          value={String(stats.streak)}
          label={t('words.parent.card.streak')}
        />
        <Stat value={String(stats.days)} label={t('words.parent.card.days')} />
        <Stat
          value={`$${stats.earned}`}
          label={t('words.parent.card.earned')}
        />
      </View>

      {status === 'none' && next ? (
        <View style={styles.actions}>
          <GradientButton
            label={t('words.parent.give', {
              count: next.to - next.from + 1,
              amount,
            })}
            icon="plus"
            loading={giveWords.isPending}
            onPress={give}
          />
          <Text style={styles.note}>{t('words.parent.giveHint')}</Text>
        </View>
      ) : null}

      {status === 'review' && task ? (
        canCheck ? (
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
        ) : (
          <Text style={styles.note}>
            {t('words.parent.checksAuthor', {
              name: task.authorName ?? t('member.parent'),
            })}
          </Text>
        )
      ) : null}
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
