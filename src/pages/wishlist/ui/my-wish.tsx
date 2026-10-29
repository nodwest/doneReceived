import { useState } from 'react';
import { ScrollView } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { AskToBuyButton } from '@features/ask-to-buy';
import { useDeleteWish } from '@features/delete-wish';
import { WishFormSheet } from '@features/wish-form';
import { TabScreen } from '@widgets/bottom-nav';
import { useWishlistProgress, WishDetails } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { childAccountMock, childProfilesMock } from '@shared/mocks';
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
  const balance =
    childProfilesMock.find((child) => child.id === childAccountMock.id)
      ?.balance ?? 0;
  const { progress, isPending } = useWishlistProgress(
    childAccountMock.id,
    balance,
  );
  const deleteWish = useDeleteWish();
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
          footer={item.status === 'ready' && <AskToBuyButton />}
        />
      </ScrollView>
      <WishFormSheet
        visible={editing}
        onClose={() => setEditing(false)}
        wish={item.wish}
        position={index + 1}
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
