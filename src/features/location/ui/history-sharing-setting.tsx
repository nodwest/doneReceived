import { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { apiRequest } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { styles } from './location-sharing-card.styled';

export function HistorySharingSetting({ familyId }: { familyId: string }) {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState<boolean>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const path = `/families/${encodeURIComponent(familyId)}/children/me/location-history/settings`;

  useEffect(() => {
    let active = true;
    apiRequest<{ enabled: boolean }>(path).then(
      (data) => {
        if (active) setEnabled(data.enabled);
      },
      () => {
        if (active) setError(true);
      },
    );
    return () => {
      active = false;
    };
  }, [path, attempt]);

  async function change(value: boolean) {
    setBusy(true);
    setError(false);
    try {
      const data = await apiRequest<{ enabled: boolean }>(path, {
        method: 'PUT',
        body: { enabled: value },
      });
      setEnabled(data.enabled);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.status}>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>{t('mapHistory.record')}</Text>
        <Switch
          accessibilityLabel={t('mapHistory.record')}
          value={enabled === true}
          disabled={enabled === undefined || busy}
          onValueChange={(value) => void change(value)}
        />
      </View>
      <Text style={styles.bulletText}>{t('mapHistory.recordHint')}</Text>
      {error && (
        <Text
          style={styles.error}
          onPress={() => {
            setError(false);
            setAttempt(attempt + 1);
          }}
        >
          {t('mapHistory.error')}
        </Text>
      )}
    </View>
  );
}
