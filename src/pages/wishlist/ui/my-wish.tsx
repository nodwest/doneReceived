import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useDeleteWish } from '@features/delete-wish';
import { useUpdateWish, WishFormSheet } from '@features/wish-form';
import { TabScreen } from '@widgets/bottom-nav';
import { useMyChildBalance, useMyWishlistOwner } from '@features/family-tasks';
import {
  useWishlistProgress,
  WISH_PHOTOS_MAX,
  WishDetails,
  WishPhotosError,
} from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import {
  choosePhotos,
  photoUploadError,
  showToast,
  type PhotoSource,
} from '@shared/lib';
import { RoundButton, ScreenHeader, SourceTile } from '@shared/ui';
import { styles } from './my-wish.styled';

/**
 * Карточка своего желания у ребёнка (`/wishlist/[id]`, тап по желанию в
 * вишлисте): фото, накопленное, заметка, ссылка. Карандаш открывает Edit
 * wish, готовое желание можно попросить купить.
 */
export function MyWishPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  // Баланс — из кошелька ребёнка: после подтверждения задания он растёт.
  const { balance } = useMyChildBalance();
  const owner = useMyWishlistOwner();
  const { progress, isPending } = useWishlistProgress(owner, balance);
  const deleteWish = useDeleteWish(owner);
  const updateWish = useUpdateWish(owner);
  const [editing, setEditing] = useState(false);

  const index = progress.findIndex((item) => String(item.wish.id) === id);
  const item = progress[index];
  if (!isPending && !item) return <Redirect href="/wishlist" />;
  if (!item) return null;

  // Фото нет: плитки сразу добавляют снимки к желанию (остальное как было).
  const addPhotos = async (source: PhotoSource) => {
    const picked = await choosePhotos(source, WISH_PHOTOS_MAX);
    if (picked.length === 0) return;
    const { wish } = item;
    updateWish.mutate(
      {
        id: wish.id,
        title: wish.title,
        price: wish.price,
        description: wish.description,
        link: wish.link,
        top: false,
        photos: picked.map((file) => ({ source: { uri: file.uri }, file })),
      },
      {
        onSuccess: () => showToast(t('wishForm.savedToast')),
        onError: (error) =>
          showToast(
            t(
              `photos.${photoUploadError(
                error instanceof WishPhotosError ? error.cause : error,
              )}`,
            ),
          ),
      },
    );
  };
  const back = () =>
    router.canGoBack() ? router.back() : router.replace('/wishlist');

  return (
    <TabScreen activeKey="wallet">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={t('wishCard.myWish')}
          onBack={back}
          right={
            <RoundButton
              icon="pencil"
              accessibilityLabel={t('wishForm.editTitle')}
              onPress={() => setEditing(true)}
            />
          }
        />
        <WishDetails
          {...item}
          position={index + 1}
          noteLabel={t('wishCard.myNote')}
          noPhotosActions={
            <>
              <SourceTile
                icon="camera-outline"
                accessibilityLabel={t('taskCard.takePhoto')}
                onPress={() => addPhotos('camera')}
              />
              <SourceTile
                icon="image-add"
                accessibilityLabel={t('taskCard.addFromGallery')}
                onPress={() => addPhotos('library')}
              />
            </>
          }
          noPhotosHint={t('wishForm.photoHint')}
        />
      </ScrollView>
      <WishFormSheet
        visible={editing}
        onClose={() => setEditing(false)}
        wish={item.wish}
        position={index + 1}
        owner={owner}
        onDelete={() => {
          setEditing(false);
          deleteWish.mutate(item.wish.id, {
            onSuccess: () => {
              showToast(t('wishlist.deletedToast'));
              back();
            },
          });
        }}
      />
    </TabScreen>
  );
}
