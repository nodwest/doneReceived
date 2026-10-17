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
