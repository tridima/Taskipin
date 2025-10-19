// Custom hook for managing tasks and groups

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskGroup, HistoryEntry, AppState, AppSettings } from '@/types';
import { loadState, saveState } from '@/lib/storage';

export const useTaskManager = () => {
  const [state, setState] = useState<AppState>(loadState());

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Task operations
  const addTask = useCallback((title: string, description?: string, groupId?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: Date.now(),
      groupId,
      order: state.tasks.length,
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  }, [state.tasks.length]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => task.id === id ? { ...task, ...updates } : task),
    }));
  }, []);

  const completeTask = useCallback((id: string) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === id);
      if (!task) return prev;

      const group = prev.groups.find(g => g.id === task.groupId);
      const historyEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        taskTitle: task.title,
        completedAt: Date.now(),
        groupName: group?.name,
      };

      return {
        ...prev,
        tasks: prev.tasks.map(t => 
          t.id === id ? { ...t, completed: true, completedAt: Date.now() } : t
        ),
        history: [historyEntry, ...prev.history],
      };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id),
    }));
  }, []);

  const reorderTasks = useCallback((reorderedTasks: Task[]) => {
    setState(prev => ({ ...prev, tasks: reorderedTasks }));
  }, []);

  // Group operations
  const addGroup = useCallback((name: string, color?: string) => {
    const newGroup: TaskGroup = {
      id: crypto.randomUUID(),
      name,
      color,
      expanded: true,
      order: state.groups.length,
      createdAt: Date.now(),
    };
    setState(prev => ({ ...prev, groups: [...prev.groups, newGroup] }));
  }, [state.groups.length]);

  const updateGroup = useCallback((id: string, updates: Partial<TaskGroup>) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group => group.id === id ? { ...group, ...updates } : group),
    }));
  }, []);

  const deleteGroup = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.filter(group => group.id !== id),
      tasks: prev.tasks.map(task => 
        task.groupId === id ? { ...task, groupId: undefined } : task
      ),
    }));
  }, []);

  const toggleGroupExpanded = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group => 
        group.id === id ? { ...group, expanded: !group.expanded } : group
      ),
    }));
  }, []);

  // Settings operations
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setState(prev => ({ ...prev, history: [] }));
  }, []);

  return {
    tasks: state.tasks,
    groups: state.groups,
    history: state.history,
    settings: state.settings,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    reorderTasks,
    addGroup,
    updateGroup,
    deleteGroup,
    toggleGroupExpanded,
    updateSettings,
    clearHistory,
  };
};

