import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon, SourceTile } from '@shared/ui';
import { styles } from './wish-form-sheet.styled';

type PhotoPickerProps = {
  photos: readonly ImageSourcePropType[];
  onRemove: (index: number) => void;
};

/**
 * Фото желания: выбранные с крестиком и плитки камеры и галереи. Снимать и
 * выбирать фото пока нельзя — плитки показывают тост; убрать фото можно.
 */
export function PhotoPicker({ photos, onRemove }: PhotoPickerProps) {
  const { t } = useTranslation();
  const soon = () => showToast(t('wishForm.photoSoon'));

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
            <Image source={photo} style={styles.photo} />
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
        <SourceTile
          icon="camera-outline"
          accessibilityLabel={t('taskCard.takePhoto')}
          onPress={soon}
        />
        <SourceTile
          icon="image-add"
          accessibilityLabel={t('taskCard.addFromGallery')}
          onPress={soon}
        />
      </ScrollView>
      {photos.length === 0 && (
        <Text style={styles.hint}>{t('wishForm.photoHint')}</Text>
      )}
    </View>
  );
}
