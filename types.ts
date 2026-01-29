export enum TaskStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  totalDuration: number; // in seconds
  remainingDuration: number; // in seconds
  status: TaskStatus;
  createdAt: number;
}

export interface AIResponseItem {
  task: string;
  estimatedMinutes: number;
}
