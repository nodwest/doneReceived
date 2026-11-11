import { Fragment, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { WishlistPreview } from '@widgets/wishlist-preview';
import {
  operationsInPeriod,
  sortByNewest,
  useOperations,
  type Operation,
} from '@entities/operation';
import { TaskIconBadge } from '@entities/task';
import { useMyChildWallet, useMyWishlistOwner } from '@features/family-tasks';
import { ChildTransactionRow } from '@entities/wallet';
import { useWishlistProgress } from '@entities/wish';
import { useTranslation } from '@shared/i18n';
import { childAccountMock } from '@shared/mocks';
import { SectionHeader } from '@shared/ui';
import { BalanceCard } from './balance-card';
import { RewardsHistoryLink } from './rewards-history-link';
import { styles } from './wallet.styled';

const NO_OPERATIONS: Operation[] = [];
// Тап по транзакции — её карточка в истории транзакций.
const openTransaction = (id: number) =>
  router.push({
    pathname: '/transactions',
    params: { transaction: String(id) },
  });

// Сколько последних транзакций показываем; остальные — по «See all».
const RECENT_TRANSACTIONS = 4;

/**
 * Вкладка Wallet у ребёнка (Emma, временный режим ребёнка): баланс с
 * заработанным за неделю и Withdraw (пока не работает), плитка вишлиста,
 * ссылка на историю наград и последние транзакции — награды и выводы на
 * карту; «See all» — вся история транзакций.
 */
export function ChildWalletPage() {
  const { t } = useTranslation();
  const { data: operations = NO_OPERATIONS } = useOperations();
  const [today] = useState(() => new Date());
  const earned = useMemo(
    () =>
      sortByNewest(
        operations.filter(
          (operation) =>
            operation.child.id === childAccountMock.id &&
            operation.kind === 'earned',
        ),
      ),
    [operations],
  );
  const weekEarned = operationsInPeriod(earned, 'week', today).reduce(
    (sum, operation) => sum + operation.amount,
    0,
  );
  // Баланс — из кошелька ребёнка: после подтверждения задания он растёт.
  const { data: wallet } = useMyChildWallet();
  const balance = wallet?.balance ?? 0;
  const wishlist = useWishlistProgress(useMyWishlistOwner(), balance);
  const recent = wallet?.transactions.slice(0, RECENT_TRANSACTIONS) ?? [];

  return (
    <TabScreen activeKey="wallet">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('wallet.title')}</Text>
        <BalanceCard role="child" balance={balance} weekEarned={weekEarned} />
        <WishlistPreview
          readyCount={wishlist.readyCount}
          current={wishlist.current}
          onPress={() => router.push('/wishlist')}
        />
        <RewardsHistoryLink onPress={() => router.push('/rewards-history')} />
        <View style={styles.sectionHeader}>
          <SectionHeader
            title={t('wallet.transactions')}
            actionLabel={t('common.seeAll')}
            onAction={() => router.push('/transactions')}
          />
        </View>
        {wallet && (
          <View style={styles.transactions}>
            {recent.length === 0 ? (
              <Text style={styles.empty}>{t('wallet.noTransactions')}</Text>
            ) : (
              recent.map((transaction, index) => (
                <Fragment key={transaction.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <ChildTransactionRow
                    transaction={transaction}
                    rewardIcon={<TaskIconBadge size={40} />}
                    onPress={() => openTransaction(transaction.id)}
                  />
                </Fragment>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </TabScreen>
  );
}
