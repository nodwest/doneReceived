import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useLogout } from '@features/auth';
import {
  DeleteAccountSheet,
  isChildHasBalanceError,
  useDeleteMyProfile,
  type DeleteAccountStep,
} from '@features/delete-child';
import { useMyChildBalance } from '@features/family-tasks';
import { formatMoney } from '@entities/wallet';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { Icon, PillButton, RoundButton, type IconName } from '@shared/ui';
import { styles } from './delete-account.styled';

const goBack = () =>
  router.canGoBack() ? router.back() : router.replace('/profile');

/**
 * Удаление аккаунта ребёнка (Profile → Delete account): что нужно знать —
 * удалить можно только с нулевым балансом, восстановить не получится — и
 * кнопка Delete. На счету есть деньги — шторка «сначала выведите» (Withdraw
 * пока не работает), ноль — «вы уверены?» и Delete account. Удалили —
 * выход, тост и логин.
 */
export function DeleteAccountPage() {
  useTheme();
  const { t } = useTranslation();
  const { balance, isPending: balanceLoading } = useMyChildBalance();
  const deleteProfile = useDeleteMyProfile();
  const logout = useLogout();
  const [step, setStep] = useState<DeleteAccountStep>(null);

  const confirmDelete = () =>
    deleteProfile.mutate(undefined, {
      onSuccess: async () => {
        setStep(null);
        await logout();
        showToast(t('deleteAccount.deleted'));
        router.replace('/login');
      },
      onError: (error) => {
        // Баланс успел измениться — сервер не удалил.
        if (isChildHasBalanceError(error)) setStep('balance');
        else showToast(t('deleteAccount.failed'));
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
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon name="trash" size={28} color={theme.colors.dangerText} />
          </View>
          <Text style={styles.heroTitle}>{t('deleteAccount.heading')}</Text>
          <Text style={styles.heroText}>{t('deleteAccount.intro')}</Text>
        </View>

        <View style={styles.card}>
          <InfoRow
            icon="wallet"
            title={t('deleteAccount.zeroBalanceTitle')}
            text={t('deleteAccount.zeroBalanceText')}
            // Баланс — когда он пришёл с сервера, а не «$0», пока грузится.
            note={
              balanceLoading
                ? undefined
                : t('deleteAccount.balanceNow', {
                    amount: formatMoney(balance),
                  })
            }
          />
          <View style={styles.divider} />
          <InfoRow
            icon="trash"
            title={t('deleteAccount.foreverTitle')}
            text={t('deleteAccount.foreverText')}
          />
        </View>

        <View style={styles.footer}>
          {/* Пока баланс не пришёл, не знаем, какую шторку открыть. */}
          <PillButton
            label={t('deleteAccount.delete')}
            variant="danger"
            disabled={balanceLoading}
            style={styles.deleteButton}
            onPress={() => setStep(balance > 0 ? 'balance' : 'confirm')}
          />
        </View>
      </ScrollView>
      <DeleteAccountSheet
        step={step}
        balance={balance}
        deleting={deleteProfile.isPending}
        onClose={() => setStep(null)}
        onConfirm={confirmDelete}
        // Вывода пока нет. Шторку закрываем: на телефоне она — Modal поверх
        // тостов, и тост под ней был бы не виден.
        onWithdraw={() => {
          setStep(null);
          showToast(t('deleteAccount.withdrawSoon'));
        }}
      />
    </TabScreen>
  );
}

function InfoRow({
  icon,
  title,
  text,
  note,
}: {
  icon: IconName;
  title: string;
  text: string;
  /** Строка ниже текста тёмным (текущий баланс). */
  note?: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon name={icon} size={20} color={theme.colors.dangerText} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{text}</Text>
        {note ? <Text style={styles.rowNote}>{note}</Text> : null}
      </View>
    </View>
  );
}
