import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useWishlistProgress, WishRow } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { childProfilesMock } from '@shared/mocks';
import { theme } from '@shared/theme';
import { HeaderAvatar, Icon, ScreenHeader } from '@shared/ui';
import { styles } from './child-wishlist.styled';

/**
 * Вишлист ребёнка глазами родителя (`/child/[id]/wishlist`, See all в
 * профиле): баланс ребёнка и желания в его порядке. Только просмотр —
 * переставлять и править может сам ребёнок. Тап — карточка желания.
 */
export function ChildWishlistPage() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const child = childProfilesMock.find((item) => String(item.id) === id);
  const { progress, isPending } = useWishlistProgress(
    child?.id ?? -1,
    child?.balance ?? 0,
  );
  if (!child) return <Redirect href="/" />;

  return (
    <TabScreen activeKey="family">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title={t('wishCard.childWishlist', { name: child.name })}
          onBack={() =>
            router.canGoBack()
              ? router.back()
              : router.replace({
                  pathname: '/child/[id]',
                  params: { id: String(child.id) },
                })
          }
          right={<HeaderAvatar source={child.avatar} />}
        />
        <LinearGradient
          colors={[theme.colors.childFrom, theme.colors.childDeep]}
          start={{ x: 0.4, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          locations={[0, 0.7071]}
          style={styles.balance}
        >
          <Text style={styles.balanceText}>
            {t('wishCard.childBalance', { name: child.name })}
          </Text>
          <Text style={styles.balanceText}>${child.balance}</Text>
        </LinearGradient>
        {!isPending && progress.length === 0 ? (
          <Text style={styles.empty}>
            {t('wishCard.noWishes', { name: child.name })}
          </Text>
        ) : (
          <View style={styles.list}>
            {progress.map((item) => (
              <WishRow
                key={item.wish.id}
                {...item}
                onPress={() =>
                  router.push({
                    pathname: '/child/[id]/wishlist/[wishId]',
                    params: {
                      id: String(child.id),
                      wishId: String(item.wish.id),
                    },
                  })
                }
                aside={
                  <Icon
                    name="chevron-right"
                    size={16}
                    color={theme.colors.grey}
                  />
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </TabScreen>
  );
}
