import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useMe, useSessionKind } from '@entities/session';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { RoundButton } from '@shared/ui';
import { ConfirmStep } from './confirm-step';
import { RequestStep } from './request-step';
import { styles } from './change-email.styled';

const goBack = () =>
  router.canGoBack() ? router.back() : router.replace('/edit-profile');

/**
 * Смена почты родителя (Edit profile → Change). Две ступени: новая почта и
 * пароль от приложения → письмо с кодом и ссылкой на новый адрес → код или
 * ссылка (профиль перечитывается сам). Ступень — по `pendingEmail` профиля: если
 * смена уже ждёт подтверждения (например, приложение перезапускали),
 * экран сразу открывает ввод кода; «Use a different email» — снова первая
 * ступень. После смены — тост и назад; здесь вход остаётся, другие
 * устройства сервер разлогинивает. У ребёнка почты нет — экрана тоже.
 */
export function ChangeEmailPage() {
  const { t } = useTranslation();
  const isChild = useSessionKind() === 'child';
  const me = useMe();
  // Человек сам вернулся к вводу почты, хотя смена ещё ждёт подтверждения.
  const [editing, setEditing] = useState(false);
  const pending = me?.pendingEmail ?? null;
  // Какую почту ждём: пока она в `pendingEmail`, смена не закончилась.
  const [waitingFor, setWaitingFor] = useState<string | null>(null);
  if (pending && pending !== waitingFor) setWaitingFor(pending);

  // `pendingEmail` пропал — смену подтвердили (кодом здесь, ссылкой в
  // браузере, с другого устройства) или она истекла. Новый объект на
  // каждый исход: эффект ниже срабатывает ровно один раз.
  const [outcome, setOutcome] = useState<{ changed: boolean } | null>(null);
  if (waitingFor && !pending && me) {
    setWaitingFor(null);
    const changed = me.email?.toLowerCase() === waitingFor.toLowerCase();
    if (!changed) setEditing(false);
    setOutcome({ changed });
  }
  useEffect(() => {
    if (!outcome) return;
    if (outcome.changed) {
      showToast(t('changeEmail.updated'));
      goBack();
    } else showToast(t('changeEmail.errors.noPending'));
  }, [outcome, t]);

  if (isChild) return <Redirect href="/edit-profile" />;

  return (
    <TabScreen activeKey="profile">
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={goBack}
        />
        <Text style={styles.title}>{t('changeEmail.title')}</Text>
        {/* Пустое место справа держит заголовок по центру. */}
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {pending && !editing ? (
          <ConfirmStep
            key={pending}
            email={pending}
            onUseAnother={() => setEditing(true)}
          />
        ) : (
          <RequestStep
            currentEmail={me?.email ?? ''}
            onSent={() => setEditing(false)}
          />
        )}
      </ScrollView>
    </TabScreen>
  );
}
