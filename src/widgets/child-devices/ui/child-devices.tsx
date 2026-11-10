import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ConnectDevicePanel } from '@features/connect-device';
import { useRevokeDevice } from '@features/revoke-device';
import { DeviceRow, useChildDevices, type Device } from '@entities/device';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme } from '@shared/theme';
import { Icon } from '@shared/ui';
import { styles } from './child-devices.styled';

const NO_DEVICES: Device[] = [];

type ChildDevicesProps = {
  /**
   * Семья на сервере: устройства, код и отключение — настоящие. null —
   * моковый ребёнок (Emma, Liam), устройства передаёт страница.
   */
  familyId: string | null;
  childId: string;
  childName: string;
  /** Устройства мокового ребёнка; у ребёнка с сервера не нужны. */
  mockDevices?: Device[];
  /**
   * Раскрыт ли блок. Открытостью управляет страница: раскрыли у одного
   * ребёнка — у другого он сворачивается.
   */
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  /**
   * Раскрытый блок встал на место или поменял высоту (список ↔ код) —
   * страница прокручивает так, чтобы он был виден целиком.
   */
  onReveal?: (block: View) => void;
};

/** Что показывает раскрытый блок: список устройств или код подключения. */
type Panel = 'list' | 'connect';

/**
 * Низ карточки ребёнка на Family (видит родитель): сколько устройств, по
 * тапу — список с корзинами и «Connect a new device», который на месте
 * списка открывает код подключения. Без устройств — «No devices yet» и
 * Connect device сразу к коду. Заголовок раскрытого блока сворачивает его.
 */
export function ChildDevices({
  familyId,
  childId,
  childName,
  mockDevices = NO_DEVICES,
  expanded,
  onExpandedChange,
  onReveal,
}: ChildDevicesProps) {
  const { t } = useTranslation();
  const [panel, setPanel] = useState<Panel>('list');
  const blockRef = useRef<View>(null);
  const { data: serverDevices = NO_DEVICES } = useChildDevices(
    familyId,
    childId,
  );
  const devices = familyId ? serverDevices : mockDevices;
  const hasDevices = devices.length > 0;
  const revoke = useRevokeDevice(familyId ?? '', childId);

  // Корзина: устройство с сервера отключается (на нём ребёнок выйдет), у
  // моковых — только тост.
  const remove = (device: Device) => {
    if (!familyId) {
      showToast(t('devices.removeSoon'));
      return;
    }
    revoke.mutate(device.id, {
      onSuccess: () => showToast(t('devices.removed', { name: device.name })),
      onError: () => showToast(t('devices.removeFailed')),
    });
  };

  // Каждое открытие явно выбирает, что показать: блок мог свернуться
  // извне (раскрыли другого ребёнка) с открытым кодом.
  const open = (next: Panel) => {
    setPanel(next);
    onExpandedChange(true);
  };

  // Блок раскрылся или сменил список на код — просим страницу показать
  // его целиком. Не через onLayout: в вебе он у этого блока не приходит.
  // Кадр ждём, чтобы новая высота уже была на экране.
  const onRevealRef = useRef(onReveal);
  useEffect(() => {
    onRevealRef.current = onReveal;
  });
  useEffect(() => {
    if (!expanded) return;
    const frame = requestAnimationFrame(() => {
      if (blockRef.current) onRevealRef.current?.(blockRef.current);
    });
    return () => cancelAnimationFrame(frame);
  }, [expanded, panel]);

  if (!expanded) {
    if (!hasDevices) {
      return (
        <View style={[styles.toggle, styles.toggleNone]}>
          <Icon name="phone" size={16} color={theme.colors.placeholderSoft} />
          <Text style={[styles.toggleLabel, styles.toggleLabelNone]}>
            {t('devices.none')}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => open('connect')}
            style={({ pressed }) => [styles.connect, pressed && styles.pressed]}
          >
            <Icon name="plus" size={16} color={theme.colors.white} />
            <Text style={styles.connectLabel}>{t('devices.connect')}</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('devices.show', { name: childName })}
        onPress={() => open('list')}
        style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
      >
        <Icon name="phone" size={16} color={theme.colors.blue} />
        <Text style={styles.toggleLabel}>
          {t('devices.count', { count: devices.length })}
        </Text>
        <Icon name="chevron-down" size={18} color={theme.colors.grey} />
      </Pressable>
    );
  }

  const connecting = panel === 'connect';
  return (
    <View ref={blockRef}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('devices.hide', { name: childName })}
        onPress={() => onExpandedChange(false)}
        style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
      >
        <Icon
          name="phone"
          size={16}
          color={connecting ? theme.colors.violet : theme.colors.blue}
        />
        <Text style={[styles.toggleLabel, styles.toggleLabelOpen]}>
          {connecting ? t('connectDevice.title') : t('devices.title')}
        </Text>
        <View style={styles.chevronUp}>
          <Icon name="chevron-down" size={18} color={theme.colors.violet} />
        </View>
      </Pressable>
      <View style={[styles.panel, connecting && styles.panelConnect]}>
        {connecting ? (
          <ConnectDevicePanel
            familyId={familyId}
            childId={childId}
            childName={childName}
          />
        ) : (
          <>
            {devices.map((device) => (
              <DeviceRow
                key={device.id}
                device={device}
                onRemove={() => remove(device)}
              />
            ))}
            <Pressable
              accessibilityRole="button"
              onPress={() => setPanel('connect')}
              style={({ pressed }) => [
                styles.connectNew,
                pressed && styles.pressed,
              ]}
            >
              <Icon name="plus" size={16} color={theme.colors.violet} />
              <Text style={styles.connectNewLabel}>
                {t('devices.connectNew')}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
