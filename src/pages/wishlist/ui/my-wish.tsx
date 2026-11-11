import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useDeleteWish } from '@features/delete-wish';
import { WishFormSheet } from '@features/wish-form';
import { TabScreen } from '@widgets/bottom-nav';
import { useMyChildBalance, useMyWishlistOwner } from '@features/family-tasks';
import { useWishlistProgress, WishDetails } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
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
  const [editing, setEditing] = useState(false);

  const index = progress.findIndex((item) => String(item.wish.id) === id);
  const item = progress[index];
  if (!isPending && !item) return <Redirect href="/wishlist" />;
  if (!item) return null;

  const photoSoon = () => showToast(t('wishForm.photoSoon'));
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
                onPress={photoSoon}
              />
              <SourceTile
                icon="image-add"
                accessibilityLabel={t('taskCard.addFromGallery')}
                onPress={photoSoon}
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
