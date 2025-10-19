'use client';

import { useState, useMemo } from 'react';
import { useTaskManager } from '@/hooks/useTaskManager';
import { Task } from '@/types';
import { ProcessedCommand } from '@/lib/voiceCommands';
import TaskItem from '@/components/TaskItem';
import TaskGroup from '@/components/TaskGroup';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import PomodoroTimer from '@/components/PomodoroTimer';
import SettingsPanel from '@/components/SettingsPanel';
import VoiceAssistant from '@/components/VoiceAssistant';

export default function Home() {
  const {
    tasks,
    groups,
    history,
    settings,
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
  } = useTaskManager();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined);
  const [newGroupName, setNewGroupName] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);
  
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    title: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    onConfirm: () => {},
  });

  const [isPomodoroVisible, setIsPomodoroVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Filter tasks
  const activeTasks = useMemo(
    () => tasks.filter(t => !t.completed && !t.groupId),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter(t => t.completed),
    [tasks]
  );

  const sortTasks = (taskList: Task[]) => {
    const sorted = [...taskList];
    if (settings.sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (settings.sortBy === 'createdAt') {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      sorted.sort((a, b) => a.order - b.order);
    }
    return sorted;
  };

  // Handlers
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim(), newTaskDescription.trim() || undefined, selectedGroupId);
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };

  const handleAddGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName.trim());
      setNewGroupName('');
      setShowNewGroup(false);
    }
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    setDeleteModalState({
      isOpen: true,
      title: taskTitle,
      onConfirm: () => {
        deleteTask(taskId);
        setDeleteModalState({ isOpen: false, title: '', onConfirm: () => {} });
      },
    });
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    setDeleteModalState({
      isOpen: true,
      title: `group "${groupName}"`,
      onConfirm: () => {
        deleteGroup(groupId);
        setDeleteModalState({ isOpen: false, title: '', onConfirm: () => {} });
      },
    });
  };

  // Drag and drop handlers
  const handleTaskDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleTaskDrop = (targetTaskId: string) => {
    if (!draggedTaskId || draggedTaskId === targetTaskId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetTaskId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(targetIndex, 0, draggedTask);

    const reordered = newTasks.map((task, index) => ({ ...task, order: index }));
    reorderTasks(reordered);
    setDraggedTaskId(null);
  };

  // Voice command handler
  const handleVoiceCommand = (command: ProcessedCommand) => {
    switch (command.action) {
      case 'create':
        if (command.taskTitle) {
          addTask(command.taskTitle, command.taskDescription);
        }
        break;
      case 'complete':
        if (command.taskTitle) {
          const task = tasks.find(
            t => !t.completed && t.title.toLowerCase().includes(command.taskTitle!.toLowerCase())
          );
          if (task) completeTask(task.id);
        }
        break;
      case 'delete':
        if (command.taskTitle) {
          const task = tasks.find(
            t => t.title.toLowerCase().includes(command.taskTitle!.toLowerCase())
          );
          if (task) deleteTask(task.id);
        }
        break;
      case 'createGroup':
        if (command.groupName) {
          addGroup(command.groupName);
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">TaskiPin</h1>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            title="Settings"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        {/* Pomodoro Timer */}
        {isPomodoroVisible && (
          <div className="mb-6">
            <PomodoroTimer
              settings={settings.pomodoro}
              isVisible={isPomodoroVisible}
              onToggle={() => setIsPomodoroVisible(!isPomodoroVisible)}
            />
          </div>
        )}

        {/* New Task Input */}
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Task title..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Description (optional)..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
          <div className="flex gap-2 items-center">
            <select
              value={selectedGroupId || ''}
              onChange={(e) => setSelectedGroupId(e.target.value || undefined)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Groups */}
        {groups.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Groups</h2>
            <div className="space-y-3">
              {groups
                .sort((a, b) => a.order - b.order)
                .map((group) => {
                  const groupTasks = sortTasks(
                    tasks.filter(t => t.groupId === group.id && !t.completed)
                  );
                  return (
                    <TaskGroup
                      key={group.id}
                      group={group}
                      tasks={groupTasks}
                      onUpdateGroup={(updates) => updateGroup(group.id, updates)}
                      onDeleteGroup={() => handleDeleteGroup(group.id, group.name)}
                      onToggleExpanded={() => toggleGroupExpanded(group.id)}
                      onUpdateTask={(taskId, updates) => updateTask(taskId, updates)}
                      onCompleteTask={(taskId) => completeTask(taskId)}
                      onDeleteTask={(taskId) => {
                        const task = tasks.find(t => t.id === taskId);
                        if (task) handleDeleteTask(taskId, task.title);
                      }}
                      onTaskDragStart={handleTaskDragStart}
                      onTaskDragOver={(taskId) => taskId}
                      onTaskDrop={handleTaskDrop}
                    />
                  );
                })}
            </div>
          </div>
        )}

        {/* Add Group Button */}
        <div className="mb-6">
          {!showNewGroup ? (
            <button
              onClick={() => setShowNewGroup(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Group
            </button>
          ) : (
            <div className="bg-white rounded-lg p-4 shadow">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
                placeholder="Group name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddGroup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowNewGroup(false);
                    setNewGroupName('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Tasks */}
        {activeTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Active Tasks</h2>
            <div className="space-y-2">
              {sortTasks(activeTasks).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={(updates) => updateTask(task.id, updates)}
                  onComplete={() => completeTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id, task.title)}
                  onDragStart={() => handleTaskDragStart(task.id)}
                  onDragOver={() => {}}
                  onDrop={() => handleTaskDrop(task.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Completed</h2>
            <div className="space-y-2">
              {sortTasks(completedTasks).map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={(updates) => updateTask(task.id, updates)}
                  onComplete={() => completeTask(task.id)}
                  onDelete={() => handleDeleteTask(task.id, task.title)}
                  draggable={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">History</h2>
              <button
                onClick={clearHistory}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear History
              </button>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="space-y-2">
                {history.slice(0, 10).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <div>
                      <span className="font-medium">{entry.taskTitle}</span>
                      {entry.groupName && (
                        <span className="text-sm text-gray-600 ml-2">({entry.groupName})</span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Components */}
      {!isPomodoroVisible && (
        <PomodoroTimer
          settings={settings.pomodoro}
          isVisible={false}
          onToggle={() => setIsPomodoroVisible(true)}
        />
      )}

      <VoiceAssistant
        apiKey={settings.openAIApiKey}
        onCommand={handleVoiceCommand}
      />

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        onConfirm={deleteModalState.onConfirm}
        onCancel={() => setDeleteModalState({ isOpen: false, title: '', onConfirm: () => {} })}
      />

      <SettingsPanel
        settings={settings}
        onUpdate={updateSettings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
