import { View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import {
  AuthFootnote,
  AuthLayout,
  GradientButton,
  InputWithIcon,
  Label,
} from '@shared/ui';
import { styles } from './login.styled';

/** Логин родителя: почта и пароль, ссылка на регистрацию. */
export function Login() {
  const { t } = useTranslation();
  return (
    <AuthLayout
      icon="lock"
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      action={<GradientButton label={t('auth.logIn')} />}
      footnote={
        <AuthFootnote
          text={t('auth.noAccount')}
          linkLabel={t('auth.signUp')}
          href="/registration"
        />
      }
    >
      <View style={styles.form}>
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
    </AuthLayout>
  );
}
