import type { ImageSourcePropType } from 'react-native';
import { API_URL } from '@shared/config';
import type { ThemeMode } from '@shared/theme';
import type { FamilyEvent } from '../model/family-event';

export function familyEventCover(
  event: Pick<FamilyEvent, 'kind' | 'photo'>,
  mode: ThemeMode,
): ImageSourcePropType {
  return (
    event.photo ?? { uri: `${API_URL}/calendar/covers/${mode}/${event.kind}` }
  );
}
