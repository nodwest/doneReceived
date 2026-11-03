import { Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { checkPasswordRules } from '../model/validation';
import { FieldHint } from './field-hint';
import { styles } from './password-rules.styled';

type PasswordRulesProps = {
  password: string;
  /** Невыполненные требования красным: пытались отправить слабый пароль. */
  error?: boolean;
};

/**
 * Подсказка под новым паролем: что в нём должно быть. Синяя, пока человек
 * придумывает пароль; выполненное требование становится зелёным с галочкой.
 */
export function PasswordRules({ password, error }: PasswordRulesProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, error && styles.error]}>
        {t('auth.passwordRulesTitle')}
      </Text>
      {checkPasswordRules(password).map(({ rule, met }) => (
        <FieldHint
          key={rule}
          text={t(`auth.passwordRules.${rule}`)}
          tone={met ? 'met' : error ? 'error' : 'hint'}
        />
      ))}
    </View>
  );
}
