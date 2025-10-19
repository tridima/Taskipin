// LocalStorage utilities for TaskiPin

import { AppState, AppSettings } from '@/types';

const STORAGE_KEY = 'taskipin_data';

export const defaultSettings: AppSettings = {
  openAIApiKey: '',
  pomodoro: {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    notificationsEnabled: true,
  },
  sortBy: 'manual',
  theme: 'light',
};

export const defaultState: AppState = {
  tasks: [],
  groups: [],
  history: [],
  settings: defaultSettings,
  lastUpdated: Date.now(),
};

export const loadState = (): AppState => {
  if (typeof window === 'undefined') return defaultState;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState;
    
    const parsed = JSON.parse(stored);
    return {
      ...defaultState,
      ...parsed,
      settings: {
        ...defaultSettings,
        ...parsed.settings,
        pomodoro: {
          ...defaultSettings.pomodoro,
          ...parsed.settings?.pomodoro,
        },
      },
    };
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
    return defaultState;
  }
};

export const saveState = (state: AppState): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const toSave = {
      ...state,
      lastUpdated: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Error saving state to localStorage:', error);
  }
};

export const clearState = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

