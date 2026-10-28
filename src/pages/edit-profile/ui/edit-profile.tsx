import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { useTranslation } from '@shared/i18n';
import { parentMock } from '@shared/mocks';
import { theme } from '@shared/theme';
import {
  GradientButton,
  Icon,
  InputWithIcon,
  Label,
  RoundButton,
  SettingsRow,
} from '@shared/ui';
import { styles } from './edit-profile.styled';

/**
 * Редактирование профиля вошедшего родителя (из меню Profile): фото, имя,
 * почта, смена пароля и Save changes. Пока только вёрстка: фото, пароль и
 * сохранение ничего не делают, поля правятся только на экране.
 */
export function EditProfilePage() {
  const { t } = useTranslation();
  const [name, setName] = useState(parentMock.fullName);
  const [email, setEmail] = useState(parentMock.email);

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
            <Image source={parentMock.avatar} style={styles.avatar} />
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
            />
          </View>
          <View style={styles.field}>
            <Label htmlFor="email" style={styles.label}>
              {t('auth.email')}
            </Label>
            <InputWithIcon
              id="email"
              value={email}
              onChangeText={setEmail}
              placeholder={t('auth.email')}
              iconName="message"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>{t('editProfile.security')}</Text>
            <View style={styles.card}>
              <SettingsRow
                icon="lock"
                label={t('editProfile.changePassword')}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <GradientButton label={t('editProfile.save')} />
        </View>
      </ScrollView>
    </TabScreen>
  );
}
