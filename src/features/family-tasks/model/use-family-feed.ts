import { useMemo } from 'react';
import { useFeed, type FeedViewer } from '@entities/activity';
import { useSession } from '@entities/session';
import { useChildAccount } from './use-child-account';
import { useTaskViewer } from './use-family-tasks';

/**
 * Лента событий на главной. Родитель с семьёй — события всей семьи, вошедший
 * ребёнок — только свои. Родитель в режиме ребёнка смотрит моковую Emma — у
 * него ленты с сервера нет (null), главная показывает моки; так же без семьи.
 */
export function useFamilyFeed() {
  const viewer = useTaskViewer();
  const session = useSession();
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
      child: { id: childId, name: session.user.displayName },
    };
  }, [viewer, childSession, childId, session]);
  return { feedViewer, ...useFeed(feedViewer) };
}
