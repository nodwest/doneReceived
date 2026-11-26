import { useMemo } from 'react';
import { useFeed, useFeedHistory, type FeedViewer } from '@entities/activity';
import { useMe, useSession } from '@entities/session';
import { useChildAccount } from './use-child-account';
import { useFamilyLabels, useRecheckFamilyAccess } from './use-family-labels';
import { useTaskViewer } from './use-family-tasks';

/**
 * Кто смотрит ленту: родитель с семьёй — события всей семьи, вошедший ребёнок
 * — только свои; без семьи — null. Вместе с именами для событий.
 */
function useFeedViewer() {
  const viewer = useTaskViewer();
  const session = useSession();
  const me = useMe();
  const { childId } = useChildAccount();
  const childSession = session?.user.kind === 'child';
  const feedViewer = useMemo<FeedViewer | null>(() => {
    if (!viewer) return null;
    if (!childSession) {
      return { familyId: viewer.familyId, userId: viewer.userId };
    }
    if (!childId || !session) return null;
    return {
      familyId: viewer.familyId,
      userId: viewer.userId,
      child: {
        id: childId,
        name: session.user.displayName,
        // Своё фото ребёнок видит из профиля: список детей ему закрыт.
        avatarUrl: me?.avatarUrl ?? session.user.avatarUrl,
      },
    };
  }, [viewer, childSession, childId, session, me?.avatarUrl]);
  const labels = useFamilyLabels(feedViewer ? viewer : null);
  return { feedViewer, childSession, ...labels };
}

/** Лента событий на главной: последние события. */
export function useFamilyFeed() {
  const { feedViewer, childSession, children, members, accessDenied } =
    useFeedViewer();
  const query = useFeed(accessDenied ? null : feedViewer, children, members);
  const denied = accessDenied || query.accessDenied;
  useRecheckFamilyAccess(denied, !!feedViewer && !childSession);
  return {
    feedViewer,
    ...query,
    accessDenied: denied,
    isError: denied || query.isError,
    data: denied ? undefined : query.data,
  };
}

/** Лента за последние 30 дней: страница Activity. */
export function useFamilyFeedHistory(selectedChildId?: string) {
  const { feedViewer, childSession, children, members, accessDenied } =
    useFeedViewer();
  const childId = childSession
    ? undefined
    : children?.find((child) => child.id === selectedChildId)?.id;
  const query = useFeedHistory(
    accessDenied ? null : feedViewer,
    children,
    members,
    childId,
  );
  const denied = accessDenied || query.accessDenied;
  useRecheckFamilyAccess(denied, !!feedViewer && !childSession);
  return {
    ...query,
    /** Дети семьи для фильтра; у вошедшего ребёнка списка нет. */
    familyChildren: denied ? undefined : children,
    accessDenied: denied,
    isError: denied || query.isError,
    data: denied ? undefined : query.data,
  };
}
