'use client';

import { useState } from 'react';
import { TaskGroup as TaskGroupType, Task } from '@/types';
import TaskItem from './TaskItem';

interface TaskGroupProps {
  group: TaskGroupType;
  tasks: Task[];
  onUpdateGroup: (updates: Partial<TaskGroupType>) => void;
  onDeleteGroup: () => void;
  onToggleExpanded: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskDragStart: (taskId: string) => void;
  onTaskDragOver: (taskId: string) => void;
  onTaskDrop: (taskId: string) => void;
}

export default function TaskGroup({
  group,
  tasks,
  onUpdateGroup,
  onDeleteGroup,
  onToggleExpanded,
  onUpdateTask,
  onCompleteTask,
  onDeleteTask,
  onTaskDragStart,
  onTaskDragOver,
  onTaskDrop,
}: TaskGroupProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(group.name);

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateGroup({ name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(group.name);
    setIsEditing(false);
  };

  const colors = {
    blue: 'bg-blue-100 border-blue-300',
    green: 'bg-green-100 border-green-300',
    purple: 'bg-purple-100 border-purple-300',
    orange: 'bg-orange-100 border-orange-300',
    pink: 'bg-pink-100 border-pink-300',
  };

  const bgColor = group.color && group.color in colors 
    ? colors[group.color as keyof typeof colors] 
    : 'bg-gray-100 border-gray-300';

  return (
    <div className={`border rounded-lg p-4 ${bgColor}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={onToggleExpanded}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className={`w-5 h-5 transition-transform ${group.expanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-semibold text-lg">{group.name}</h2>
              <span className="text-sm text-gray-600">({tasks.length})</span>
            </>
          )}
        </div>
        {!isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
            <button
              onClick={onDeleteGroup}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {group.expanded && (
        <div className="space-y-2 mt-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No tasks in this group</p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={(updates) => onUpdateTask(task.id, updates)}
                onComplete={() => onCompleteTask(task.id)}
                onDelete={() => onDeleteTask(task.id)}
                onDragStart={() => onTaskDragStart(task.id)}
                onDragOver={() => onTaskDragOver(task.id)}
                onDrop={() => onTaskDrop(task.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

