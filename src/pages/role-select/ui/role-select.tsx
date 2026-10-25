import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '@shared/i18n';
import { Button, Icon, type IconName } from '@shared/ui';
import { theme } from '@shared/theme';
import { styles } from './role-select.styled';

type Role = 'parent' | 'kid';

// Подписи — roleSelect.<key> и roleSelect.<key>Description.
const ROLES: readonly { key: Role; icon: IconName }[] = [
  { key: 'parent', icon: 'profile' },
  { key: 'kid', icon: 'children' },
];

export function RoleSelectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [role, setRole] = useState<Role>('parent');

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <LinearGradient
            style={styles.iconWrapper}
            colors={[theme.colors.violet, theme.colors.blue]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="star" size={44} color={theme.colors.yellow} />
          </LinearGradient>
          <Text style={styles.title}>{t('roleSelect.title')}</Text>
          <Text style={styles.subtitle}>{t('roleSelect.subtitle')}</Text>
        </View>

        <View style={styles.options}>
          {ROLES.map(({ key, icon }) => {
            const selected = role === key;
            return (
              <Pressable
                key={key}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setRole(key)}
                style={[styles.card, selected && styles.cardSelected]}
              >
                <LinearGradient
                  style={styles.cardIcon}
                  colors={[theme.colors.violet, theme.colors.blue]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name={icon} size={28} color={theme.colors.white} />
                </LinearGradient>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{t(`roleSelect.${key}`)}</Text>
                  <Text style={styles.cardDescription}>
                    {t(`roleSelect.${key}Description`)}
                  </Text>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <LinearGradient
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Button onPress={() => router.replace('/')}>
            <Text style={styles.buttonTitle}>{t('roleSelect.continue')}</Text>
          </Button>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}
