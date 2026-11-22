import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  familiesKeys,
  useFamilyChildren,
  useFamilyMembers,
} from '@entities/family';
import type { TaskViewer } from '@entities/task';

export function useFamilyLabels(viewer: TaskViewer | null) {
  const familyId = viewer?.familyId ?? null;
  const children = useFamilyChildren(
    viewer?.childName === undefined ? familyId : null,
  );
  const members = useFamilyMembers(familyId);
  return {
    children: children.data,
    members: members.data,
    accessDenied: children.accessDenied || members.accessDenied,
  };
}

export function useRecheckFamilyAccess(accessDenied: boolean, parent: boolean) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (accessDenied && parent) {
      void queryClient.invalidateQueries(
        { queryKey: familiesKeys.mine(), exact: true },
        { cancelRefetch: false },
      );
    }
  }, [accessDenied, parent, queryClient]);
}
