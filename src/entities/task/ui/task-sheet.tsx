import { useState, type ReactNode } from 'react';
import {
  ScrollView,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ApiImage, Icon, PhotoCarousel, type IconName } from '@shared/ui';
import {
  formatCountdown,
  KeepInViewContext,
  keepInViewScrollStyle,
  useKeepInView,
  withAlpha,
} from '@shared/lib';
import { theme } from '@shared/theme';
import { formatRewardShort } from '../model';
import { styles } from './task-sheet.styled';

/**
 * parent и child — голубая шапка, review — оранжевая «на
 * проверке», paid — зелёная: награда выплачена, wallet — тёмно-синяя, как
 * карточка баланса: транзакция кошелька.
 */
export type TaskSheetTone = 'parent' | 'child' | 'review' | 'paid' | 'wallet';

const HERO_GRADIENTS = {
  parent: [theme.colors.heroChildFrom, theme.colors.childDeep],
  child: [theme.colors.heroChildFrom, theme.colors.childDeep],
  review: [theme.colors.heroReviewFrom, theme.colors.heroReviewTo],
  paid: [theme.colors.heroPaidFrom, theme.colors.earnedDark],
  wallet: [theme.colors.heroWalletFrom, theme.colors.parentFrom],
} as const;

const SHADOWS = {
  parent: styles.shadowParent,
  child: styles.shadowChild,
  review: styles.shadowReview,
  paid: styles.shadowPaid,
  wallet: styles.shadowWallet,
};

type TaskSheetProps = {
  tone: TaskSheetTone;
  /** Аватар в шапке: ребёнок у родителя, автор задания у ребёнка. */
  avatar?: ImageSourcePropType;
  /** Значок вместо аватара (операция с картой). */
  icon?: IconName;
  /** Подпись над именем: «Task for», «Task from», «Done 5 min ago». */
  caption: string;
  name: string;
  /** Плашка справа в шапке: таймер или «On review». */
  aside?: ReactNode;
  title: string;
  /** Вместо названия — крупная сумма: «−$4.00». */
  amount?: boolean;
  /** Секции тела: прокручиваются, если не влезают. */
  children: ReactNode;
  /** Кнопки внизу карточки: всегда видны. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Высота растворения у кнопок (`styles.fade`). */
const FADE_HEIGHT = 28;

/**
 * Каркас крупной карточки задания (v3): цветная шапка с аватаром, именем,
 * плашкой и крупным названием; белое тело с секциями прокручивается и
 * растворяется у кнопок внизу.
 */
export function TaskSheet({
  tone,
  avatar,
  icon,
  caption,
  name,
  aside,
  title,
  amount,
  children,
  footer,
  style,
}: TaskSheetProps) {
  const dark = tone === 'review';
  // Секции, которые растут (комментарий), держат низ над кнопками: выше
  // растворения у края.
  const { scrollRef, viewportRef, onScroll, keepInView } =
    useKeepInView(FADE_HEIGHT);
  // Тело прокручено: текст уходит под шапку — сверху такое же растворение,
  // как у кнопок. В покое его нет, чтобы не глушить первую строку.
  const [scrolled, setScrolled] = useState(false);

  return (
    <View style={[styles.card, SHADOWS[tone], style]}>
      <LinearGradient
        colors={HERO_GRADIENTS[tone]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.from}>
          {icon ? (
            <View style={styles.heroIcon}>
              <Icon name={icon} size={20} color={theme.colors.white} />
            </View>
          ) : (
            avatar && <ApiImage source={avatar} style={styles.avatar} />
          )}
          <View style={styles.who}>
            <Text
              style={[styles.caption, dark && styles.captionDark]}
              numberOfLines={1}
            >
              {caption}
            </Text>
            <Text
              style={[styles.name, dark && styles.textDark]}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>
          {aside}
        </View>
        <Text
          style={[
            styles.title,
            amount && styles.titleAmount,
            dark && styles.textDark,
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>
      </LinearGradient>
      <View ref={viewportRef} style={styles.bodyWrap}>
        <ScrollView
          ref={scrollRef}
          onScroll={(event) => {
            onScroll(event);
            setScrolled(event.nativeEvent.contentOffset.y > 0);
          }}
          scrollEventThrottle={16}
          style={keepInViewScrollStyle}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          <KeepInViewContext.Provider value={keepInView}>
            {children}
          </KeepInViewContext.Provider>
        </ScrollView>
        {scrolled && (
          <LinearGradient
            colors={[theme.colors.white, withAlpha(theme.colors.white, 0)]}
            style={[styles.fade, styles.fadeTop]}
          />
        )}
        <LinearGradient
          colors={[withAlpha(theme.colors.white, 0), theme.colors.white]}
          style={styles.fade}
        />
      </View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

/** Полупрозрачная плашка в цветной шапке: иконка и короткая подпись. */
export function HeroPill({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.pill}>
      <Icon name={icon} size={16} color={theme.colors.white} />
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

/** Сколько осталось до конца задания. */
export const TimerPill = ({ ms }: { ms: number }) => (
  <HeroPill icon="clock" label={formatCountdown(ms)} />
);

/** «On review» с оранжевой точкой — светлая плашка в оранжевой шапке. */
export function ReviewPill({ label }: { label: string }) {
  return (
    <View style={[styles.pill, styles.pillLight]}>
      <View style={styles.dotRing}>
        <View style={styles.dot} />
      </View>
      <Text style={[styles.pillText, styles.pillTextReview]}>{label}</Text>
    </View>
  );
}

/** Заголовок секции капсом. */
export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

type RewardChipProps = {
  reward: number;
  /** Награда уже выплачена: зелёная плашка «+$4». */
  paid?: boolean;
};

/** Плашка награды с монетой: золотая «$5» или зелёная выплаченная «+$4». */
export function RewardChip({ reward, paid }: RewardChipProps) {
  const value = formatRewardShort(reward);
  if (paid) {
    return (
      <View style={[styles.rewardChip, styles.rewardChipPaid]}>
        <Icon name="coin" size={24} color={theme.colors.yellow} />
        <Text style={[styles.rewardChipValue, styles.rewardChipValuePaid]}>
          +{value}
        </Text>
      </View>
    );
  }
  return (
    <LinearGradient
      colors={[theme.colors.rewardChipFrom, theme.colors.rewardChipTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.rewardChip}
    >
      <Icon name="coin" size={24} color={theme.colors.yellow} />
      <Text style={styles.rewardChipValue}>{value}</Text>
    </LinearGradient>
  );
}

type TaskBriefProps = RewardChipProps & {
  label: string;
  description: string;
};

/** «What to do»: заголовок с наградой справа и описание задания. */
export function TaskBrief({
  label,
  reward,
  paid,
  description,
}: TaskBriefProps) {
  return (
    <View style={styles.brief}>
      <View style={styles.briefHead}>
        <SectionLabel>{label}</SectionLabel>
        <RewardChip reward={reward} paid={paid} />
      </View>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

export type InfoTileProps = {
  icon: IconName;
  /** Цвет иконки; фон плитки — тот же цвет, но бледный. */
  tone: 'warm' | 'cool' | 'green';
  label: string;
  value: string;
};

const TILE_TONES = {
  warm: { bg: theme.colors.dueTile, ink: theme.colors.dueInk },
  cool: { bg: theme.colors.givenTile, ink: theme.colors.childDeep },
  green: { bg: theme.colors.readySoft, ink: theme.colors.readyText },
};

/** Пара плиток «когда»: срок и когда выдано / создано. */
export function InfoTiles({ tiles }: { tiles: readonly InfoTileProps[] }) {
  return (
    <View style={styles.tiles}>
      {tiles.map(({ icon, tone, label, value }) => (
        <View
          key={label}
          style={[styles.tile, { backgroundColor: TILE_TONES[tone].bg }]}
        >
          <View style={styles.tileIcon}>
            <Icon name={icon} size={16} color={TILE_TONES[tone].ink} />
          </View>
          <View style={styles.tileText}>
            <Text style={styles.tileLabel} numberOfLines={2}>
              {label}
            </Text>
            <Text style={styles.tileValue} numberOfLines={1}>
              {value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

type PhotoSectionProps = {
  label: string;
  /** Фото отчёта; несколько — листаются со счётчиком «1 / 3». */
  photos: readonly ImageSourcePropType[];
  /** Высота снимка; меньше — когда в карточке много других секций. */
  height?: number;
};

/** Фото-отчёт: заголовок и снимок (или листаемые снимки) на всю ширину. */
export function PhotoSection({
  label,
  photos,
  height = PHOTO_HEIGHT,
}: PhotoSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.photoHead}>
        <SectionLabel>{label}</SectionLabel>
      </View>
      {photos.length > 1 ? (
        <View style={styles.photoCarousel}>
          <PhotoCarousel photos={photos} height={height} />
        </View>
      ) : (
        <ApiImage
          source={photos[0]}
          style={[styles.photo, { height }]}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

const PHOTO_HEIGHT = 200;
