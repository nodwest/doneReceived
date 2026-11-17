import { useEffect, useState } from 'react';
import { Animated, Linking, Pressable, Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { BottomSheet, Icon, type IconName } from '@shared/ui';
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
 * но его можно свернуть после пяти секунд — рядом всегда есть кнопка «i»
 * со шторкой лицензий. Название MapLibre тут не показываем:
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

  const sources: {
    key: string;
    icon: IconName;
    title: string;
    license: string;
    url: string;
  }[] = [
    {
      key: 'osm',
      icon: 'globe-outline',
      title: t('mapAttribution.osm'),
      license: t('mapAttribution.osmLicense'),
      url: OSM_COPYRIGHT_URL,
    },
    {
      key: 'maplibre',
      icon: 'code',
      title: t('mapAttribution.maplibre'),
      license: t('mapAttribution.bsd'),
      url: MAPLIBRE_LICENSE_URL,
    },
    {
      key: 'protomaps',
      icon: 'map-fold',
      title: t('mapAttribution.protomaps'),
      license: t('mapAttribution.bsd'),
      url: PROTOMAPS_LICENSE_URL,
    },
  ];

  return (
    <>
      <View style={styles.bar} pointerEvents="box-none">
        {expanded ? (
          <Animated.View style={[styles.credit, { opacity }]}>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={t('mapAttribution.osm')}
              onPress={() => openLink(OSM_COPYRIGHT_URL)}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <Text style={styles.creditText}>
                {t('mapAttribution.credit')}
              </Text>
            </Pressable>
          </Animated.View>
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('mapAttribution.open')}
          onPress={() => setSheetOpen(true)}
          style={({ pressed }) => [styles.info, pressed && styles.pressed]}
        >
          <Text style={styles.infoText}>i</Text>
        </Pressable>
      </View>

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        maxHeightRatio={0.7}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('mapAttribution.title')}</Text>
          <View style={styles.group}>
            {sources.map((source, index) => (
              <View key={source.key}>
                {index > 0 && <View style={styles.divider} />}
                <Pressable
                  accessibilityRole="link"
                  accessibilityLabel={source.title}
                  accessibilityHint={source.license}
                  onPress={() => openLink(source.url)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.iconTile}>
                    <Icon
                      name={source.icon}
                      size={20}
                      color={theme.colors.mapAccent}
                    />
                  </View>
                  <View style={styles.rowCopy}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {source.title}
                    </Text>
                    <Text style={styles.rowSubtitle} numberOfLines={2}>
                      {source.license}
                    </Text>
                  </View>
                  <Icon
                    name="external"
                    size={20}
                    color={theme.colors.mapAccent}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </BottomSheet>
    </>
  );
}
