import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { FieldHint } from '@features/auth';
import { useUpdateMe } from '@features/update-profile';
import {
  DISPLAY_NAME_MAX_LENGTH,
  useMe,
  useMyAvatar,
  useSessionKind,
} from '@entities/session';
import { isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import {
  GradientButton,
  Icon,
  InputWithIcon,
  Label,
  LetterAvatar,
  RoundButton,
  SettingsRow,
} from '@shared/ui';
import { styles } from './edit-profile.styled';

/**
 * Редактирование профиля вошедшего пользователя (из меню Profile). Здесь
 * меняется только имя: Save changes активна, когда имя изменили хотя бы на
 * символ, и сохраняет его (PATCH /users/me). Почта только показывается,
 * Change — тост «скоро» (на сервере смены почты нет, Идеи.md п. 29). Change
 * password — отдельный экран `/change-password` (только у родителя: у
 * ребёнка пароля нет). Фото пока не меняется.
 */
export function EditProfilePage() {
  const { t } = useTranslation();
  // Данные вошедшего (GET /users/me).
  const isChild = useSessionKind() === 'child';
  const me = useMe();
  const myAvatar = useMyAvatar();
  const account = {
    fullName: me?.displayName ?? '',
    email: me?.email ?? '',
    avatar: myAvatar,
  };
  const editable = !!me;
  const [name, setName] = useState(account.fullName);
  // Имя с сервера пришло позже или сохранилось — поле за ним, если его не
  // трогали.
  const [savedName, setSavedName] = useState(account.fullName);
  if (account.fullName !== savedName) {
    setSavedName(account.fullName);
    if (name === savedName) setName(account.fullName);
  }
  const { mutate, isPending } = useUpdateMe();

  const trimmed = name.trim();
  const nameError = !trimmed
    ? 'nameRequired'
    : trimmed.length > DISPLAY_NAME_MAX_LENGTH
      ? 'nameTooLong'
      : null;
  const changed = trimmed !== account.fullName;
  const canSave = editable && changed && !nameError && !isPending;

  const save = () => {
    if (!canSave) return;
    mutate(
      { displayName: trimmed },
      {
        onSuccess: (user) => {
          setName(user.displayName);
          showToast(t('editProfile.saved'));
        },
        onError: (error) =>
          showToast(
            t(
              isApiError(error) && error.status === 0
                ? 'editProfile.errors.network'
                : 'editProfile.errors.failed',
            ),
          ),
      },
    );
  };

  return (
    <TabScreen activeKey="profile">
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/profile')
          }
        />
        <Text style={styles.title}>{t('editProfile.title')}</Text>
        {/* Пустое место справа держит заголовок по центру. */}
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarBlock}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('editProfile.changePhoto')}
            style={styles.avatarWrap}
          >
            <LetterAvatar
              source={account.avatar}
              name={account.fullName}
              style={styles.avatar}
              letterSize={36}
            />
            <LinearGradient
              colors={[theme.colors.violet, theme.colors.blue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badge}
            >
              <Icon name="camera" size={16} color={theme.colors.white} />
            </LinearGradient>
          </Pressable>
          <Pressable accessibilityRole="button" hitSlop={8}>
            <Text style={styles.changePhoto}>
              {t('editProfile.changePhoto')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Label htmlFor="name" style={styles.label}>
              {t('auth.fullName')}
            </Label>
            <InputWithIcon
              id="name"
              value={name}
              onChangeText={setName}
              placeholder={t('auth.fullName')}
              iconName="user"
              error={changed && !!nameError}
              autoComplete="name"
              textContentType="name"
            />
            {changed && nameError && (
              <FieldHint tone="error" text={t(`auth.errors.${nameError}`)} />
            )}
          </View>
          <View style={styles.field}>
            <Label htmlFor="email" style={styles.label}>
              {t('auth.email')}
            </Label>
            {/* Почта только показывается: меняется отдельно, с подтверждением. */}
            <View>
              <InputWithIcon
                id="email"
                value={account.email}
                editable={false}
                iconName="message"
                style={styles.emailInput}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('editProfile.changeEmail')}
                hitSlop={8}
                onPress={() => showToast(t('editProfile.emailSoon'))}
                style={styles.changeEmail}
              >
                <Text style={styles.changeEmailText}>
                  {t('editProfile.changeEmail')}
                </Text>
              </Pressable>
            </View>
          </View>
          {!isChild && (
            <View style={styles.field}>
              <Text style={styles.label}>{t('editProfile.security')}</Text>
              <View style={styles.card}>
                <SettingsRow
                  icon="lock"
                  label={t('editProfile.changePassword')}
                  onPress={() => router.push('/change-password')}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <GradientButton
            label={t('editProfile.save')}
            onPress={save}
            disabled={!canSave}
          />
        </View>
      </ScrollView>
    </TabScreen>
  );
}
