import { useEffect, useState } from 'react';
import { Animated, Linking, Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { BottomSheet, Icon } from '@shared/ui';
import { styles } from './map-attribution.styled';

const OSM_COPYRIGHT_URL = 'https://www.openstreetmap.org/copyright';
const MAPLIBRE_LICENSE_URL =
  'https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt';
const PROTOMAPS_LICENSE_URL =
  'https://github.com/protomaps/basemaps/blob/main/LICENSE';

/** Сколько подпись источников показывается раскрытой (гайдлайны OSMF: 5 с). */
const CREDIT_VISIBLE_MS = 5000;
const FADE_MS = 200;

/**
 * Подпись источников карты. Данные OpenStreetMap под ODbL: credit обязателен,
 * но его можно свернуть после пяти секунд или по взаимодействию с картой —
 * остаётся кнопка «i» с лицензиями. Название MapLibre тут не показываем:
 * BSD-3-Clause этого не требует, текст лицензии доступен в шторке.
 */
export function MapAttribution() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!expanded) return;
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (!finished) return;
        setExpanded(false);
      });
    }, CREDIT_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [expanded, opacity]);

  const openLink = (url: string) => {
    void Linking.openURL(url);
  };

  return (
    <>
      {expanded ? (
        <Animated.View style={[styles.credit, { opacity }]}>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t('mapAttribution.osm')}
            onPress={() => openLink(OSM_COPYRIGHT_URL)}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.creditText}>{t('mapAttribution.credit')}</Text>
          </Pressable>
        </Animated.View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('mapAttribution.open')}
          onPress={() => setSheetOpen(true)}
          style={({ pressed }) => [styles.info, pressed && styles.pressed]}
        >
          <Text style={styles.infoText}>i</Text>
        </Pressable>
      )}

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        maxHeightRatio={0.7}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('mapAttribution.title')}</Text>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t('mapAttribution.osm')}
            onPress={() => openLink(OSM_COPYRIGHT_URL)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{t('mapAttribution.osm')}</Text>
              <Text style={styles.rowSubtitle}>
                {t('mapAttribution.osmLicense')}
              </Text>
            </View>
            <Icon name="external" size={18} color={theme.colors.grey} />
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t('mapAttribution.maplibre')}
            onPress={() => openLink(MAPLIBRE_LICENSE_URL)}
            style={({ pressed }) => [
              styles.row,
              styles.rowDivider,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>
                {t('mapAttribution.maplibre')}
              </Text>
              <Text style={styles.rowSubtitle}>{t('mapAttribution.bsd')}</Text>
            </View>
            <Icon name="external" size={18} color={theme.colors.grey} />
          </Pressable>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel={t('mapAttribution.protomaps')}
            onPress={() => openLink(PROTOMAPS_LICENSE_URL)}
            style={({ pressed }) => [
              styles.row,
              styles.rowDivider,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>
                {t('mapAttribution.protomaps')}
              </Text>
              <Text style={styles.rowSubtitle}>{t('mapAttribution.bsd')}</Text>
            </View>
            <Icon name="external" size={18} color={theme.colors.grey} />
          </Pressable>
        </View>
      </BottomSheet>
    </>
  );
}
