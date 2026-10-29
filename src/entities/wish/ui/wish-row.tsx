import type { ReactNode } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { WishProgress } from '../model';
import { styles } from './wish-row.styled';

type WishRowProps = WishProgress & {
  /** Справа от строки: ручка перетаскивания. */
  aside?: ReactNode;
  /** Под строкой: кнопка у готового желания (Ask parent to buy). */
  action?: ReactNode;
  /** Строку сейчас перетаскивают: тень сильнее. */
  lifted?: boolean;
  /** Тап по строке (не по ручке и не по кнопке) — открыть желание. */
  onPress?: () => void;
  /** Карточка: например, растянуть на высоту слота карусели. */
  style?: StyleProp<ViewStyle>;
};

// Подложка строки: зелёная у готового, голубая у наполняемого.
const TINTS = {
  ready: [theme.colors.readyTint, theme.colors.readyTintLight],
  current: [theme.colors.childTint, theme.colors.childTintLight],
} as const;

const FILLS = {
  ready: [theme.colors.earned, theme.colors.readyText],
  current: [theme.colors.childFrom, theme.colors.childDeep],
} as const;

/**
 * Желание в вишлисте: фото или иконка, название, цена и сколько накоплено.
 * Готовое — зелёное с «Ready to buy», наполняемое — голубое с «$27 of $45»,
 * ждущее — серое с пустой полосой.
 */
export function WishRow({
  wish,
  status,
  saved,
  aside,
  action,
  lifted,
  onPress,
  style,
}: WishRowProps) {
  const { t } = useTranslation();
  const waiting = status === 'waiting';
  const progress = wish.price > 0 ? Math.min(saved / wish.price, 1) : 1;

  return (
    <View
      style={[
        styles.card,
        status === 'ready' && styles.cardReady,
        status === 'current' && styles.cardCurrent,
        lifted && styles.cardLifted,
        style,
      ]}
    >
      {!waiting && (
        <LinearGradient
          colors={TINTS[status]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View style={styles.row}>
        {/* Нажимается фото и текст: ручка и кнопка — соседние, не вложенные
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
                style={[styles.title, waiting && styles.textWaiting]}
                numberOfLines={1}
              >
                {wish.title}
              </Text>
              <Text style={[styles.price, waiting && styles.textWaiting]}>
                ${wish.price}
              </Text>
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
            {status === 'ready' && (
              <View style={styles.chip}>
                <Text style={styles.chipText}>{t('wishlist.readyChip')}</Text>
              </View>
            )}
            {status === 'current' && (
              <Text style={styles.saved}>
                {t('wishlist.savedOf', { saved, price: wish.price })}
              </Text>
            )}
          </View>
        </Pressable>
        {aside}
      </View>
      {action}
    </View>
  );
}

/** Фото желания, а без фото — иконка в цвете статуса. */
export function WishThumb({
  wish,
  status,
}: Pick<WishProgress, 'wish' | 'status'>) {
  const [photo] = wish.photos;
  if (photo) return <Image source={photo} style={styles.photo} />;
  if (status === 'current') {
    return (
      <LinearGradient
        colors={[theme.colors.childTo, theme.colors.childFrom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.7071]}
        style={styles.icon}
      >
        <Icon name="gift" size={22} color={theme.colors.white} />
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
        size={22}
        color={status === 'ready' ? theme.colors.readyText : theme.colors.grey}
      />
    </View>
  );
}
