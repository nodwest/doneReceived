import { Text, View } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Icon, type IconName } from '@shared/ui';
import type { TaskRejection } from '../model';
import { styles } from './rejection-note.styled';

type RejectionNoteProps = {
  /** undo — вернули на переделку, close — закрыли отказом. */
  icon: IconName;
  /** Кто и что сделал: «Sarah sent it back to redo». */
  title: string;
  rejection: Pick<TaskRejection, 'reason' | 'comment'>;
};

/**
 * Коралловая плашка отказа родителя: заголовок, причина чипом (у Other её
 * нет — она ничего не говорит) и комментарий родителя словами.
 */
export function RejectionNote({ icon, title, rejection }: RejectionNoteProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.root}>
      <View style={styles.icon}>
        <Icon name={icon} size={16} color={theme.colors.sentBackIcon} />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {rejection.reason !== 'other' && (
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {t(`reviewTask.reasons.${rejection.reason}`)}
            </Text>
          </View>
        )}
        {!!rejection.comment && (
          <Text style={styles.comment}>
            {t('taskCard.quote', { text: rejection.comment })}
          </Text>
        )}
      </View>
    </View>
  );
}
