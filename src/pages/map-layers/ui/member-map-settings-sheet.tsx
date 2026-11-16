import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import type { FamilyMember } from '@entities/family';
import { useMyId } from '@entities/session';
import {
  useMemberMapSettings,
  useUpdateMemberMapSettings,
  type LocationViewer,
  type MapSettingsChanges,
} from '@features/location';
import { authorizedImage } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { formatTimeAgo, showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { BottomSheet, Icon, LetterAvatar } from '@shared/ui';
import { styles } from './member-map-settings-sheet.styled';

const COLOR_LABELS = {
  '#6C5CE7': 'mapLayers.colorViolet',
  '#4A90E2': 'mapLayers.colorBlue',
  '#F2643F': 'mapLayers.colorCoral',
  '#2EB873': 'mapLayers.colorGreen',
  '#E84393': 'mapLayers.colorPink',
  '#00B8D9': 'mapLayers.colorTeal',
  '#D99A00': 'mapLayers.colorAmber',
  '#55586E': 'mapLayers.colorGraphite',
} as const;

type MemberMapSettingsSheetProps = {
  familyId: string;
  member: FamilyMember | null;
  onClose: () => void;
};

/** Настройки одного участника: цвет, устройство и приватность родителя. */
export function MemberMapSettingsSheet({
  familyId,
  member,
  onClose,
}: MemberMapSettingsSheetProps) {
  const { t } = useTranslation();
  const myId = useMyId();
  const {
    data: settings,
    isPending,
    isError,
  } = useMemberMapSettings(familyId, member?.userId ?? null, !!member);
  const update = useUpdateMemberMapSettings();

  const avatar = member?.avatarUrl ? authorizedImage(member.avatarUrl) : null;

  const save = (changes: MapSettingsChanges) => {
    if (!member) return;
    update.mutate(
      { familyId, userId: member.userId, changes },
      {
        onError: () => showToast(t('mapLayers.settingsSaveError')),
      },
    );
  };

  const toggleViewer = (viewer: LocationViewer) => {
    if (!settings?.viewers) return;
    save({
      viewerIds: settings.viewers
        .filter((item) => item.userId !== viewer.userId && item.allowed)
        .map((item) => item.userId)
        .concat(viewer.allowed ? [] : [viewer.userId]),
    });
  };

  return (
    <BottomSheet visible={!!member} onClose={onClose} maxHeightRatio={0.78}>
      <View style={styles.sheet}>
        {member ? (
          <View style={styles.head}>
            <LetterAvatar
              source={avatar}
              name={member.displayName}
              style={styles.avatar}
              letterSize={18}
            />
            <View style={styles.headText}>
              <Text style={styles.title}>{member.displayName}</Text>
              <Text style={styles.subtitle}>
                {member.userId === myId
                  ? t('mapLayers.youRole')
                  : member.kind === 'child'
                    ? t('mapLayers.childRole')
                    : t('mapLayers.parentRole')}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              onPress={onClose}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <Icon name="close" size={18} color={theme.colors.grey} />
            </Pressable>
          </View>
        ) : null}

        {isPending ? (
          <View style={styles.loading}>
            <ActivityIndicator color={theme.colors.violet} />
          </View>
        ) : isError || !settings ? (
          <Text style={styles.note}>{t('mapLayers.settingsLoadError')}</Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.fieldLabel}>{t('mapLayers.markerColor')}</Text>
            <View style={styles.swatches}>
              {settings.colors.map((color) => {
                const selected = settings.color === color;
                return (
                  <Pressable
                    key={color}
                    accessibilityRole="radio"
                    accessibilityLabel={
                      color in COLOR_LABELS
                        ? t(COLOR_LABELS[color as keyof typeof COLOR_LABELS])
                        : color
                    }
                    accessibilityState={{ selected }}
                    onPress={() => save({ color })}
                    style={({ pressed }) => [
                      styles.swatchPress,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.swatch,
                        { backgroundColor: color },
                        selected && styles.swatchSelected,
                      ]}
                    >
                      {selected ? (
                        <Icon
                          name="check"
                          size={15}
                          color={theme.colors.white}
                        />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {settings.devices.length > 0 ? (
              <>
                <Text style={styles.fieldLabel}>
                  {t('mapLayers.trackingDevice')}
                </Text>
                <View style={styles.deviceCard}>
                  {settings.devices.map((device) => {
                    const selected = settings.trackedDeviceId === device.id;
                    return (
                      <Pressable
                        key={device.id}
                        accessibilityRole="radio"
                        accessibilityLabel={device.label}
                        accessibilityState={{ selected }}
                        onPress={() => save({ trackedDeviceId: device.id })}
                        style={({ pressed }) => [
                          styles.deviceRow,
                          pressed && styles.pressed,
                        ]}
                      >
                        <View
                          style={[styles.radio, selected && styles.radioOn]}
                        />
                        <View style={styles.deviceText}>
                          <Text style={styles.deviceName}>{device.label}</Text>
                          <Text style={styles.deviceSub}>
                            {device.online
                              ? t('mapLayers.deviceOnline')
                              : device.lastSeenAt
                                ? t('mapLayers.deviceLastSeen', {
                                    ago: formatTimeAgo(
                                      new Date(device.lastSeenAt),
                                    ),
                                  })
                                : t('mapLayers.deviceNever')}
                          </Text>
                        </View>
                        <Icon
                          name="phone"
                          size={18}
                          color={theme.colors.grey}
                        />
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={styles.note}>
                  {t('mapLayers.trackingDeviceHint')}
                </Text>
              </>
            ) : (
              <Text style={styles.note}>
                {settings.kind === 'child'
                  ? t('mapLayers.noDevicesChild')
                  : t('mapLayers.noDevicesParent')}
              </Text>
            )}

            {settings.viewers && settings.viewers.length > 0 ? (
              <>
                <Text style={styles.fieldLabel}>
                  {t('mapLayers.visibilityTitle')}
                </Text>
                <View style={styles.deviceCard}>
                  {settings.viewers.map((viewer) => (
                    <Pressable
                      key={viewer.userId}
                      accessibilityRole="checkbox"
                      accessibilityLabel={viewer.displayName}
                      accessibilityState={{ checked: viewer.allowed }}
                      onPress={() => toggleViewer(viewer)}
                      style={({ pressed }) => [
                        styles.viewerRow,
                        pressed && styles.pressed,
                      ]}
                    >
                      <LetterAvatar
                        source={
                          viewer.avatarUrl
                            ? authorizedImage(viewer.avatarUrl)
                            : null
                        }
                        name={viewer.displayName}
                        style={styles.viewerAvatar}
                        letterSize={12}
                      />
                      <Text style={styles.viewerName}>
                        {viewer.displayName}
                      </Text>
                      <View
                        style={[
                          styles.check,
                          !viewer.allowed && styles.checkOff,
                        ]}
                      >
                        {viewer.allowed ? (
                          <Icon
                            name="check"
                            size={14}
                            color={theme.colors.white}
                          />
                        ) : null}
                      </View>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.note}>{t('mapLayers.visibilityHint')}</Text>
              </>
            ) : null}
          </ScrollView>
        )}
      </View>
    </BottomSheet>
  );
}
