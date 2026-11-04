import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { CONNECT_CODE_TEMPLATE } from '@entities/device';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { ChildCodeState } from '../model/use-child-code';
import { ChildAccountFound } from './child-account-found';
import { styles } from './child-code-field.styled';

type ChildCodeFieldProps = {
  /** Состояние из useChildCode. */
  state: ChildCodeState;
};

/**
 * Поле одноразового кода от родителя на выборе роли: подпись, ввод с
 * шаблоном XXXX-XXXX, подсказка, где родитель берёт код, или красная ошибка
 * («код истёк или уже использован») и зелёная плашка найденного аккаунта.
 */
export function ChildCodeField({ state }: ChildCodeFieldProps) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const { code, setCode, status, account } = state;
  const invalid = status === 'invalid';

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>{t('childCode.label')}</Text>
        <View
          style={[
            styles.input,
            focused && styles.inputFocused,
            invalid && styles.inputError,
          ]}
        >
          <Icon
            name="key"
            size={20}
            color={invalid ? theme.colors.dangerText : theme.colors.violet}
          />
          <TextInput
            value={code}
            onChangeText={setCode}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={CONNECT_CODE_TEMPLATE}
            placeholderTextColor={theme.colors.placeholder}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            maxLength={CONNECT_CODE_TEMPLATE.length}
            accessibilityLabel={t('childCode.label')}
            style={styles.text}
          />
        </View>
        <Text style={[styles.hint, invalid && styles.error]}>
          {invalid ? t('childCode.invalid') : t('childCode.hint')}
        </Text>
      </View>
      {account && <ChildAccountFound {...account} />}
    </View>
  );
}
