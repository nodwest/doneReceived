import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChildCodeField,
  useChildCode,
  usePairDevice,
} from '@features/sign-in-by-code';
import { RoleIcon, type FamilyRole } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { AuthLayout, GradientButton } from '@shared/ui';
import { styles } from './role-select.styled';

type Role = 'parent' | 'kid';

// Подписи — roleSelect.<key> и roleSelect.<key>Description.
const ROLES: readonly { key: Role; icon: FamilyRole }[] = [
  { key: 'parent', icon: 'parent' },
  { key: 'kid', icon: 'child' },
];

/**
 * Выбор роли при регистрации (из «Sign up» на логине). Родитель по Continue
 * попадает на регистрацию. У ребёнка карточка Kid раскрывается полем
 * одноразового кода, который родитель выдал в Family → Devices; сервер
 * отвечает, чей это профиль и какая семья (код не гасится), и «That's me —
 * continue» подключает устройство: сессия ребёнка, его главная.
 */
export function RoleSelectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [role, setRole] = useState<Role>('parent');
  const childCode = useChildCode();
  const found = role === 'kid' && !!childCode.account;
  const pair = usePairDevice();

  const onContinue = () => {
    if (role === 'parent') {
      router.push('/registration');
      return;
    }
    if (!childCode.account || pair.isPending) return;
    // Сессия ребёнка сохранена — экраны входа закрываются, открывается его
    // главная.
    pair.mutate(childCode.code, {
      onSuccess: () => router.replace('/'),
      onError: () => showToast(t('childCode.pairFailed')),
    });
  };

  return (
    <AuthLayout
      icon="star"
      title={t('roleSelect.title')}
      subtitle={t('roleSelect.subtitle')}
      action={
        <GradientButton
          label={
            found ? t('roleSelect.continueFound') : t('roleSelect.continue')
          }
          onPress={onContinue}
          disabled={role === 'kid' && (!found || pair.isPending)}
        />
      }
    >
      <View style={styles.options}>
        {ROLES.map(({ key, icon }) => {
          const selected = role === key;
          return (
            <View
              key={key}
              style={[styles.card, selected && styles.cardSelected]}
            >
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setRole(key)}
                style={styles.cardRow}
              >
                <RoleIcon role={icon} size={56} />
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle}>{t(`roleSelect.${key}`)}</Text>
                  <Text style={styles.cardDescription}>
                    {t(`roleSelect.${key}Description`)}
                  </Text>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </Pressable>
              {/* Выбранная карточка Kid снизу продолжается полем кода. */}
              {key === 'kid' && selected && (
                <>
                  <View style={styles.divider} />
                  <ChildCodeField state={childCode} />
                </>
              )}
            </View>
          );
        })}
      </View>
    </AuthLayout>
  );
}
