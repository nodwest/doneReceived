import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

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
import { HistorySharingSetting } from './history-sharing-setting';

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
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const web = Platform.OS === 'web';
  const now = useNow(60_000);
  const enabled = useLocationSharingStore((state) => state.enabled);
  const error = useLocationSharingStore((state) => state.error);
  const checking = useLocationSharingStore((state) => state.checking);
  const limited = useLocationSharingStore((state) => state.limited);
  const { data: locations = [] } = useFamilyLocations(familyId);
  const active = !web && enabled && !error && kind === 'child' && !!familyId;
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (!active || reduceMotion) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 1900, easing: Easing.out(Easing.quad) }),
      -1,
    );
    return () => {
      cancelAnimation(pulse);
      pulse.value = 0;
    };
  }, [active, pulse, reduceMotion]);
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.25 * (1 - pulse.value),
    transform: [{ scale: 1 + 0.38 * pulse.value }],
  }));

  if (kind !== 'child' || !familyId || !userId) {
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
  const title = web
    ? t('locationSharing.lastPointLabel')
    : t(enabled ? 'locationSharing.on' : 'locationSharing.off');
  const updated = ago
    ? t('locationSharing.lastPoint', { ago })
    : t('locationSharing.waiting');
  const subtitle = web
    ? updated
    : enabled
      ? (message ?? updated)
      : t('locationSharing.offHint');
  const preview = hovered || focused || (web && open);

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
      <View style={styles.indicator}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${subtitle}`}
          accessibilityState={{ expanded: preview || open }}
          onHoverIn={() => setHovered(true)}
          onHoverOut={() => setHovered(false)}
          onFocus={() => {
            if (web) setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
            if (web) setOpen(false);
          }}
          onPress={() => setOpen((current) => !current)}
          style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
        >
          {active && !reduceMotion && (
            <Animated.View
              pointerEvents="none"
              style={[styles.pulse, pulseStyle]}
            />
          )}
          <View style={styles.icon}>
            <Icon
              name="map"
              size={18}
              color={active ? theme.colors.mapAccent : theme.colors.grey}
            />
          </View>
        </Pressable>
        {preview && (
          <View pointerEvents="none" style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        )}
      </View>

      <BottomSheet
        visible={!web && open}
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
          {!web && open && (
            <HistorySharingSetting
              key={`${userId}:${familyId}`}
              familyId={familyId}
            />
          )}
          {checking ? (
            <ActivityIndicator size="small" color={theme.colors.childInk} />
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
