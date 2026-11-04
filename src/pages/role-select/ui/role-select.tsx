import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChildCodeField, useChildCode } from '@features/sign-in-by-code';
import { useNewChildren, type NewChild } from '@entities/family';
import { RoleIcon, useViewerRoleStore, type FamilyRole } from '@entities/user';
import { childrenMock } from '@shared/mocks';
import { useTranslation } from '@shared/i18n';
import { AuthLayout, GradientButton } from '@shared/ui';
import { styles } from './role-select.styled';

type Role = 'parent' | 'kid';

// Подписи — roleSelect.<key> и roleSelect.<key>Description.
const ROLES: readonly { key: Role; icon: FamilyRole }[] = [
  { key: 'parent', icon: 'parent' },
  { key: 'kid', icon: 'child' },
];

const NO_CHILDREN: NewChild[] = [];

/**
 * Выбор роли при регистрации (из «Sign up» на логине). Родитель по Continue
 * попадает на регистрацию. У ребёнка карточка Kid раскрывается полем
 * одноразового кода, который родитель выдал в Family → Devices; когда код
 * найден, видно, чей это аккаунт и какая семья, и «That's me — continue»
 * открывает главную ребёнка. Пока на моках: код не гасится, вход — тот же
 * временный пропуск ребёнка.
 */
export function RoleSelectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [role, setRole] = useState<Role>('parent');
  // Дети семьи, в чьи аккаунты может вести код: из моков и созданные в
  // Family. С API имя и фото придут вместе с ответом на код.
  const { data: newChildren = NO_CHILDREN } = useNewChildren();
  const childCode = useChildCode([...childrenMock, ...newChildren]);
  const found = role === 'kid' && !!childCode.account;
  const enterAsChild = useViewerRoleStore((state) => state.enterAsChild);

  const onContinue = () => {
    if (role === 'parent') {
      router.push('/registration');
      return;
    }
    if (!childCode.account) return;
    // Вошёл в свой аккаунт — дальше смотрим приложение от лица ребёнка.
    enterAsChild();
    router.replace('/');
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
          disabled={role === 'kid' && !found}
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
