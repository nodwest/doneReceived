import { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  useSessionFamilyId,
  useSessionKind,
  useSessionStore,
} from '@entities/session';
import { useTranslation } from '@shared/i18n';
import { formatTimeAgo, useNow } from '@shared/lib';
import { theme } from '@shared/theme';
import { BottomSheet, GradientButton, Icon, PillButton } from '@shared/ui';
import { useFamilyLocations } from '../model/use-family-locations';
import { useLocationSharingStore } from '../model/location-sharing-store';
import {
  disableLocationSharing,
  enableLocationSharingWithToast,
  sharingErrorMessage,
} from '../model/use-child-location-sharing';
import { styles } from './location-sharing-card.styled';

/**
 * Плавающая карточка на карте ребёнка: явный выбор шаринга, состояние
 * разрешений и возраст последней точки. Выключение всегда доступно.
 */
export function LocationSharingCard() {
  const { t } = useTranslation();
  const kind = useSessionKind();
  const familyId = useSessionFamilyId();
  const userId = useSessionStore((state) => state.session?.user.id ?? null);
  const childId = useSessionStore((state) => state.session?.childId ?? null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const now = useNow(60_000);
  const enabled = useLocationSharingStore((state) => state.enabled);
  const error = useLocationSharingStore((state) => state.error);
  const checking = useLocationSharingStore((state) => state.checking);
  const limited = useLocationSharingStore((state) => state.limited);
  const { data: locations = [] } = useFamilyLocations(familyId);

  if (Platform.OS === 'web' || kind !== 'child' || !familyId || !userId) {
    return null;
  }

  const own = locations.find(
    (location) =>
      location.childId === childId ||
      (childId === null && location.userId === userId),
  );
  const lastPoint = own?.recordedAt ?? own?.updatedAt;
  const ago = lastPoint ? formatTimeAgo(new Date(lastPoint), now) : null;
  const message = sharingErrorMessage(error);

  const turnOn = async () => {
    setBusy(true);
    try {
      await enableLocationSharingWithToast(userId, familyId);
    } finally {
      setBusy(false);
    }
  };

  const turnOff = async () => {
    setBusy(true);
    try {
      await disableLocationSharing(userId, familyId);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(
          enabled ? 'locationSharing.openOn' : 'locationSharing.openOff',
        )}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.icon}>
          <Icon
            name="map"
            size={18}
            color={enabled ? theme.colors.earned : theme.colors.childDeep}
          />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>
            {enabled ? t('locationSharing.on') : t('locationSharing.off')}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {enabled
              ? (message ??
                (ago
                  ? t('locationSharing.lastPoint', { ago })
                  : t('locationSharing.waiting')))
              : t('locationSharing.offHint')}
          </Text>
        </View>
        <View style={[styles.dot, (error || !enabled) && styles.dotError]} />
      </Pressable>

      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        maxHeightRatio={0.82}
      >
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{t('locationSharing.title')}</Text>
          <Text style={styles.sheetText}>{t('locationSharing.intro')}</Text>
          <View style={styles.bullet}>
            <View style={styles.bulletMark} />
            <Text style={styles.bulletText}>
              {t('locationSharing.onlyFamily')}
            </Text>
          </View>
          <View style={styles.bullet}>
            <View style={styles.bulletMark} />
            <Text style={styles.bulletText}>
              {t('locationSharing.backgroundNotice')}
            </Text>
          </View>
          <View style={styles.bullet}>
            <View style={styles.bulletMark} />
            <Text style={styles.bulletText}>
              {t('locationSharing.osLimits')}
            </Text>
          </View>

          <View style={styles.status}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>
                {t('locationSharing.status')}
              </Text>
              <Text style={styles.statusValue}>
                {enabled
                  ? t('locationSharing.enabled')
                  : t('locationSharing.disabled')}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>
                {t('locationSharing.lastPointLabel')}
              </Text>
              <Text style={styles.statusValue}>
                {ago ?? t('locationSharing.waiting')}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>
                {t('locationSharing.osPermission')}
              </Text>
              <Text style={styles.statusValue}>
                {error === 'permission'
                  ? t('locationSharing.permissionShort')
                  : t('locationSharing.permissionOk')}
              </Text>
            </View>
            {limited ? (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>
                  {t('locationSharing.precision')}
                </Text>
                <Text style={styles.statusValue}>
                  {t('locationSharing.limitedAccuracy')}
                </Text>
              </View>
            ) : null}
          </View>

          {message ? <Text style={styles.error}>{message}</Text> : null}
          {checking ? (
            <ActivityIndicator size="small" color={theme.colors.childDeep} />
          ) : null}

          <GradientButton
            label={t(
              enabled ? 'locationSharing.turnOff' : 'locationSharing.turnOn',
            )}
            onPress={enabled ? turnOff : turnOn}
            loading={busy}
            tone="blue"
          />
          {error === 'permission' || error === 'notifications' ? (
            <PillButton
              label={t('locationSharing.openSettings')}
              variant="outline"
              onPress={() => void Linking.openSettings()}
            />
          ) : null}
          <PillButton
            label={t('common.close')}
            variant="ghost"
            onPress={() => setOpen(false)}
          />
        </View>
      </BottomSheet>
    </>
  );
}
