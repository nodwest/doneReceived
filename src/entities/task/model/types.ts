export enum TaskStatus {
  Pending = 'pending',
  Done = 'done',
  Cancelled = 'cancelled',
}

export interface TaskShortViewProps {
  id: number;
  title: string;
  description: string;
  penalty: number;
  award: number;
  status?: TaskStatus;
  authorId?: number;
  workerId?: number;
}

export interface CreateTaskPayload {
  title: string;
  reward: number;
  description: string;
  /** ISO-время, когда задача перестаёт быть активной; null — без срока. */
  expiresAt: string | null;
  assigneeId: number;
}
