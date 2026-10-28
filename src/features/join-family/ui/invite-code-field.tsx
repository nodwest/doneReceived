import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { INVITE_CODE_TEMPLATE } from '@entities/family';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import type { InviteCodeState } from '../model/use-invite-code';
import { FamilyFound } from './family-found';
import { styles } from './invite-code-field.styled';

// Длина кода с дефисами.
const MAX_LENGTH = INVITE_CODE_TEMPLATE.length;

type InviteCodeFieldProps = {
  /** Состояние из useInviteCode. */
  state: InviteCodeState;
  /** Подсказка под полем: где взять код. */
  hint: string;
};

/**
 * Поле кода приглашения: подпись, ввод с шаблоном кода в плейсхолдере,
 * подсказка или ошибка под ним и зелёная плашка найденной семьи. Общее для
 * панели Join family и карточки Kid на выборе роли.
 */
export function InviteCodeField({ state, hint }: InviteCodeFieldProps) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const { code, setCode, status, invite, role } = state;
  const error =
    status === 'not-found'
      ? t('joinFamily.notFound')
      : status === 'wrong-role'
        ? t(`joinFamily.wrongRole.${role}`)
        : null;

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>{t('joinFamily.codeLabel')}</Text>
        <View
          style={[
            styles.input,
            focused && styles.inputFocused,
            error && styles.inputError,
          ]}
        >
          <Icon name="key" size={20} color={theme.colors.violet} />
          <TextInput
            value={code}
            onChangeText={setCode}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={INVITE_CODE_TEMPLATE}
            placeholderTextColor={theme.colors.placeholder}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            maxLength={MAX_LENGTH}
            accessibilityLabel={t('joinFamily.codeLabel')}
            style={styles.text}
          />
        </View>
        <Text style={[styles.hint, error && styles.error]}>
          {error ?? hint}
        </Text>
      </View>
      {invite && <FamilyFound {...invite} />}
    </View>
  );
}
