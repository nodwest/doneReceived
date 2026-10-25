import { ScrollView, View, Text } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '@shared/i18n';
import { Button, Icon, InputWithIcon, Label } from '@shared/ui';
import { styles } from './registration.styled';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@shared/theme';

export function Registration() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <LinearGradient
              style={styles.iconWrapper}
              colors={[theme.colors.violet, theme.colors.blue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="star" size={44} color={theme.colors.yellow} />
            </LinearGradient>
            <Text style={styles.title}>{t('auth.registrationTitle')}</Text>
            <Text style={styles.subtitle}>
              {t('auth.registrationSubtitle')}
            </Text>
          </View>
          <View style={styles.body}>
            <View style={styles.content}>
              <View style={styles.field}>
                <Label htmlFor="name" style={styles.label}>
                  {t('auth.fullName')}
                </Label>
                <InputWithIcon
                  id="name"
                  placeholder={t('auth.fullName')}
                  iconName="user"
                />
              </View>
              <View style={styles.field}>
                <Label htmlFor="email" style={styles.label}>
                  {t('auth.email')}
                </Label>
                <InputWithIcon
                  id="email"
                  placeholder={t('auth.email')}
                  iconName="message"
                />
              </View>
              <View style={styles.field}>
                <Label htmlFor="password" style={styles.label}>
                  {t('auth.password')}
                </Label>
                <InputWithIcon
                  secureTextEntry={true}
                  id="password"
                  placeholder={t('auth.password')}
                  iconName="castle"
                />
              </View>
            </View>
          </View>
          <View style={styles.footer}>
            <LinearGradient
              colors={[theme.colors.violet, theme.colors.blue]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Button>
                <Text style={styles.buttontitle}>
                  {t('auth.createAccount')}
                </Text>
              </Button>
            </LinearGradient>
          </View>
          <Text style={styles.subtitle}>
            {t('auth.haveAccount')}{' '}
            <Link href="/login" style={styles.linktitle}>
              {t('auth.logIn')}
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
