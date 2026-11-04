import { Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { ChildAccount } from '../model/use-child-code';
import { styles } from './child-account-found.styled';

/**
 * Зелёная плашка под кодом: «Hi, Emma!» и «Miller family · your account» —
 * в чей аккаунт и в какую семью войдёт ребёнок. Без фото — буква имени.
 */
export function ChildAccountFound({ name, avatar, familyName }: ChildAccount) {
  const { t } = useTranslation();
  return (
    <LinearGradient
      colors={[theme.colors.approvedFrom, theme.colors.approvedTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {avatar ? (
        <Image source={avatar} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.initial]}>
          <Text style={styles.initialText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.text}>
        <Text style={styles.greeting} numberOfLines={1}>
          {t('childCode.greeting', { name })}
        </Text>
        <Text style={styles.account} numberOfLines={2}>
          {t('childCode.account', { family: familyName })}
        </Text>
      </View>
      <View style={styles.check}>
        <Icon name="check" size={14} color={theme.colors.white} />
      </View>
    </LinearGradient>
  );
}
