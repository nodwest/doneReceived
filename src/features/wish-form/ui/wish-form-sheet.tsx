import { useLayoutEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Wish } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { BottomSheet, Icon, Toggle } from '@shared/ui';
import { useCreateWish } from '../model/use-create-wish';
import { useUpdateWish } from '../model/use-update-wish';
import { useWishForm } from '../model/use-wish-form';
import { PhotoPicker } from './photo-picker';
import { WishField } from './wish-field';
import { styles } from './wish-form-sheet.styled';

type WishFormSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Желание для правки (Edit wish); без него шторка создаёт новое (New wish). */
  wish?: Wish;
  /**
   * Место в списке (с 1): у правки — где желание сейчас («Now #3»), у
   * нового — куда оно встанет без «top» («the end of the list (#5)»).
   */
  position: number;
  /** Delete wish в режиме правки; удаление делает страница. */
  onDelete?: () => void;
};

/**
 * Шторка желания — одна для New wish и Edit wish: название, цена, фото,
 * описание, ссылка и «Make it my top wish». Без «top» новое желание встаёт в
 * конец списка, а правленое остаётся на своём месте.
 */
export function WishFormSheet({
  visible,
  onClose,
  wish,
  position,
  onDelete,
}: WishFormSheetProps) {
  const { t } = useTranslation();
  const form = useWishForm();
  const createWish = useCreateWish();
  const updateWish = useUpdateWish();
  const editing = wish !== undefined;
  const pending = createWish.isPending || updateWish.isPending;
  const { title, price, description, link, photos, top } = form.fields;

  // Каждое открытие — с данными желания или с чистого листа, до отрисовки.
  useLayoutEffect(() => {
    if (visible) form.reset(wish);
    // form.reset пересоздаётся каждый рендер; заполняем только при открытии.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, wish]);

  const submit = () => {
    if (!form.valid || pending) return;
    const done = (message: string) => () => {
      showToast(message);
      onClose();
    };
    if (wish) {
      updateWish.mutate(
        { id: wish.id, ...form.payload() },
        { onSuccess: done(t('wishForm.savedToast')) },
      );
    } else {
      createWish.mutate(form.payload(), {
        onSuccess: done(t('wishForm.addedToast')),
      });
    }
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeightRatio={0.94}>
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {editing ? t('wishForm.editTitle') : t('wishForm.newTitle')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            onPress={onClose}
            style={styles.close}
          >
            <Icon name="close" size={14} color={theme.colors.ink} />
          </Pressable>
        </View>
        <WishField
          label={t('wishForm.what')}
          value={title}
          onChangeText={form.setTitle}
          placeholder={t('wishForm.whatPlaceholder')}
          returnKeyType="next"
        />
        <WishField
          label={t('wishForm.price')}
          value={price}
          onChangeText={form.setPrice}
          placeholder="0"
          keyboardType="number-pad"
          prefix={<Text style={styles.currency}>$</Text>}
        />
        <PhotoPicker photos={photos} onRemove={form.removePhoto} />
        <WishField
          label={t('wishForm.description')}
          value={description}
          onChangeText={form.setDescription}
          placeholder={t('wishForm.descriptionPlaceholder')}
          multiline
        />
        <WishField
          label={t('wishForm.link')}
          value={link}
          onChangeText={form.setLink}
          placeholder={t('wishForm.linkPlaceholder')}
          autoCapitalize="none"
          keyboardType="url"
          prefix={
            <Icon name="link" size={18} color={theme.colors.placeholderSoft} />
          }
        />
        <View style={styles.topWish}>
          <LinearGradient
            colors={[theme.colors.childTint, theme.colors.childTintLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.7071]}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.topWishText}>
            <Text style={styles.topWishTitle}>{t('wishForm.top')}</Text>
            <Text style={styles.topWishHint}>
              {editing
                ? t('wishForm.topNow', { position })
                : t('wishForm.topOtherwise', { position })}
            </Text>
          </View>
          <Toggle
            value={top}
            onValueChange={form.setTop}
            accessibilityLabel={t('wishForm.top')}
          />
        </View>
        {editing && onDelete && (
          <Pressable
            accessibilityRole="button"
            onPress={onDelete}
            style={({ pressed }) => [
              styles.button,
              styles.delete,
              pressed && styles.pressed,
            ]}
          >
            <Icon name="trash" size={18} color={theme.colors.dangerText} />
            <Text style={[styles.buttonLabel, styles.deleteLabel]}>
              {t('wishForm.delete')}
            </Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !form.valid || pending }}
          disabled={!form.valid || pending}
          onPress={submit}
          style={({ pressed }) => [
            styles.button,
            (!form.valid || pending) && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}
        >
          <LinearGradient
            colors={[theme.colors.childFrom, theme.colors.childDeep]}
            start={{ x: 0.4, y: 0 }}
            end={{ x: 0.6, y: 1 }}
            locations={[0, 0.7071]}
            style={StyleSheet.absoluteFill}
          />
          {!editing && (
            <Icon name="plus" size={16} color={theme.colors.white} />
          )}
          <Text style={styles.buttonLabel}>
            {editing ? t('wishForm.save') : t('wishForm.add')}
          </Text>
        </Pressable>
      </ScrollView>
    </BottomSheet>
  );
}
