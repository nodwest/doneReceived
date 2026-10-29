import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { AskToBuyButton } from '@features/ask-to-buy';
import { useDeleteWish } from '@features/delete-wish';
import { useReorderWishes } from '@features/reorder-wishes';
import { WishFormSheet } from '@features/wish-form';
import { TabScreen } from '@widgets/bottom-nav';
import { useWishlistProgress, WishRow, type Wish } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { childAccountMock, childProfilesMock } from '@shared/mocks';
import { theme } from '@shared/theme';
import { Icon, RoundButton, SortableList, SwipeableRow } from '@shared/ui';
import { ACTIONS_WIDTH, styles } from './wishlist.styled';

/**
 * Вишлист ребёнка (Emma, временный режим ребёнка; открывается с плиток
 * вишлиста на главной и в Wallet). Баланс наполняет желания сверху вниз:
 * готовые — зелёные с Ask parent to buy, текущее — голубое, остальные ждут.
 * Порядок меняют перетаскиванием за ручку — всё сразу пересчитывается.
 * Смахнуть строку влево — Edit и Delete. «+» и Add a wish открывают New wish.
 * Тап по желанию — его карточка (`/wishlist/[id]`).
 */
export function WishlistPage() {
  const { t } = useTranslation();
  const balance =
    childProfilesMock.find((child) => child.id === childAccountMock.id)
      ?.balance ?? 0;
  const { progress, isPending } = useWishlistProgress(
    childAccountMock.id,
    balance,
  );
  const reorder = useReorderWishes(childAccountMock.id);
  const deleteWish = useDeleteWish();
  const [sheetOpen, setSheetOpen] = useState(false);
  // Желание в шторке; undefined — New wish. Не сбрасываем при закрытии, чтобы
  // шторка не переключалась на New wish, пока уезжает.
  const [editing, setEditing] = useState<Wish>();
  const [openId, setOpenId] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  const position = editing
    ? progress.findIndex((item) => item.wish.id === editing.id) + 1
    : progress.length + 1;

  const remove = (wish: Wish) => {
    setOpenId(null);
    setSheetOpen(false);
    deleteWish.mutate(wish.id, {
      onSuccess: () => showToast(t('wishlist.deletedToast')),
    });
  };

  const openSheet = (wish?: Wish) => {
    setOpenId(null);
    setEditing(wish);
    setSheetOpen(true);
  };

  return (
    <TabScreen activeKey="wallet">
      <ScrollView
        contentContainerStyle={styles.body}
        scrollEnabled={!dragging}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <RoundButton
            icon="arrow-left"
            accessibilityLabel={t('common.back')}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace('/wallet')
            }
          />
          <Text style={styles.title}>{t('wishlist.title')}</Text>
          <RoundButton
            icon="plus"
            accessibilityLabel={t('wishForm.newTitle')}
            onPress={() => openSheet()}
          />
        </View>
        <LinearGradient
          colors={[theme.colors.childFrom, theme.colors.childDeep]}
          start={{ x: 0.4, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          locations={[0, 0.7071]}
          style={styles.balance}
        >
          <Text style={styles.balanceTitle}>
            {t('wishlist.balance', { balance })}
          </Text>
          <Text style={styles.balanceHint}>{t('wishlist.balanceHint')}</Text>
        </LinearGradient>
        {!isPending && progress.length === 0 && (
          <Text style={styles.empty}>{t('wishlist.empty')}</Text>
        )}
        <SortableList
          data={progress}
          gap={8}
          keyExtractor={(item) => item.wish.id}
          onDragActiveChange={(active) => {
            setDragging(active);
            if (active) setOpenId(null);
          }}
          onReorder={(from, to) => reorder.mutate({ from, to })}
          renderItem={({ item, dragHandleProps, dragging: lifted }) => (
            <SwipeableRow
              open={openId === item.wish.id}
              onOpenChange={(open) => setOpenId(open ? item.wish.id : null)}
              actionsWidth={ACTIONS_WIDTH}
              actions={
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openSheet(item.wish)}
                    style={({ pressed }) => [
                      styles.action,
                      styles.edit,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Icon name="pencil" size={20} color={theme.colors.white} />
                    <Text style={styles.actionLabel}>{t('wishlist.edit')}</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => remove(item.wish)}
                    style={({ pressed }) => [
                      styles.action,
                      styles.delete,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Icon name="trash" size={20} color={theme.colors.white} />
                    <Text style={styles.actionLabel}>
                      {t('wishlist.delete')}
                    </Text>
                  </Pressable>
                </View>
              }
            >
              <WishRow
                {...item}
                lifted={lifted}
                onPress={() =>
                  router.push({
                    pathname: '/wishlist/[id]',
                    params: { id: String(item.wish.id) },
                  })
                }
                aside={
                  <View
                    {...dragHandleProps}
                    accessibilityLabel={t('wishlist.dragHandle')}
                    style={styles.handle}
                  >
                    <Icon
                      name="drag-handle"
                      size={20}
                      color={theme.colors.dragHandle}
                    />
                  </View>
                }
                action={item.status === 'ready' && <AskToBuyButton />}
              />
            </SwipeableRow>
          )}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => openSheet()}
          style={({ pressed }) => [styles.add, pressed && styles.pressed]}
        >
          <Icon name="plus" size={18} color={theme.colors.childDeep} />
          <Text style={styles.addLabel}>{t('wishlist.add')}</Text>
        </Pressable>
      </ScrollView>
      <WishFormSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        wish={editing}
        position={position}
        onDelete={editing && (() => remove(editing))}
      />
    </TabScreen>
  );
}
