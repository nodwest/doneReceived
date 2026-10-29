import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router } from 'expo-router';
import { InviteCodesPanel } from '@widgets/add-member';
import { TabScreen } from '@widgets/bottom-nav';
import { JoinFamilyPanel } from '@features/join-family';
import { LanguageMenu } from '@features/select-language';
import { ChildModeToggle } from '@features/switch-role';
import { useInviteCodes } from '@entities/family';
import { useViewerRole } from '@entities/user';
import { getLanguageLabel, useLanguage, useTranslation } from '@shared/i18n';
import {
  childAccountMock,
  parentMock,
  profileSettingsMock,
} from '@shared/mocks';
import { SettingsRow, Toggle, type AnchorRect } from '@shared/ui';
import { ProfileHero } from './profile-hero';
import { styles } from './profile.styled';

/**
 * Вкладка Profile: карточка вошедшего пользователя и меню настроек. Пункты
 * Family codes и Join family показывают вместо меню панель кодов приглашения
 * или ввода кода (как на вкладке Family), крестик возвращает меню. Edit
 * profile открывает отдельную страницу. Language раскрывает выпадающий выбор
 * языка прямо у пункта. Остальные пункты пока не работают, тогл уведомлений
 * только переключается. Временный тогл над Log out переключает роль: у
 * ребёнка (Emma) голубая карточка, нет Family codes, а Join family ждёт
 * детский код.
 */
export function ProfilePage() {
  const { t } = useTranslation();
  const role = useViewerRole();
  const isChild = role === 'child';
  const account = isChild ? childAccountMock : parentMock;
  const language = useLanguage();
  const { data: codes } = useInviteCodes();
  const [panel, setPanel] = useState<'codes' | 'join' | null>(null);
  const closePanel = () => setPanel(null);
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
          name={account.fullName}
          email={account.email}
          avatar={account.avatar}
          role={role}
        />
        {panel === 'codes' ? (
          <InviteCodesPanel codes={codes} onClose={closePanel} />
        ) : panel === 'join' ? (
          <JoinFamilyPanel onClose={closePanel} role={role} />
        ) : (
          <>
            <View style={styles.menu}>
              <SettingsRow
                icon="person"
                label={t('profile.editProfile')}
                onPress={() => router.push('/edit-profile')}
              />
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
              {!isChild && (
                <>
                  <View style={styles.divider} />
                  <SettingsRow
                    icon="key"
                    label={t('profile.familyCodes')}
                    onPress={() => setPanel('codes')}
                  />
                </>
              )}
              <View style={styles.divider} />
              <SettingsRow
                icon="children"
                label={t('profile.joinFamily')}
                onPress={() => setPanel('join')}
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
            <ChildModeToggle />
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
