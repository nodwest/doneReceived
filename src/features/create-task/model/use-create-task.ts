import { useMutation } from '@tanstack/react-query';
import { createTaskRequest } from '../api/create-task';

export function useCreateTask() {
  return useMutation({ mutationFn: createTaskRequest });
}
