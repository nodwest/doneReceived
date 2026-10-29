import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  InviteCodeField,
  useInviteCode,
  useJoinFamily,
} from '@features/join-family';
import { RoleIcon, useViewerRoleStore, type FamilyRole } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import { AuthLayout, GradientButton } from '@shared/ui';
import { styles } from './role-select.styled';

type Role = 'parent' | 'kid';

// Подписи — roleSelect.<key> и roleSelect.<key>Description.
const ROLES: readonly { key: Role; icon: FamilyRole }[] = [
  { key: 'parent', icon: 'parent' },
  { key: 'kid', icon: 'child' },
];

/**
 * Первый экран после установки: кто входит. Родитель по Continue попадает на
 * логин. У ребёнка карточка Kid раскрывается полем кода приглашения; когда
 * код найден, видно, в какую семью он войдёт, и Continue вступает в неё и
 * открывает главную ребёнка.
 */
export function RoleSelectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [role, setRole] = useState<Role>('parent');
  const invite = useInviteCode('child');
  const { mutate: join, isPending: joining } = useJoinFamily();
  const setViewerRole = useViewerRoleStore((state) => state.setRole);

  const onContinue = () => {
    if (role === 'parent') {
      router.push('/login');
      return;
    }
    // Вступил в семью — дальше смотрим приложение от лица ребёнка.
    join(invite.code, {
      onSuccess: () => {
        setViewerRole('child');
        router.replace('/');
      },
    });
  };

  return (
    <AuthLayout
      icon="star"
      title={t('roleSelect.title')}
      subtitle={t('roleSelect.subtitle')}
      action={
        <GradientButton
          label={t('roleSelect.continue')}
          onPress={onContinue}
          disabled={role === 'kid' && (!invite.invite || joining)}
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
                  <InviteCodeField
                    state={invite}
                    hint={t('joinFamily.childCodeHint')}
                  />
                </>
              )}
            </View>
          );
        })}
      </View>
    </AuthLayout>
  );
}
