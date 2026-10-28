import { Fragment } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { TransactionRow, useWallet } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { childProfilesMock } from '@shared/mocks';
import { SectionHeader } from '@shared/ui';
import { BalanceCard } from './balance-card';
import { ChildBalance } from './child-balance';
import { RewardsHistoryLink } from './rewards-history-link';
import { styles } from './wallet.styled';

// Сколько последних транзакций показываем; остальные — по «See all».
const RECENT_TRANSACTIONS = 4;

/**
 * Вкладка Wallet: баланс вошедшего родителя (не всей семьи) с кнопками ввода
 * и вывода денег, балансы детей, ссылка на историю наград и последние
 * транзакции. Deposit, Withdraw и «See all» пока ничего не делают.
 */
export function WalletPage() {
  const { t } = useTranslation();
  const { data: wallet } = useWallet();
  const transactions = wallet?.transactions.slice(0, RECENT_TRANSACTIONS) ?? [];

  return (
    <TabScreen activeKey="wallet">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('wallet.title')}</Text>
        {wallet && <BalanceCard balance={wallet.balance} />}
        <View style={styles.children}>
          {childProfilesMock.map((child) => (
            <ChildBalance
              key={child.id}
              name={child.name}
              avatar={child.avatar}
              balance={child.balance}
            />
          ))}
        </View>
        <RewardsHistoryLink onPress={() => router.push('/rewards-history')} />
        <View style={styles.sectionHeader}>
          <SectionHeader
            title={t('wallet.transactions')}
            actionLabel={t('common.seeAll')}
          />
        </View>
        {wallet && (
          <View style={styles.transactions}>
            {transactions.length === 0 ? (
              <Text style={styles.empty}>{t('wallet.noTransactions')}</Text>
            ) : (
              transactions.map((transaction, index) => (
                <Fragment key={transaction.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <TransactionRow transaction={transaction} />
                </Fragment>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </TabScreen>
  );
}
