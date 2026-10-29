import { ScrollView } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useWishlistProgress, WishDetails } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { childProfilesMock } from '@shared/mocks';
import { HeaderAvatar, ScreenHeader } from '@shared/ui';
import { styles } from './child-wishlist.styled';

/**
 * Карточка желания ребёнка глазами родителя
 * (`/child/[id]/wishlist/[wishId]`): фото, накопленное или место в очереди,
 * заметка ребёнка и ссылка на магазин. Только просмотр.
 */
export function ChildWishPage() {
  const { t } = useTranslation();
  const { id, wishId } = useLocalSearchParams<{ id: string; wishId: string }>();
  const child = childProfilesMock.find((item) => String(item.id) === id);
  const { progress, isPending } = useWishlistProgress(
    child?.id ?? -1,
    child?.balance ?? 0,
  );
  const index = progress.findIndex((item) => String(item.wish.id) === wishId);
  const item = progress[index];
  if (!child) return <Redirect href="/" />;
  if (!isPending && !item) {
    return (
      <Redirect
        href={{
          pathname: '/child/[id]/wishlist',
          params: { id: String(child.id) },
        }}
      />
    );
  }
  if (!item) return null;

  return (
    <TabScreen activeKey="family">
      <ScrollView
        contentContainerStyle={styles.wishBody}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={t('wishCard.childWish', { name: child.name })}
          onBack={() =>
            router.canGoBack()
              ? router.back()
              : router.replace({
                  pathname: '/child/[id]/wishlist',
                  params: { id: String(child.id) },
                })
          }
          right={<HeaderAvatar source={child.avatar} />}
        />
        <WishDetails
          {...item}
          position={index + 1}
          noteLabel={t('wishCard.childNote', { name: child.name })}
        />
      </ScrollView>
    </TabScreen>
  );
}
