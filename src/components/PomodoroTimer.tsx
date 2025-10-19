'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PomodoroSettings, PomodoroPhase } from '@/types';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  isVisible: boolean;
  onToggle: () => void;
}

export default function PomodoroTimer({ settings, isVisible, onToggle }: PomodoroTimerProps) {
  const [phase, setPhase] = useState<PomodoroPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getPhaseTime = useCallback((currentPhase: PomodoroPhase): number => {
    switch (currentPhase) {
      case 'work':
        return settings.workDuration * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
      default:
        return settings.workDuration * 60;
    }
  }, [settings]);

  const startTimer = () => {
    if (phase === 'idle') {
      setPhase('work');
      setTimeLeft(settings.workDuration * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPhase('idle');
    setTimeLeft(settings.workDuration * 60);
    setCompletedPomodoros(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const nextPhase = useCallback(() => {
    let nextPhaseValue: PomodoroPhase = 'idle';
    
    if (phase === 'work') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      if (newCount % settings.longBreakInterval === 0) {
        nextPhaseValue = 'longBreak';
      } else {
        nextPhaseValue = 'shortBreak';
      }
    } else {
      nextPhaseValue = 'work';
    }

    setPhase(nextPhaseValue);
    setTimeLeft(getPhaseTime(nextPhaseValue));
    
    if (settings.notificationsEnabled && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: `${nextPhaseValue === 'work' ? 'Work' : 'Break'} time started!`,
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }

    if (
      (nextPhaseValue !== 'work' && settings.autoStartBreaks) ||
      (nextPhaseValue === 'work' && settings.autoStartPomodoros)
    ) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [phase, completedPomodoros, settings, getPhaseTime]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && phase !== 'idle') {
      nextPhase();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, phase, nextPhase]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseDisplay = (): string => {
    switch (phase) {
      case 'work':
        return 'Work Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Ready';
    }
  };

  const getPhaseColor = (): string => {
    switch (phase) {
      case 'work':
        return 'bg-red-100 border-red-300';
      case 'shortBreak':
        return 'bg-green-100 border-green-300';
      case 'longBreak':
        return 'bg-blue-100 border-blue-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors"
        title="Open Pomodoro Timer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className={`border rounded-lg p-6 ${getPhaseColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Pomodoro Timer</h2>
        <button
          onClick={onToggle}
          className="text-gray-600 hover:text-gray-900"
          title="Minimize"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">{getPhaseDisplay()}</div>
        <div className="text-5xl font-bold mb-2">{formatTime(timeLeft)}</div>
        <div className="text-sm text-gray-600">
          Completed: {completedPomodoros} {completedPomodoros === 1 ? 'pomodoro' : 'pomodoros'}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

