import { View } from 'react-native';
import { useViewerRole, useViewerRoleStore } from '@entities/user';
import { useTranslation } from '@shared/i18n';
import { SettingsRow, Toggle } from '@shared/ui';
import { styles } from './child-mode-toggle.styled';

/**
 * ВРЕМЕННЫЙ тогл в профиле: смотреть приложение от лица ребёнка (Emma
 * Miller) или родителя (Sarah Miller). Уберём, когда появится вход ребёнка.
 */
export function ChildModeToggle() {
  const { t } = useTranslation();
  const role = useViewerRole();
  const setRole = useViewerRoleStore((state) => state.setRole);

  return (
    <View style={styles.card}>
      <SettingsRow
        icon="child"
        label={t('profile.childMode')}
        right={
          <Toggle
            value={role === 'child'}
            onValueChange={(on) => setRole(on ? 'child' : 'parent')}
            accessibilityLabel={t('profile.childMode')}
          />
        }
      />
    </View>
  );
}
