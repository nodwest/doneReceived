import { Pressable, ScrollView, Text, View } from 'react-native';
import { WISH_PHOTOS_MAX, type WishPhotoDraft } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { choosePhotos, type PickedPhoto, type PhotoSource } from '@shared/lib';
import { theme } from '@shared/theme';
import { ApiImage, Icon, SourceTile } from '@shared/ui';
import { styles } from './wish-form-sheet.styled';

type PhotoPickerProps = {
  photos: readonly WishPhotoDraft[];
  onAdd: (photos: PickedPhoto[]) => void;
  onRemove: (index: number) => void;
};

/**
 * Фото желания: выбранные с крестиком и плитки камеры и галереи (пока фото
 * меньше WISH_PHOTOS_MAX). Новые фото уменьшаются до загрузки.
 */
export function PhotoPicker({ photos, onAdd, onRemove }: PhotoPickerProps) {
  const { t } = useTranslation();
  const left = WISH_PHOTOS_MAX - photos.length;
  const pick = async (source: PhotoSource) =>
    onAdd(await choosePhotos(source, left));

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{t('wishForm.photo')}</Text>
      {/* Фото много — ряд листается вбок. */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photos}
        style={styles.photosScroll}
      >
        {photos.map((photo, index) => (
          // Фото не переставляются, только убираются: индекс годится в ключ.
          <View key={index}>
            <ApiImage source={photo.source} style={styles.photo} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('wishForm.removePhoto')}
              hitSlop={8}
              onPress={() => onRemove(index)}
              style={styles.remove}
            >
              <Icon name="close" size={8} color={theme.colors.white} />
            </Pressable>
          </View>
        ))}
        {left > 0 && (
          <>
            <SourceTile
              icon="camera-outline"
              accessibilityLabel={t('taskCard.takePhoto')}
              onPress={() => pick('camera')}
            />
            <SourceTile
              icon="image-add"
              accessibilityLabel={t('taskCard.addFromGallery')}
              onPress={() => pick('library')}
            />
          </>
        )}
      </ScrollView>
      <Text style={styles.hint}>
        {photos.length === 0
          ? t('wishForm.photoHint')
          : t('wishForm.photoLimit', { max: WISH_PHOTOS_MAX })}
      </Text>
    </View>
  );
}
