import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { FamilyInvite } from '@entities/family';
import { RoleIcon } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './family-found.styled';

/** Зелёная плашка: в какую семью и кем войдёт человек по введённому коду. */
export function FamilyFound({ familyName, role }: FamilyInvite) {
  const { t } = useTranslation();
  return (
    <LinearGradient
      colors={[theme.colors.approvedFrom, theme.colors.approvedTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <RoleIcon role={role} size={44} />
      <View style={styles.text}>
        <Text style={styles.family} numberOfLines={1}>
          {t('joinFamily.familyName', { name: familyName })}
        </Text>
        <Text style={styles.role}>{t(`joinFamily.joinAs.${role}`)}</Text>
      </View>
      <View style={styles.check}>
        <Icon name="check" size={14} color={theme.colors.white} />
      </View>
    </LinearGradient>
  );
}
