import { useState, type ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  createFamilyError,
  joinFamilyError,
  useCreateFamily,
  useJoinFamilyByCode,
  type SetupErrorInfo,
} from '@features/setup-family';
import { useLogout } from '@features/auth';
import { FamilyFound } from '@features/join-family';
import {
  FAMILY_NAME_MAX_LENGTH,
  formatInviteCode,
  INVITE_CODE_TEMPLATE,
  isCompleteInviteCode,
  useFamilyInvitePreview,
} from '@entities/family';
import { ROLE_COLORS } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { AuthLayout, GradientButton, Icon, type IconName } from '@shared/ui';
import { styles } from './family-setup.styled';

type Mode = 'create' | 'join';

/**
 * Семья после входа родителя: без семьи в приложение не пускаем (см.
 * `root-layout.tsx`). Карточка Create a family раскрывается полем названия —
 * POST /families, родитель становится owner. Join a family — полем кода,
 * `XXXX-XXXX`, который второй родитель видит в Family → + Family member
 * (живёт 15 минут): введён целиком — зелёная плашка с семьёй (POST
 * /families/invites/preview), потом POST /families/join. Как только семья появилась в
 * GET /families, приложение само уходит на главную.
 */
export function FamilySetupPage() {
  const { t } = useTranslation();
  const logout = useLogout();
  const [mode, setMode] = useState<Mode>('create');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const createFamily = useCreateFamily();
  const joinFamily = useJoinFamilyByCode();

  const trimmedName = name.trim();
  const canCreate = trimmedName.length > 0 && !createFamily.isPending;
  // Код введён целиком — сервер говорит, в какую семью он ведёт (код не
  // гасится, но неверный тратит попытку). Вступить — только в найденную.
  const complete = isCompleteInviteCode(code);
  const preview = useFamilyInvitePreview(
    mode === 'join' && complete ? code : null,
  );
  const foundFamily = complete ? preview.data : undefined;
  const canJoin = !!foundFamily && !joinFamily.isPending;

  let errorInfo: SetupErrorInfo | null = null;
  if (mode === 'create' && createFamily.isError) {
    errorInfo = createFamilyError(createFamily.error);
  }
  if (mode === 'join' && complete && preview.isError) {
    errorInfo = joinFamilyError(preview.error);
  }
  if (mode === 'join' && joinFamily.isError) {
    errorInfo = joinFamilyError(joinFamily.error);
  }
  const error = errorInfo ? errorText(errorInfo) : null;

  // Текст ошибки под полем: «Осталось N попыток» — дописываем к неверному коду.
  function errorText(info: SetupErrorInfo) {
    if (info.kind === 'tooManyAttempts') {
      return t('familySetup.tooManyAttempts', { count: info.minutes });
    }
    const text = t(`familySetup.errors.${info.error}`);
    if (info.attemptsLeft === null) return text;
    const left =
      info.attemptsLeft > 0
        ? t('familySetup.attemptsLeft', { count: info.attemptsLeft })
        : t('familySetup.noAttemptsLeft');
    return `${text} ${left}`;
  }

  const onSubmit = () => {
    if (mode === 'create') {
      if (!canCreate) return;
      createFamily.mutate(trimmedName, {
        onSuccess: (family) =>
          showToast(t('familySetup.created', { name: family.name })),
      });
      return;
    }
    if (!canJoin) return;
    joinFamily.mutate(code, {
      onSuccess: () => showToast(t('familySetup.joined')),
    });
  };

  const onChangeName = (value: string) => {
    setName(value);
    if (createFamily.isError) createFamily.reset();
  };

  const onChangeCode = (value: string) => {
    setCode(formatInviteCode(value));
    if (joinFamily.isError) joinFamily.reset();
  };

  return (
    <AuthLayout
      icon="home"
      title={t('familySetup.title')}
      subtitle={t('familySetup.subtitle')}
      action={
        <GradientButton
          label={
            mode === 'create'
              ? t('familySetup.createAction')
              : foundFamily
                ? t('familySetup.joinNamed', { name: foundFamily.familyName })
                : t('familySetup.joinAction')
          }
          onPress={onSubmit}
          disabled={mode === 'create' ? !canCreate : !canJoin}
        />
      }
      footnote={
        <Text style={styles.footnote}>
          {t('familySetup.wrongAccount')}{' '}
          <Text
            accessibilityRole="link"
            onPress={logout}
            style={styles.footnoteLink}
          >
            {t('familySetup.logOut')}
          </Text>
        </Text>
      }
    >
      <View style={styles.options}>
        <ChoiceCard
          icon="home"
          title={t('familySetup.create')}
          description={t('familySetup.createDescription')}
          selected={mode === 'create'}
          onSelect={() => setMode('create')}
        >
          <SetupField
            label={t('familySetup.nameLabel')}
            icon="home"
            value={name}
            onChangeText={onChangeName}
            placeholder={t('familySetup.namePlaceholder')}
            maxLength={FAMILY_NAME_MAX_LENGTH}
            autoCapitalize="words"
            hint={t('familySetup.nameHint')}
            error={error}
            onSubmit={onSubmit}
          />
        </ChoiceCard>
        <ChoiceCard
          icon="parent"
          title={t('familySetup.join')}
          description={t('familySetup.joinDescription')}
          selected={mode === 'join'}
          onSelect={() => setMode('join')}
        >
          <SetupField
            label={t('familySetup.codeLabel')}
            icon="key"
            value={code}
            onChangeText={onChangeCode}
            placeholder={t('familySetup.codePlaceholder')}
            maxLength={INVITE_CODE_TEMPLATE.length}
            autoCapitalize="characters"
            code
            hint={t('familySetup.codeHint')}
            error={error}
            onSubmit={onSubmit}
          />
          {foundFamily && !error && (
            <FamilyFound familyName={foundFamily.familyName} role="parent" />
          )}
        </ChoiceCard>
      </View>
    </AuthLayout>
  );
}

type ChoiceCardProps = {
  icon: IconName;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  /** Поле под чертой: видно, только пока карточка выбрана. */
  children: ReactNode;
};

/** Карточка выбора с радио, как на выборе роли; выбранная раскрывается. */
function ChoiceCard({
  icon,
  title,
  description,
  selected,
  onSelect,
  children,
}: ChoiceCardProps) {
  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        onPress={onSelect}
        style={styles.cardRow}
      >
        <LinearGradient
          colors={ROLE_COLORS.parent.icon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.7071]}
          style={styles.cardIcon}
        >
          <Icon name={icon} size={30} color={theme.colors.white} />
        </LinearGradient>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.radioDot} />}
        </View>
      </Pressable>
      {selected && (
        <>
          <View style={styles.divider} />
          {children}
        </>
      )}
    </View>
  );
}

type SetupFieldProps = {
  label: string;
  icon: IconName;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  maxLength: number;
  autoCapitalize: 'characters' | 'words';
  /** Код: читается по группам, без сжатия букв. */
  code?: boolean;
  hint: string;
  /** Текст ошибки вместо подсказки, красная рамка. */
  error: string | null;
  onSubmit: () => void;
};

/** Поле в раскрытой карточке: подпись, ввод с иконкой, подсказка или ошибка. */
function SetupField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  maxLength,
  autoCapitalize,
  code,
  hint,
  error,
  onSubmit,
}: SetupFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        <Icon
          name={icon}
          size={20}
          color={error ? theme.colors.dangerText : theme.colors.violet}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.placeholder}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          autoComplete="off"
          spellCheck={false}
          returnKeyType="done"
          accessibilityLabel={label}
          style={[styles.text, code && styles.codeText]}
        />
      </View>
      <Text style={[styles.hint, !!error && styles.error]}>
        {error ?? hint}
      </Text>
    </View>
  );
}
