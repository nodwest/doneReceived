import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useLogout } from '@features/auth';
import {
  DeleteAccountSheet,
  childBalanceToConfirm,
  useDeleteMyProfile,
  type DeleteAccountStep,
} from '@features/delete-child';
import { useMyChildWallet } from '@features/family-tasks';
import { apiErrorCode, isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { Icon, PillButton, RoundButton, type IconName } from '@shared/ui';
import { styles } from './delete-account.styled';

const goBack = () =>
  router.canGoBack() ? router.back() : router.replace('/profile');

/** Удаление профиля ребёнка: существующий сценарий без изменений. */
export function ChildDeleteAccountPage() {
  useTheme();
  const { t, i18n } = useTranslation();
  const wallet = useMyChildWallet();
  const balance = wallet.data?.balance;
  const deleteProfile = useDeleteMyProfile();
  const logout = useLogout();
  const [step, setStep] = useState<DeleteAccountStep>(null);
  const [confirmedBalance, setConfirmedBalance] = useState<string>();

  const openConfirmation = () => {
    if (balance !== undefined && Number.isSafeInteger(balance) && balance > 0) {
      setConfirmedBalance(String(balance));
      setStep('balance');
    } else {
      setStep('confirm');
    }
  };

  const confirmDelete = () =>
    deleteProfile.mutate(step === 'balance' ? confirmedBalance : undefined, {
      onSuccess: async () => {
        setStep(null);
        await logout();
        showToast(t('deleteAccount.deleted'));
        router.replace('/login');
      },
      onError: (error) => {
        const balance = childBalanceToConfirm(error);
        if (balance !== undefined) {
          setConfirmedBalance(balance);
          setStep('balance');
          return;
        }
        setStep(null);
        const code = isApiError(error) ? apiErrorCode(error) : null;
        showToast(
          t(
            code === 'CHILD_HAS_PENDING_REVIEW'
              ? 'deleteAccount.pendingReview'
              : code === 'CHILD_HAS_BALANCE'
                ? 'deleteAccount.balanceBlocked'
                : 'deleteAccount.failed',
          ),
        );
      },
    });

  return (
    <TabScreen activeKey="profile">
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={goBack}
        />
        <Text style={styles.title}>{t('deleteAccount.title')}</Text>
        {/* Пустое место справа держит заголовок по центру. */}
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.wallet}>
          <View style={styles.walletHeading}>
            <Icon name="wallet" size={20} color={theme.colors.ink} />
            <Text accessibilityRole="header" style={styles.rowTitle}>
              {t('deleteAccount.virtualBalanceTitle')}
            </Text>
          </View>
          {balance !== undefined ? (
            <Text style={styles.balance}>
              {new Intl.NumberFormat(i18n.resolvedLanguage).format(balance)}
              <Text style={styles.unit}>
                {' '}
                {t('deleteAccount.points', { count: balance })}
              </Text>
            </Text>
          ) : wallet.isFetching ? (
            <Text accessibilityLiveRegion="polite" style={styles.rowBody}>
              {t('common.loading')}
            </Text>
          ) : (
            <View style={styles.unavailable}>
              <Text style={styles.rowBody}>
                {t('deleteAccount.balanceUnavailable')}
              </Text>
              {wallet.isError ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void wallet.refetch()}
                  style={styles.retry}
                >
                  <Text style={styles.rowTitle}>{t('common.retry')}</Text>
                </Pressable>
              ) : null}
            </View>
          )}
          <Text style={styles.rowBody}>
            {t('deleteAccount.virtualBalanceText')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('wallet.withdrawAction')}
            accessibilityHint={t('deleteAccount.withdrawUnavailable')}
            onPress={() => showToast(t('deleteAccount.withdrawUnavailable'))}
            style={styles.withdraw}
          >
            <Text style={styles.withdrawLabel}>
              {t('deleteAccount.withdrawFunds')}
            </Text>
          </Pressable>
          <Text style={styles.notice}>
            {t('deleteAccount.withdrawUnavailable')}
          </Text>
        </View>

        <View style={styles.consequences}>
          <Text accessibilityRole="header" style={styles.rowTitle}>
            {t('deleteAccount.consequencesTitle')}
          </Text>
          <InfoRow icon="trash" text={t('deleteAccount.foreverText')} />
          <InfoRow
            icon="wallet"
            text={t('deleteAccount.rewardsHistoryUnavailable')}
          />
          <InfoRow icon="tasks" text={t('deleteAccount.pendingTasksFailed')} />
        </View>

        <View style={styles.footer}>
          <PillButton
            label={t('deleteAccount.delete')}
            variant="danger"
            style={styles.deleteButton}
            onPress={openConfirmation}
          />
        </View>
      </ScrollView>
      <DeleteAccountSheet
        step={step}
        balance={confirmedBalance}
        deleting={deleteProfile.isPending}
        onClose={() => setStep(null)}
        onConfirm={confirmDelete}
      />
    </TabScreen>
  );
}

function InfoRow({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon name={icon} size={20} color={theme.colors.dangerText} />
      </View>
      <Text style={[styles.rowBody, styles.rowText]}>{text}</Text>
    </View>
  );
}
