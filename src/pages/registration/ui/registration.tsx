import { View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import {
  AuthFootnote,
  AuthLayout,
  GradientButton,
  InputWithIcon,
  Label,
} from '@shared/ui';
import { styles } from './registration.styled';

/** Регистрация родителя: имя, почта, пароль с повтором, ссылка на логин. */
export function Registration() {
  const { t } = useTranslation();
  return (
    <AuthLayout
      icon="star"
      title={t('auth.registrationTitle')}
      subtitle={t('auth.registrationSubtitle')}
      action={<GradientButton label={t('auth.createAccount')} />}
      footnote={
        <AuthFootnote
          text={t('auth.haveAccount')}
          linkLabel={t('auth.logIn')}
          href="/login"
        />
      }
    >
      <View style={styles.form}>
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
        <View style={styles.field}>
          <Label htmlFor="confirm-password" style={styles.label}>
            {t('auth.confirmPassword')}
          </Label>
          <InputWithIcon
            secureTextEntry={true}
            id="confirm-password"
            placeholder={t('auth.confirmPassword')}
            iconName="castle"
          />
        </View>
      </View>
    </AuthLayout>
  );
}
