import { useState, type ReactNode } from 'react';
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon, ApiImage } from '@shared/ui';
import type { WishProgress } from '../model';
import { styles } from './wish-row.styled';

type WishRowProps = WishProgress & {
  /** Справа от строки: ручка перетаскивания. */
  aside?: ReactNode;
  /** Вместо чипа статуса: пилюля Ask to buy у готового желания. */
  action?: ReactNode;
  /** Строку сейчас перетаскивают: тень сильнее. */
  lifted?: boolean;
  /** Тап по строке (не по ручке и не по кнопке) — открыть желание. */
  onPress?: () => void;
  /** Карточка: например, растянуть на высоту слота карусели. */
  style?: StyleProp<ViewStyle>;
};

const FILLS = {
  ready: [theme.colors.earned, theme.colors.readyText],
  current: [theme.colors.childFrom, theme.colors.childDeep],
} as const;

/**
 * Желание в вишлисте: фото или иконка, название с чипом, полоса и строка
 * «сколько накоплено — сколько осталось». Все строки одной высоты.
 * Готовое — зелёное (Ready to buy или Ask to buy), наполняемое — голубое
 * («60%», «$18 to go»), ждущее — индиго («#3 in queue», «Starts after …»).
 */
export function WishRow({
  wish,
  status,
  saved,
  position,
  after,
  aside,
  action,
  lifted,
  onPress,
  style,
}: WishRowProps) {
  const { t } = useTranslation();
  // Ширина кнопки в шапке: столько места не занимает название.
  const [actionWidth, setActionWidth] = useState(0);
  const waiting = status === 'waiting';
  const progress = wish.price > 0 ? Math.min(saved / wish.price, 1) : 1;

  const chip =
    status === 'ready'
      ? t('wishlist.readyChip')
      : status === 'current'
        ? `${Math.round(progress * 100)}%`
        : t('wishCard.inQueue', { position });
  const left = waiting
    ? t('wishlist.goal', { price: wish.price })
    : t('wishlist.savedOf', { saved, price: wish.price });
  const right =
    status === 'ready'
      ? t('wishlist.fullySaved')
      : status === 'current'
        ? t('wishlist.toGo', { amount: wish.price - saved })
        : after && t('wishlist.startsAfter', { title: after });

  return (
    <View style={[styles.card, styles[status], lifted && styles.lifted, style]}>
      <View style={styles.body}>
        {/* Нажимается фото и текст: кнопка и ручка — соседние, не вложенные
            (на вебе кнопка внутри кнопки — невалидный HTML). */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={wish.title}
          disabled={!onPress}
          onPress={onPress}
          style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        >
          <WishThumb {...{ wish, status }} />
          <View style={styles.info}>
            <View style={styles.head}>
              <Text
                style={[
                  styles.title,
                  action ? { marginRight: actionWidth } : null,
                ]}
                numberOfLines={1}
              >
                {wish.title}
              </Text>
              {!action && (
                <View style={[styles.chip, styles[`${status}Chip`]]}>
                  <Text style={[styles.chipText, styles[`${status}Text`]]}>
                    {chip}
                  </Text>
                </View>
              )}
            </View>
            <View style={[styles.track, waiting && styles.trackWaiting]}>
              {!waiting && progress > 0 && (
                <LinearGradient
                  colors={FILLS[status]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  locations={[0, 0.7071]}
                  style={[styles.fill, { width: `${progress * 100}%` }]}
                />
              )}
            </View>
            <View style={styles.meta}>
              <Text
                style={[styles.amount, !waiting && styles[`${status}Text`]]}
              >
                {left}
              </Text>
              {right && (
                <View style={styles.note}>
                  <Text
                    style={[
                      styles.noteText,
                      status === 'ready' && styles.readyText,
                      waiting && styles.noteWaiting,
                    ]}
                    numberOfLines={1}
                  >
                    {right}
                  </Text>
                  {status === 'ready' && (
                    <Icon
                      name="check"
                      size={12}
                      color={theme.colors.readyText}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        </Pressable>
        {action && (
          <View
            style={styles.action}
            onLayout={(event) =>
              setActionWidth(event.nativeEvent.layout.width + 8)
            }
          >
            {action}
          </View>
        )}
      </View>
      {aside}
    </View>
  );
}

/** Фото желания, а без фото — иконка в цвете статуса. */
export function WishThumb({
  wish,
  status,
}: Pick<WishProgress, 'wish' | 'status'>) {
  const [photo] = wish.photos;
  if (photo) return <ApiImage source={photo} style={styles.photo} />;
  if (status === 'current') {
    return (
      <LinearGradient
        colors={[theme.colors.childTo, theme.colors.childFrom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.7071]}
        style={styles.icon}
      >
        <Icon name="gift" size={26} color={theme.colors.white} />
      </LinearGradient>
    );
  }
  return (
    <View
      style={[
        styles.icon,
        status === 'ready' ? styles.iconReady : styles.iconWaiting,
      ]}
    >
      <Icon
        name={status === 'ready' ? 'bag-check' : 'gift'}
        size={26}
        color={
          status === 'ready' ? theme.colors.readyText : theme.colors.queueText
        }
      />
    </View>
  );
}
