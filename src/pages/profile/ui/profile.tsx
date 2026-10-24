import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { InviteCodesPanel } from '@widgets/add-member';
import { TabScreen } from '@widgets/bottom-nav';
import { useInviteCodes } from '@entities/family';
import { parentMock, profileSettingsMock } from '@shared/mocks';
import { Toggle } from '@shared/ui';
import { ProfileHero } from './profile-hero';
import { SettingsRow } from './settings-row';
import { styles } from './profile.styled';

/**
 * Вкладка Profile: карточка вошедшего родителя и меню настроек. Пункт Family
 * codes показывает вместо меню панель кодов приглашения (как на вкладке
 * Family), крестик возвращает меню. Остальные пункты пока не работают,
 * тогл уведомлений только переключается.
 */
export function ProfilePage() {
  const { data: codes } = useInviteCodes();
  const [showCodes, setShowCodes] = useState(false);
  const [notifications, setNotifications] = useState(
    profileSettingsMock.notifications,
  );

  return (
    <TabScreen activeKey="profile">
      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>
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
              <SettingsRow icon="person" label="Edit profile" />
              <View style={styles.divider} />
              <SettingsRow
                icon="bell"
                label="Notifications"
                right={
                  <Toggle
                    value={notifications}
                    onValueChange={setNotifications}
                    accessibilityLabel="Notifications"
                  />
                }
              />
              <View style={styles.divider} />
              <SettingsRow
                icon="key"
                label="Family codes"
                onPress={() => setShowCodes(true)}
              />
              <View style={styles.divider} />
              <SettingsRow
                icon="globe"
                label="Language"
                value={profileSettingsMock.language}
              />
              <View style={styles.divider} />
              <SettingsRow icon="help" label="Help & support" />
            </View>
            <Pressable style={styles.logOut}>
              <Text style={styles.logOutText}>Log out</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </TabScreen>
  );
}
