import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './child-home.styled';

/**
 * ВРЕМЕННАЯ заглушка главной ребёнка: сюда попадает ребёнок, вступивший в
 * семью на выборе роли. `?family=` — фамилия семьи. Экран ещё не нарисован.
 */
export function ChildHomePage() {
  const { t } = useTranslation();
  const { family } = useLocalSearchParams<{ family?: string }>();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <LinearGradient
          style={styles.icon}
          colors={[theme.colors.violet, theme.colors.blue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Icon name="star" size={44} color={theme.colors.yellow} />
        </LinearGradient>
        <Text style={styles.title}>
          {family
            ? t('childHome.title', {
                family: t('joinFamily.familyName', { name: family }),
              })
            : t('childHome.titleNoFamily')}
        </Text>
        <Text style={styles.subtitle}>{t('childHome.comingSoon')}</Text>
      </View>
    </SafeAreaView>
  );
}
