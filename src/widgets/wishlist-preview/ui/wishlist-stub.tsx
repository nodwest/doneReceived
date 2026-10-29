import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './wishlist-stub.styled';

type WishlistStubProps = {
  readyToBuy: number;
  top: { title: string; price: number; saved: number };
};

/**
 * ЗАГЛУШКА плитки вишлиста (главная и Wallet ребёнка): верхнее желание и сколько
 * уже накоплено. Тап пока только показывает тост — вишлист сделаем позже.
 */
export function WishlistStub({ readyToBuy, top }: WishlistStubProps) {
  const { t } = useTranslation();
  const progress = Math.min(top.saved / top.price, 1);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('wishlist.title')}
      onPress={() => showToast(t('wishlist.soon'))}
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
          <Text style={styles.label}>{t('wishlist.title')}</Text>
          {readyToBuy > 0 && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {t('wishlist.readyToBuy', { count: readyToBuy })}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.head}>
          <Text style={styles.title} numberOfLines={1}>
            {top.title}
          </Text>
          <Text style={styles.price}>${top.price}</Text>
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
          {t('wishlist.savedOf', { saved: top.saved, price: top.price })}
        </Text>
      </View>
      <Icon name="chevron-right" size={16} color={theme.colors.grey} />
    </Pressable>
  );
}
