import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CHILD_NAME_MAX_LENGTH } from '@entities/family';
import { useTranslation } from '@shared/i18n';
import {
  choosePhotos,
  showToast,
  type PhotoSource,
  type PickedPhoto,
} from '@shared/lib';
import { theme } from '@shared/theme';
import {
  ApiImage,
  BottomSheet,
  Icon,
  SheetField,
  SourceTile,
} from '@shared/ui';
import { useCreateChild } from '../model/use-create-child';
import { styles } from './add-child-sheet.styled';

type AddChildSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Профиль создан — шторку закрывает страница или виджет. */
  onCreated: () => void;
};

/**
 * Шторка New child: имя ребёнка и фото (камера или галерея) —
 * Create profile создаёт профиль в семье на сервере, без устройства.
 * Устройство подключают потом кодом из карточки ребёнка.
 */
export function AddChildSheet({
  visible,
  onClose,
  onCreated,
}: AddChildSheetProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<PickedPhoto | null>(null);
  const createChild = useCreateChild();
  const trimmed = name.trim();
  const disabled = !trimmed || createChild.isPending;

  // Шторку закрыли (крестиком, мимо или профиль создан) — следующее
  // открытие с пустого поля.
  const close = () => {
    setName('');
    setPhoto(null);
    onClose();
  };

  const pick = async (source: PhotoSource) => {
    const [picked] = await choosePhotos(source);
    if (picked) setPhoto(picked);
  };

  const submit = () => {
    if (disabled) return;
    createChild.mutate(
      { name: trimmed, photo },
      {
        onSuccess: ({ child, avatarError }) => {
          showToast(
            avatarError
              ? t('newChild.createdNoPhoto', { name: child.displayName })
              : t('newChild.created', { name: child.displayName }),
          );
          setName('');
          setPhoto(null);
          onCreated();
        },
        onError: () => showToast(t('newChild.failed')),
      },
    );
  };

  return (
    <BottomSheet visible={visible} onClose={close} maxHeightRatio={0.94}>
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t('newChild.title')}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            onPress={close}
            style={styles.close}
          >
            <Icon name="close" size={14} color={theme.colors.ink} />
          </Pressable>
        </View>
        <SheetField
          label={t('newChild.name')}
          value={name}
          onChangeText={setName}
          placeholder={t('newChild.namePlaceholder')}
          maxLength={CHILD_NAME_MAX_LENGTH}
          autoCapitalize="words"
          autoComplete="off"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <View style={styles.field}>
          <Text style={styles.label}>{t('newChild.photo')}</Text>
          <View style={styles.photos}>
            {photo ? (
              <View>
                <ApiImage source={{ uri: photo.uri }} style={styles.avatar} />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={t('wishForm.removePhoto')}
                  hitSlop={8}
                  onPress={() => setPhoto(null)}
                  style={styles.remove}
                >
                  <Icon name="close" size={8} color={theme.colors.white} />
                </Pressable>
              </View>
            ) : (
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
          </View>
          <Text style={styles.hint}>{t('newChild.photoHint')}</Text>
        </View>
        <View style={styles.next}>
          <LinearGradient
            colors={[theme.colors.childTint, theme.colors.childTintLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 0.7071]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.nextTitle}>{t('newChild.nextTitle')}</Text>
          <Text style={styles.nextHint}>
            {trimmed
              ? t('newChild.nextHint', { name: trimmed })
              : t('newChild.nextHintNoName')}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={submit}
          style={({ pressed }) => [
            styles.button,
            disabled && styles.buttonDisabled,
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
          <Icon name="plus" size={16} color={theme.colors.white} />
          <Text style={styles.buttonLabel}>{t('newChild.create')}</Text>
        </Pressable>
      </ScrollView>
    </BottomSheet>
  );
}
