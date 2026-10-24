import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { InviteCodesPanel } from '@widgets/add-member';
import { TabScreen } from '@widgets/bottom-nav';
import { LanguageMenu } from '@features/select-language';
import { useInviteCodes } from '@entities/family';
import { getLanguageLabel, useLanguage, useTranslation } from '@shared/i18n';
import { parentMock, profileSettingsMock } from '@shared/mocks';
import { Toggle, type AnchorRect } from '@shared/ui';
import { ProfileHero } from './profile-hero';
import { SettingsRow } from './settings-row';
import { styles } from './profile.styled';

/**
 * Вкладка Profile: карточка вошедшего родителя и меню настроек. Пункт Family
 * codes показывает вместо меню панель кодов приглашения (как на вкладке
 * Family), крестик возвращает меню. Language раскрывает выпадающий выбор
 * языка прямо у пункта. Остальные пункты пока не работают, тогл уведомлений
 * только переключается.
 */
export function ProfilePage() {
  const { t } = useTranslation();
  const language = useLanguage();
  const { data: codes } = useInviteCodes();
  const [showCodes, setShowCodes] = useState(false);
  const languageRow = useRef<View>(null);
  const [languageAnchor, setLanguageAnchor] = useState<AnchorRect | null>(null);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [notifications, setNotifications] = useState(
    profileSettingsMock.notifications,
  );

  // Меню раскрывается у пункта Language — меряем, где он сейчас на экране.
  const openLanguageMenu = () => {
    languageRow.current?.measureInWindow((x, y, width, height) => {
      setLanguageAnchor({ x, y, width, height });
      setLanguageOpen(true);
    });
  };

  return (
    <TabScreen activeKey="profile">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('profile.title')}</Text>
        <ProfileHero
          name={parentMock.fullName}
          email={parentMock.email}
          avatar={parentMock.avatar}
        />
        {showCodes ? (
          <InviteCodesPanel codes={codes} onClose={() => setShowCodes(false)} />
        ) : (
          <>
            <View style={styles.menu}>
              <SettingsRow icon="person" label={t('profile.editProfile')} />
              <View style={styles.divider} />
              <SettingsRow
                icon="bell"
                label={t('profile.notifications')}
                right={
                  <Toggle
                    value={notifications}
                    onValueChange={setNotifications}
                    accessibilityLabel={t('profile.notifications')}
                  />
                }
              />
              <View style={styles.divider} />
              <SettingsRow
                icon="key"
                label={t('profile.familyCodes')}
                onPress={() => setShowCodes(true)}
              />
              <View style={styles.divider} />
              <SettingsRow
                ref={languageRow}
                icon="globe"
                label={t('profile.language')}
                value={getLanguageLabel(language)}
                onPress={openLanguageMenu}
              />
              <View style={styles.divider} />
              <SettingsRow icon="help" label={t('profile.help')} />
            </View>
            <Pressable style={styles.logOut}>
              <Text style={styles.logOutText}>{t('profile.logOut')}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
      <LanguageMenu
        visible={languageOpen}
        anchor={languageAnchor}
        onClose={() => setLanguageOpen(false)}
      />
    </TabScreen>
  );
}
