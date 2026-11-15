import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiRequest, queryRoots } from '@shared/api';
import { familiesKeys } from '@entities/family';
import { familyLocationsKeys } from './use-family-locations';

export type MapDevice = {
  id: string;
  label: string;
  lastSeenAt: string | null;
  createdAt: string;
  online: boolean;
};

export type LocationViewer = {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  kind: 'parent' | 'child';
  allowed: boolean;
};

export type MemberMapSettings = {
  userId: string;
  kind: 'parent' | 'child';
  color: string;
  colors: string[];
  devices: MapDevice[];
  trackedDeviceId: string | null;
  viewers: LocationViewer[] | null;
};

export type MapSettingsChanges = {
  color?: string | null;
  trackedDeviceId?: string | null;
  viewerIds?: string[];
};

export const mapSettingsKeys = {
  all: queryRoots.families,
  one: (familyId: string, userId: string) =>
    [...mapSettingsKeys.all, familyId, 'map-settings', userId] as const,
};

export function useMemberMapSettings(
  familyId: string | null,
  userId: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey:
      familyId && userId
        ? mapSettingsKeys.one(familyId, userId)
        : [...mapSettingsKeys.all, 'map-settings', 'none'],
    queryFn:
      familyId && userId
        ? () =>
            apiRequest<MemberMapSettings>(
              `/families/${familyId}/members/${userId}/map-settings`,
            )
        : skipToken,
    enabled: Boolean(familyId && userId && enabled),
    staleTime: 15_000,
  });
}

export function useUpdateMemberMapSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      familyId,
      userId,
      changes,
    }: {
      familyId: string;
      userId: string;
      changes: MapSettingsChanges;
    }) =>
      apiRequest<MemberMapSettings>(
        `/families/${familyId}/members/${userId}/map-settings`,
        { method: 'PATCH', body: changes },
      ),
    onSuccess: (settings, { familyId }) => {
      queryClient.setQueryData(
        mapSettingsKeys.one(familyId, settings.userId),
        settings,
      );
      void queryClient.invalidateQueries({
        queryKey: familiesKeys.family(familyId),
      });
      void queryClient.invalidateQueries({
        queryKey: familyLocationsKeys.list(familyId),
      });
    },
  });
}
