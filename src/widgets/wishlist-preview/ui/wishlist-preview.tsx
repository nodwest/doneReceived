import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { WishProgress } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './wishlist-preview.styled';

type WishlistPreviewProps = {
  /** Сколько желаний уже можно купить: зелёный чип «1 ready to buy». */
  readyCount: number;
  /** Желание, которое наполняется сейчас; null — все готовы или список пуст. */
  current: WishProgress | null;
  onPress: () => void;
};

/**
 * Плитка вишлиста на главной и в Wallet ребёнка: текущее желание с полосой
 * накопленного и сколько желаний уже готово к покупке. Тап — вишлист.
 */
export function WishlistPreview({
  readyCount,
  current,
  onPress,
}: WishlistPreviewProps) {
  const { t } = useTranslation();
  const progress = current
    ? Math.min(current.saved / current.wish.price, 1)
    : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('wishlist.myWishlist')}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[theme.colors.childTint, theme.colors.childTintLight]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[theme.colors.childTo, theme.colors.childFrom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.7071]}
        style={styles.icon}
      >
        <Icon name="gift" size={22} color={theme.colors.white} />
      </LinearGradient>
      <View style={styles.info}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{t('wishlist.myWishlist')}</Text>
          {readyCount > 0 && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {t('wishlist.readyToBuy', { count: readyCount })}
              </Text>
            </View>
          )}
        </View>
        {current ? (
          <>
            <View style={styles.head}>
              <Text style={styles.title} numberOfLines={1}>
                {current.wish.title}
              </Text>
              <Text style={styles.price}>${current.wish.price}</Text>
            </View>
            <View style={styles.track}>
              <LinearGradient
                colors={[theme.colors.childFrom, theme.colors.childDeep]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                locations={[0, 0.7071]}
                style={[styles.fill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.saved}>
              {t('wishlist.savedOf', {
                saved: current.saved,
                price: current.wish.price,
              })}
            </Text>
          </>
        ) : (
          <Text style={styles.title}>
            {readyCount > 0 ? t('wishlist.allReady') : t('wishlist.empty')}
          </Text>
        )}
      </View>
      <Icon name="chevron-right" size={16} color={theme.colors.grey} />
    </Pressable>
  );
}
