import type { ReactNode } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { formatTimeAgo, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, PhotoCarousel } from '@shared/ui';
import { storeUrl, type WishProgress, type WishStatus } from '../model';
import { styles } from './wish-details.styled';

type WishDetailsProps = WishProgress & {
  /** Место в вишлисте (с 1): «#3 in queue». */
  position: number;
  /** Подпись над описанием: «My note» у ребёнка, «Emma's note» у родителя. */
  noteLabel: string;
  /**
   * В блоке без фото, справа от иконки: плитки камеры и галереи у ребёнка.
   * Без них блок — только подарок по центру, без подписи.
   */
  noPhotosActions?: ReactNode;
  /** Подсказка под блоком без фото. */
  noPhotosHint?: string;
  /** Внизу карточки: Ask parent to buy у готового желания. */
  footer?: ReactNode;
};

const CHIPS: Record<WishStatus, { bg: string; text: string }> = {
  ready: { bg: theme.colors.readySoft, text: theme.colors.readyText },
  current: { bg: theme.colors.childChip, text: theme.colors.childDeep },
  waiting: { bg: theme.colors.waitingIconBg, text: theme.colors.inkSoft },
};

const FILLS = {
  ready: [theme.colors.earned, theme.colors.readyText],
  current: [theme.colors.childFrom, theme.colors.childDeep],
} as const;

/**
 * Карточка желания — общая для ребёнка и родителя: фото (листаются) или
 * блок «No photos yet», название и цена, сколько накоплено или место в
 * очереди, заметка ребёнка и ссылка на магазин.
 */
export function WishDetails({
  wish,
  status,
  saved,
  position,
  noteLabel,
  noPhotosActions,
  noPhotosHint,
  footer,
}: WishDetailsProps) {
  const { t } = useTranslation();
  const now = useNow();
  const chip = CHIPS[status];
  const progress = wish.price > 0 ? Math.min(saved / wish.price, 1) : 1;

  return (
    <View style={styles.root}>
      {wish.photos.length > 0 ? (
        <PhotoCarousel photos={wish.photos} />
      ) : noPhotosActions ? (
        <View style={styles.noPhotos}>
          <Text style={styles.noPhotosTitle}>{t('wishCard.noPhotos')}</Text>
          <View style={styles.noPhotosRow}>
            <WishTile />
            {noPhotosActions}
          </View>
          {noPhotosHint && <Text style={styles.added}>{noPhotosHint}</Text>}
        </View>
      ) : (
        // Добавить фото нельзя (смотрит родитель): только подарок по центру.
        <View style={[styles.noPhotos, styles.noPhotosEmpty]}>
          <WishTile />
        </View>
      )}

      <View style={styles.head}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{wish.title}</Text>
          <Text style={[styles.price, status === 'ready' && styles.priceReady]}>
            ${wish.price}
          </Text>
        </View>
        {status === 'waiting' ? (
          <View style={styles.meta}>
            <StatusChip label={t('wishCard.inQueue', { position })} {...chip} />
            <Text style={styles.added}>
              {t('wishCard.added', {
                ago: formatTimeAgo(new Date(wish.createdAt), now),
              })}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.track}>
              <LinearGradient
                colors={FILLS[status]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                locations={[0, 0.7071]}
                style={[styles.fill, { width: `${progress * 100}%` }]}
              />
            </View>
            <View style={styles.progressText}>
              <Text
                style={[styles.saved, status === 'ready' && styles.savedReady]}
              >
                {t('wishlist.savedOf', { saved, price: wish.price })}
              </Text>
              <StatusChip
                label={
                  status === 'ready'
                    ? t('wishlist.readyChip')
                    : t('wishCard.filling')
                }
                {...chip}
              />
            </View>
          </>
        )}
      </View>

      {!!wish.description && (
        <View style={styles.note}>
          <LinearGradient
            colors={[theme.colors.childTint, theme.colors.childTintLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.7071]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.noteLabel}>
            <Icon name="note" size={16} color={theme.colors.childDeep} />
            <Text style={styles.noteLabelText}>{noteLabel}</Text>
          </View>
          <Text style={styles.noteText}>{wish.description}</Text>
        </View>
      )}

      {!!wish.link && (
        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL(storeUrl(wish.link))}
          style={({ pressed }) => [styles.store, pressed && styles.pressed]}
        >
          <View style={styles.storeIcon}>
            <Icon name="link" size={20} color={theme.colors.violet} />
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeTitle}>{t('wishCard.openStore')}</Text>
            <Text style={styles.storeUrl} numberOfLines={1}>
              {wish.link}
            </Text>
          </View>
          <Icon name="external" size={18} color={theme.colors.grey} />
        </Pressable>
      )}

      {footer}
    </View>
  );
}

function WishTile() {
  return (
    <LinearGradient
      colors={[theme.colors.childTo, theme.colors.childFrom]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.7071]}
      style={styles.wishTile}
    >
      <Icon name="gift" size={30} color={theme.colors.white} />
    </LinearGradient>
  );
}

type StatusChipProps = { label: string; bg: string; text: string };

function StatusChip({ label, bg, text }: StatusChipProps) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipText, { color: text }]}>{label}</Text>
    </View>
  );
}
