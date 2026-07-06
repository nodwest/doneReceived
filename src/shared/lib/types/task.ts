export enum TaskStatus {
  Pending = 'pending',
  Done = 'done',
  Cancelled = 'cancelled',
}

export interface TaskShortViewProps {
  id: number;
  taskName: string;
  taskDescription: string;
  taskPenalty: number;
  taskAward: number;
  status?: TaskStatus;
  autor?: number;
  worker?: number;
}
