import type { ReactNode } from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, type IconName } from '@shared/ui';
import { formatCountdown, withAlpha } from '@shared/lib';
import { theme } from '@shared/theme';
import { formatRewardShort } from '../model';
import { styles } from './task-sheet.styled';

/** parent — фиолетовая шапка, child — голубая, review — оранжевая «на проверке». */
export type TaskSheetTone = 'parent' | 'child' | 'review';

const HERO_GRADIENTS = {
  parent: [theme.colors.heroParentFrom, theme.colors.heroParentTo],
  child: [theme.colors.heroChildFrom, theme.colors.childDeep],
  review: [theme.colors.heroReviewFrom, theme.colors.heroReviewTo],
} as const;

const SHADOWS = {
  parent: styles.shadowParent,
  child: styles.shadowChild,
  review: styles.shadowReview,
};

type TaskSheetProps = {
  tone: TaskSheetTone;
  /** Аватар в шапке: ребёнок у родителя, автор задания у ребёнка. */
  avatar: ImageSourcePropType;
  /** Подпись над именем: «Task for», «Task from», «Done 5 min ago». */
  caption: string;
  name: string;
  /** Плашка справа в шапке: таймер или «On review». */
  aside?: ReactNode;
  title: string;
  /** Секции тела: прокручиваются, если не влезают. */
  children: ReactNode;
  /** Кнопки внизу карточки: всегда видны. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Каркас крупной карточки задания (v3): цветная шапка с аватаром, именем,
 * плашкой и крупным названием; белое тело с секциями прокручивается и
 * растворяется у кнопок внизу.
 */
export function TaskSheet({
  tone,
  avatar,
  caption,
  name,
  aside,
  title,
  children,
  footer,
  style,
}: TaskSheetProps) {
  const dark = tone === 'review';

  return (
    <View style={[styles.card, SHADOWS[tone], style]}>
      <LinearGradient
        colors={HERO_GRADIENTS[tone]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.from}>
          <Image source={avatar} style={styles.avatar} />
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
        <Text style={[styles.title, dark && styles.textDark]} numberOfLines={2}>
          {title}
        </Text>
      </LinearGradient>
      <View style={styles.bodyWrap}>
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        <LinearGradient
          colors={[withAlpha(theme.colors.white, 0), theme.colors.white]}
          style={styles.fade}
        />
      </View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </View>
  );
}

/** Сколько осталось до конца задания — полупрозрачная плашка в шапке. */
export function TimerPill({ ms }: { ms: number }) {
  return (
    <View style={styles.pill}>
      <Icon name="clock" size={16} color={theme.colors.white} />
      <Text style={styles.pillText}>{formatCountdown(ms)}</Text>
    </View>
  );
}

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

/** Золотая плашка награды с монетой: «$5». */
export function RewardChip({ reward }: { reward: number }) {
  return (
    <LinearGradient
      colors={[theme.colors.rewardChipFrom, theme.colors.rewardChipTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.rewardChip}
    >
      <Icon name="coin" size={24} color={theme.colors.yellow} />
      <Text style={styles.rewardChipValue}>{formatRewardShort(reward)}</Text>
    </LinearGradient>
  );
}

type TaskBriefProps = {
  label: string;
  reward: number;
  description: string;
};

/** «What to do»: заголовок с наградой справа и описание задания. */
export function TaskBrief({ label, reward, description }: TaskBriefProps) {
  return (
    <View style={styles.brief}>
      <View style={styles.briefHead}>
        <SectionLabel>{label}</SectionLabel>
        <RewardChip reward={reward} />
      </View>
      {!!description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

export type InfoTileProps = {
  icon: IconName;
  /** Цвет иконки; фон плитки — тот же цвет, но бледный. */
  tone: 'warm' | 'cool';
  label: string;
  value: string;
};

const TILE_TONES = {
  warm: { bg: theme.colors.dueTile, ink: theme.colors.dueInk },
  cool: { bg: theme.colors.givenTile, ink: theme.colors.childDeep },
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
  photo: ImageSourcePropType;
  /** «1 / 1» справа от заголовка. */
  counter?: string;
};

/** Фото-отчёт: заголовок и снимок на всю ширину. */
export function PhotoSection({ label, photo, counter }: PhotoSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.photoHead}>
        <SectionLabel>{label}</SectionLabel>
        {counter && <Text style={styles.photoCounter}>{counter}</Text>}
      </View>
      <Image source={photo} style={styles.photo} resizeMode="cover" />
    </View>
  );
}

type StatusStepsProps = {
  label: string;
  steps: readonly string[];
  /** Номер текущего шага, с 0. */
  current: number;
};

/** Где сейчас задание: Active → On review → Paid. */
export function StatusSteps({ label, steps, current }: StatusStepsProps) {
  return (
    <View style={styles.section}>
      <SectionLabel>{label}</SectionLabel>
      <View style={styles.stepper}>
        <View style={styles.stepDots}>
          {steps.map((step, i) => (
            <StepDot key={step} index={i} current={current} />
          ))}
        </View>
        <View style={styles.stepLabels}>
          {steps.map((step, i) => (
            <Text
              key={step}
              style={[
                styles.stepLabel,
                i === current && styles.stepLabelCurrent,
              ]}
            >
              {step}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function StepDot({ index, current }: { index: number; current: number }) {
  return (
    <>
      {index > 0 && <View style={styles.stepBar} />}
      {index === current ? (
        <LinearGradient
          colors={[theme.colors.heroParentFrom, theme.colors.heroParentTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.stepDot, styles.stepDotCurrent]}
        >
          <View style={styles.stepDotInner} />
        </LinearGradient>
      ) : (
        <View style={styles.stepDot} />
      )}
    </>
  );
}
