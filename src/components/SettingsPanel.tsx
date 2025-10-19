'use client';

import { useState } from 'react';
import { AppSettings } from '@/types';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdate: (updates: Partial<AppSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ settings, onUpdate, isOpen, onClose }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState(settings.openAIApiKey);
  const [workDuration, setWorkDuration] = useState(settings.pomodoro.workDuration);
  const [shortBreak, setShortBreak] = useState(settings.pomodoro.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.pomodoro.longBreak);
  const [longBreakInterval, setLongBreakInterval] = useState(settings.pomodoro.longBreakInterval);
  const [autoStartBreaks, setAutoStartBreaks] = useState(settings.pomodoro.autoStartBreaks);
  const [autoStartPomodoros, setAutoStartPomodoros] = useState(settings.pomodoro.autoStartPomodoros);
  const [notificationsEnabled, setNotificationsEnabled] = useState(settings.pomodoro.notificationsEnabled);
  const [sortBy, setSortBy] = useState(settings.sortBy);

  const handleSave = () => {
    onUpdate({
      openAIApiKey: apiKey,
      pomodoro: {
        workDuration,
        shortBreak,
        longBreak,
        longBreakInterval,
        autoStartBreaks,
        autoStartPomodoros,
        notificationsEnabled,
      },
      sortBy,
    });
    onClose();
  };

  const handleCancel = () => {
    setApiKey(settings.openAIApiKey);
    setWorkDuration(settings.pomodoro.workDuration);
    setShortBreak(settings.pomodoro.shortBreak);
    setLongBreak(settings.pomodoro.longBreak);
    setLongBreakInterval(settings.pomodoro.longBreakInterval);
    setAutoStartBreaks(settings.pomodoro.autoStartBreaks);
    setAutoStartPomodoros(settings.pomodoro.autoStartPomodoros);
    setNotificationsEnabled(settings.pomodoro.notificationsEnabled);
    setSortBy(settings.sortBy);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleCancel} />
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        {/* OpenAI API Key */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">AI Voice Assistant</h3>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="sk-..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Required for AI voice commands. Get your key from OpenAI.
          </p>
        </div>

        {/* Pomodoro Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Pomodoro Timer</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Short Break (minutes)
              </label>
              <input
                type="number"
                value={shortBreak}
                onChange={(e) => setShortBreak(Number(e.target.value))}
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Long Break (minutes)
              </label>
              <input
                type="number"
                value={longBreak}
                onChange={(e) => setLongBreak(Number(e.target.value))}
                min="1"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Long Break Interval
              </label>
              <input
                type="number"
                value={longBreakInterval}
                onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-start breaks</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoStartPomodoros}
                onChange={(e) => setAutoStartPomodoros(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Auto-start pomodoros</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable notifications</span>
            </label>
          </div>
        </div>

        {/* Display Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Display Options</h3>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Sort Tasks By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'alphabetical' | 'manual')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="manual">Manual Order</option>
            <option value="createdAt">Creation Date</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

