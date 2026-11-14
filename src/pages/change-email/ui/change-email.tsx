import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useMe, useSessionKind } from '@entities/session';
import { useTranslation } from '@shared/i18n';
import { RoundButton } from '@shared/ui';
import { ConfirmStep } from './confirm-step';
import { RequestStep } from './request-step';
import { styles } from './change-email.styled';

const goBack = () =>
  router.canGoBack() ? router.back() : router.replace('/edit-profile');

/**
 * Смена почты родителя (Edit profile → Change). Две ступени: новая почта и
 * пароль от приложения → письмо с кодом и ссылкой на новый адрес → код или
 * «I confirmed via the link». Ступень — по `pendingEmail` профиля: если
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

  if (isChild) return <Redirect href="/edit-profile" />;

  const pending = me?.pendingEmail ?? null;

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
            onDone={goBack}
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
