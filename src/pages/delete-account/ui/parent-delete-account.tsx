import { useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { TabScreen } from '@widgets/bottom-nav';
import { DeleteParentAccountSheet } from '@features/delete-parent-account';
import { useFamilyChildren } from '@entities/family';
import {
  clearSavedPushToken,
  deleteMyAccount,
  useAccountDeletionPreview,
  useSessionFamilyId,
  useSessionStore,
} from '@entities/session';
import { hasApiErrorCode, isApiError } from '@shared/api';
import { useTranslation } from '@shared/i18n';
import { showToast } from '@shared/lib';
import { theme, useTheme } from '@shared/theme';
import { Icon, PillButton, RoundButton, type IconName } from '@shared/ui';
import { styles } from './parent-delete-account.styled';

const goBack = () =>
  router.canGoBack() ? router.back() : router.replace('/profile');

const formatPoints = (points: string, language?: string) => {
  try {
    return new Intl.NumberFormat(language).format(BigInt(points));
  } catch {
    return points;
  }
};

const sumPoints = (values: string[]) => {
  try {
    return values
      .reduce((total, value) => total + BigInt(value), BigInt(0))
      .toString();
  } catch {
    return null;
  }
};

/**
 * Удаление аккаунта родителя: условия и суммы из GET /users/me/deletion-preview,
 * подтверждение паролем и DELETE /users/me. 409 ACCOUNT_DELETION_CHANGED
 * перечитывает preview и требует подтвердить всё заново.
 */
export function ParentDeleteAccountPage() {
  useTheme();
  const { t, i18n } = useTranslation();
  const deletionPreview = useAccountDeletionPreview(true);
  const familyId = useSessionFamilyId();
  const { data: familyChildren } = useFamilyChildren(familyId);
  const submitting = useRef(false);
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Пароль живёт только здесь, на экране: не в хранилище и не в ключах запросов.
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);
  const [changed, setChanged] = useState(false);

  const preview = deletionPreview.data;
  const canConfirm =
    !!preview && !deletionPreview.isFetching && !deletionPreview.isError;
  const childNames = new Map(
    (familyChildren ?? []).map((child) => [child.id, child.displayName]),
  );
  const childrenPoints = preview?.children ?? [];
  const totalPoints = preview
    ? sumPoints([
        preview.parentPoints,
        ...childrenPoints.map((child) => child.points),
      ])
    : null;

  const openConfirmation = () => {
    if (!canConfirm || deleting) return;
    setPassword('');
    setWrongPassword(false);
    setSheetOpen(true);
  };

  const confirmDelete = async () => {
    const userId = useSessionStore.getState().session?.user.id;
    if (!userId || !preview || !canConfirm || !password || submitting.current)
      return;
    submitting.current = true;
    setDeleting(true);
    const currentPassword = password;
    setPassword('');
    setWrongPassword(false);
    setChanged(false);
    try {
      await deleteMyAccount({
        currentPassword,
        confirmation: preview.confirmation,
      });
      const current = useSessionStore.getState();
      if (current.session?.user.id !== userId) return;
      clearSavedPushToken();
      const signedOut = current.signOut();
      queryClient.clear();
      await signedOut;
      if (!useSessionStore.getState().session) {
        showToast(t('deleteAccount.deleted'));
        router.replace('/login');
      }
    } catch (error) {
      if (useSessionStore.getState().session?.user.id !== userId) return;
      if (
        isApiError(error) &&
        hasApiErrorCode(error, 'ACCOUNT_DELETION_CHANGED')
      ) {
        setSheetOpen(false);
        setChanged(true);
        await deletionPreview.refetch();
      } else if (isApiError(error) && error.status === 429) {
        showToast(t('deleteAccount.parent.tooManyAttempts'));
      } else if (
        isApiError(error) &&
        hasApiErrorCode(error, 'INVALID_CURRENT_PASSWORD')
      ) {
        setWrongPassword(true);
      } else {
        showToast(t('deleteAccount.parent.deleteFailed'));
      }
    } finally {
      submitting.current = false;
      setDeleting(false);
    }
  };

  const childLabel = (childId: string) =>
    childNames.get(childId) ?? t('deleteAccount.parent.childFallback');
  const pointsText = (points: string) =>
    t('deleteAccount.points', { count: Number(points) || 0 });

  return (
    <TabScreen activeKey="profile">
      <View style={styles.header}>
        <RoundButton
          icon="arrow-left"
          accessibilityLabel={t('common.back')}
          onPress={goBack}
        />
        <Text style={styles.title}>{t('deleteAccount.title')}</Text>
        {/* Пустое место справа держит заголовок по центру. */}
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {preview ? (
          <>
            {changed ? (
              <Text accessibilityLiveRegion="polite" style={styles.changed}>
                {t('deleteAccount.parent.changed')}
              </Text>
            ) : null}
            {changed && deletionPreview.isError ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => void deletionPreview.refetch()}
                style={styles.retry}
              >
                <Text style={styles.sectionTitle}>{t('common.retry')}</Text>
              </Pressable>
            ) : null}
            <View style={styles.pointsCard}>
              <View style={styles.pointsHeading}>
                <Icon name="wallet" size={20} color={theme.colors.ink} />
                <Text accessibilityRole="header" style={styles.sectionTitle}>
                  {t(
                    preview.deleteFamily
                      ? 'deleteAccount.parent.pointsDeletedTitle'
                      : 'deleteAccount.parent.pointsStayingTitle',
                  )}
                </Text>
              </View>
              <Text style={styles.total}>
                {formatPoints(
                  totalPoints ?? preview.parentPoints,
                  i18n.language,
                )}
                <Text style={styles.unit}>
                  {' '}
                  {pointsText(totalPoints ?? preview.parentPoints)}
                </Text>
              </Text>
              <View style={styles.breakdown}>
                <PointRow
                  label={t('deleteAccount.parent.parentBalance')}
                  points={preview.parentPoints}
                  format={(value) => formatPoints(value, i18n.language)}
                  unit={pointsText(preview.parentPoints)}
                />
                {childrenPoints.map((child) => (
                  <PointRow
                    key={child.childId}
                    label={t('deleteAccount.parent.childBalance', {
                      name: childLabel(child.childId),
                    })}
                    points={child.points}
                    format={(value) => formatPoints(value, i18n.language)}
                    unit={pointsText(child.points)}
                  />
                ))}
              </View>
              <Text style={styles.rowBody}>
                {t(
                  preview.deleteFamily
                    ? 'deleteAccount.parent.pointsDeleted'
                    : 'deleteAccount.parent.pointsParentLost',
                )}
              </Text>
            </View>

            <View style={styles.consequences}>
              <Text accessibilityRole="header" style={styles.sectionTitle}>
                {t('deleteAccount.parent.consequencesTitle')}
              </Text>
              <InfoRow
                icon="person"
                text={t('deleteAccount.parent.accessEnded')}
              />
              {familyId || preview.deleteFamily || preview.transferOwnership ? (
                <InfoRow
                  icon="children"
                  text={t(
                    preview.deleteFamily
                      ? 'deleteAccount.parent.deleteFamily'
                      : preview.transferOwnership
                        ? 'deleteAccount.parent.transferOwnership'
                        : 'deleteAccount.parent.leaveFamily',
                  )}
                />
              ) : null}
              <InfoRow
                icon="wallet"
                text={t(
                  preview.deleteFamily
                    ? 'deleteAccount.parent.pointsDeleted'
                    : 'deleteAccount.parent.pointsParentLost',
                )}
              />
            </View>

            <View style={styles.footer}>
              <PillButton
                label={t('deleteAccount.delete')}
                variant="danger"
                style={styles.deleteButton}
                onPress={openConfirmation}
                disabled={deleting || !canConfirm}
              />
            </View>
          </>
        ) : deletionPreview.isError ? (
          <View style={styles.state}>
            <Text style={styles.rowBody}>
              {t('deleteAccount.parent.loadingFailed')}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => void deletionPreview.refetch()}
              style={styles.retry}
            >
              <Text style={styles.sectionTitle}>{t('common.retry')}</Text>
            </Pressable>
          </View>
        ) : (
          <Text accessibilityLiveRegion="polite" style={styles.stateText}>
            {t('common.loading')}
          </Text>
        )}
      </ScrollView>
      <DeleteParentAccountSheet
        visible={sheetOpen && !!preview}
        password={password}
        wrongPassword={wrongPassword}
        deleting={deleting}
        onChangePassword={(value) => {
          setPassword(value);
          if (wrongPassword) setWrongPassword(false);
        }}
        onClose={() => {
          setPassword('');
          setSheetOpen(false);
        }}
        onConfirm={confirmDelete}
      />
    </TabScreen>
  );
}

function PointRow({
  label,
  points,
  format,
  unit,
}: {
  label: string;
  points: string;
  format: (value: string) => string;
  unit: string;
}) {
  return (
    <View style={styles.pointRow}>
      <Text style={styles.pointLabel}>{label}</Text>
      <Text style={styles.pointValue}>
        {format(points)} {unit}
      </Text>
    </View>
  );
}

function InfoRow({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Icon name={icon} size={20} color={theme.colors.dangerText} />
      </View>
      <Text style={[styles.rowBody, styles.rowText]}>{text}</Text>
    </View>
  );
}
