import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { InviteRole } from '@entities/family';
import { RoleIcon } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './family-found.styled';

type FamilyFoundProps = {
  familyName: string;
  /** Кем войдёт человек. */
  role: InviteRole;
  /** Кто уже в семье — строкой под ролью; нет — строки нет. */
  members?: readonly string[];
};

/**
 * Зелёная плашка: в какую семью и кем войдёт человек по введённому коду, и
 * кто в ней уже есть.
 */
export function FamilyFound({ familyName, role, members }: FamilyFoundProps) {
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
        {!!members?.length && (
          <Text style={styles.members} numberOfLines={2}>
            {members.join(', ')}
          </Text>
        )}
      </View>
      <View style={styles.check}>
        <Icon name="check" size={14} color={theme.colors.white} />
      </View>
    </LinearGradient>
  );
}
