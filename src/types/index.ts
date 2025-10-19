// Core data types for TaskiPin

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  groupId?: string;
  order: number;
}

export interface TaskGroup {
  id: string;
  name: string;
  color?: string;
  expanded: boolean;
  order: number;
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  taskTitle: string;
  completedAt: number;
  groupName?: string;
}

export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  notificationsEnabled: boolean;
}

export interface AppSettings {
  openAIApiKey: string;
  pomodoro: PomodoroSettings;
  sortBy: 'createdAt' | 'alphabetical' | 'manual';
  theme: 'light' | 'dark';
}

export interface AppState {
  tasks: Task[];
  groups: TaskGroup[];
  history: HistoryEntry[];
  settings: AppSettings;
  lastUpdated: number;
}

export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak' | 'idle';

export interface VoiceCommand {
  action: 'create' | 'update' | 'complete' | 'delete' | 'reorder' | 'createGroup';
  target?: string;
  data?: Record<string, unknown>;
}

