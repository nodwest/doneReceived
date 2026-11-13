import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { FieldHint, PasswordRules, validatePassword } from '@features/auth';
import {
  changePasswordError,
  useChangePassword,
  type ChangePasswordErrorInfo,
} from '@features/change-password';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { GradientButton, InputWithIcon, Label, RoundButton } from '@shared/ui';
import { styles } from './change-password.styled';

type Field = 'current' | 'next' | 'confirm';

const EMPTY = { current: '', next: '', confirm: '' };

const goBack = () =>
  router.canGoBack() ? router.back() : router.replace('/edit-profile');

/**
 * Смена пароля родителя (из Edit profile → Change password): текущий пароль
 * (от входа в приложение, не от почты), новый с требованиями и повтор.
 * Кнопка активна, когда всё заполнено верно. Неверный текущий пароль или
 * такой же новый — ошибка под полем, остальное — тостом. После смены — тост
 * и назад в Edit profile; здесь вход остаётся, другие устройства сервер
 * разлогинивает.
 */
export function ChangePasswordPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState(EMPTY);
  const [focused, setFocused] = useState<Field | null>(null);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverError, setServerError] =
    useState<ChangePasswordErrorInfo | null>(null);
  const { mutate, isPending } = useChangePassword();

  const newError = validatePassword(form.next);
  const sameAsCurrent = !!form.next && form.next === form.current;
  const matches = !!form.confirm && form.confirm === form.next;
  // Повтор не совпадает: говорим, когда он уже не короче пароля или из
  // поля ушли — пока человек печатает, не ругаем.
  const mismatch =
    !!form.confirm &&
    !matches &&
    (form.confirm.length >= form.next.length ||
      (!!touched.confirm && focused !== 'confirm'));
  const canSubmit =
    !!form.current && !newError && !sameAsCurrent && matches && !isPending;

  const set = (field: Field) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Ошибка сервера была про прежние значения.
    if (serverError) setServerError(null);
  };

  const focus = (field: Field) => ({
    onFocus: () => setFocused(field),
    onBlur: () => {
      setFocused(null);
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
  });

  const submit = () => {
    if (!canSubmit) return;
    mutate(
      { currentPassword: form.current, newPassword: form.next },
      {
        onSuccess: () => {
          showToast(t('changePassword.updated'));
          goBack();
        },
        onError: (error) => {
          const info = changePasswordError(error);
          if (info.field) setServerError(info);
          else {
            showToast(
              t(`changePassword.errors.${info.error}`, { count: info.minutes }),
            );
          }
        },
      },
    );
  };

  const currentWrong = serverError?.field === 'currentPassword';
  const newSame = sameAsCurrent || serverError?.field === 'newPassword';
  const showRules = focused === 'next' || (!!form.next && !!newError);

  return (
    <TabScreen activeKey="profile">
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={goBack}
        />
        <Text style={styles.title}>{t('changePassword.title')}</Text>
        {/* Пустое место справа держит заголовок по центру. */}
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.intro}>{t('changePassword.intro')}</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Label htmlFor="current-password" style={styles.label}>
              {t('changePassword.current')}
            </Label>
            <InputWithIcon
              secureTextEntry
              id="current-password"
              placeholder={t('changePassword.currentPlaceholder')}
              iconName="castle"
              value={form.current}
              onChangeText={set('current')}
              {...focus('current')}
              error={currentWrong}
              autoComplete="current-password"
              textContentType="password"
            />
            {currentWrong ? (
              <FieldHint
                tone="error"
                text={t('changePassword.errors.wrongCurrent')}
              />
            ) : (
              <FieldHint tone="muted" text={t('changePassword.currentHint')} />
            )}
          </View>

          <View style={styles.field}>
            <Label htmlFor="new-password" style={styles.label}>
              {t('changePassword.new')}
            </Label>
            <InputWithIcon
              secureTextEntry
              id="new-password"
              placeholder={t('changePassword.newPlaceholder')}
              iconName="castle"
              value={form.next}
              onChangeText={set('next')}
              {...focus('next')}
              error={
                newSame ||
                (!!touched.next &&
                  focused !== 'next' &&
                  !!newError &&
                  !!form.next)
              }
              autoComplete="new-password"
              textContentType="newPassword"
            />
            {newSame ? (
              <FieldHint
                tone="error"
                text={t('changePassword.errors.sameAsCurrent')}
              />
            ) : showRules ? (
              <PasswordRules
                password={form.next}
                error={!!touched.next && focused !== 'next'}
              />
            ) : (
              !!form.next && (
                <FieldHint tone="met" text={t('changePassword.strong')} />
              )
            )}
          </View>

          <View style={styles.field}>
            <Label htmlFor="confirm-password" style={styles.label}>
              {t('changePassword.confirm')}
            </Label>
            <InputWithIcon
              secureTextEntry
              id="confirm-password"
              placeholder={t('changePassword.confirmPlaceholder')}
              iconName="castle"
              value={form.confirm}
              onChangeText={set('confirm')}
              {...focus('confirm')}
              error={mismatch}
              autoComplete="new-password"
              textContentType="newPassword"
            />
            {matches && (
              <FieldHint tone="met" text={t('changePassword.match')} />
            )}
            {mismatch && (
              <FieldHint
                tone="error"
                text={t('auth.errors.passwordsMismatch')}
              />
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <GradientButton
            label={t('changePassword.submit')}
            onPress={submit}
            disabled={!canSubmit}
          />
        </View>
      </ScrollView>
    </TabScreen>
  );
}
