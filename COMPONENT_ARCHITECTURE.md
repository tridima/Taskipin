# TaskiPin - Component Architecture

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         page.tsx                             │
│                    (Main Application)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         useTaskManager Hook                            │ │
│  │  (Manages all state: tasks, groups, history, settings)│ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────┐    │ │
│  │  │        localStorage Utilities                │    │ │
│  │  │  - loadState()   - saveState()               │    │ │
│  │  │  - Auto-save on every state change           │    │ │
│  │  └──────────────────────────────────────────────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Components:                                                 │
│  ┌──────────────┐ ┌─────────────┐ ┌──────────────────┐    │
│  │  TaskGroup   │ │  TaskItem   │ │ PomodoroTimer    │    │
│  │  Component   │ │  Component  │ │  Component       │    │
│  └──────────────┘ └─────────────┘ └──────────────────┘    │
│                                                              │
│  ┌───────────────┐ ┌──────────────┐ ┌─────────────────┐   │
│  │  Settings     │ │ DeleteModal  │ │ VoiceAssistant  │   │
│  │  Panel        │ │  Component   │ │  Component      │   │
│  └───────────────┘ └──────────────┘ └─────────────────┘   │
│                                           │                  │
│                                           ▼                  │
│                                  ┌──────────────────┐       │
│                                  │ voiceCommands.ts │       │
│                                  │  - transcribe()  │       │
│                                  │  - parseCommand()│       │
│                                  └──────────────────┘       │
│                                           │                  │
│                                           ▼                  │
│                                    OpenAI API               │
│                              (Whisper + GPT-3.5-turbo)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. Task Creation Flow
```
User Input → Add Task Button → useTaskManager.addTask()
                                      ↓
                              Create Task Object
                                      ↓
                              Update State Array
                                      ↓
                              Auto-save to localStorage
                                      ↓
                              Re-render TaskItem Components
```

### 2. Voice Command Flow
```
User Clicks Mic → VoiceAssistant.startRecording()
                           ↓
                  Record Audio (MediaRecorder)
                           ↓
                  Stop Recording → Blob Created
                           ↓
            voiceCommands.transcribeAudio(blob, apiKey)
                           ↓
                  OpenAI Whisper API → Transcription
                           ↓
            voiceCommands.parseCommand(text, apiKey)
                           ↓
                  OpenAI GPT → Parsed Command Object
                           ↓
            handleVoiceCommand(command) in page.tsx
                           ↓
            Execute appropriate useTaskManager function
                           ↓
                  State Updated → UI Updates
```

### 3. Pomodoro Timer Flow
```
Start Timer → setState(isRunning: true)
                     ↓
              useEffect Triggered
                     ↓
              setInterval (1 second)
                     ↓
              Decrement timeLeft
                     ↓
         timeLeft === 0 → nextPhase()
                     ↓
              Update phase state
                     ↓
         Show Notification (if enabled)
                     ↓
         Auto-start next phase (if enabled)
```

### 4. Drag-and-Drop Flow
```
User Drags Task → onDragStart(taskId)
                         ↓
                  Store draggedTaskId
                         ↓
              User Drops on Target Task
                         ↓
              onDrop(targetTaskId)
                         ↓
         Calculate new positions in array
                         ↓
         Update order property for all tasks
                         ↓
         reorderTasks(newArray)
                         ↓
         Auto-save → Re-render
```

---

## 🧩 Component Details

### page.tsx (Main Container)
**Responsibilities:**
- Orchestrates all components
- Manages application state via useTaskManager
- Handles drag-and-drop logic
- Processes voice commands
- Renders sections: Groups, Active, Completed, History

**Key State:**
- `tasks`, `groups`, `history`, `settings` (from hook)
- `newTaskTitle`, `newTaskDescription`
- `deleteModalState`
- `isPomodoroVisible`
- `isSettingsOpen`
- `draggedTaskId`

---

### TaskItem Component
**Props:**
```typescript
{
  task: Task
  onUpdate: (updates) => void
  onComplete: () => void
  onDelete: () => void
  draggable?: boolean
  onDragStart?: () => void
  onDragOver?: () => void
  onDrop?: () => void
}
```

**Features:**
- Inline editing (title & description)
- Checkbox for completion
- Edit/Delete buttons
- Drag-and-drop support
- Strikethrough for completed

---

### TaskGroup Component
**Props:**
```typescript
{
  group: TaskGroup
  tasks: Task[]
  onUpdateGroup: (updates) => void
  onDeleteGroup: () => void
  onToggleExpanded: () => void
  onUpdateTask: (taskId, updates) => void
  onCompleteTask: (taskId) => void
  onDeleteTask: (taskId) => void
  onTaskDragStart: (taskId) => void
  onTaskDragOver: (taskId) => void
  onTaskDrop: (taskId) => void
}
```

**Features:**
- Expandable/collapsible
- Inline group name editing
- Contains multiple TaskItems
- Task count display
- Color-coded backgrounds

---

### PomodoroTimer Component
**Props:**
```typescript
{
  settings: PomodoroSettings
  isVisible: boolean
  onToggle: () => void
}
```

**Internal State:**
- `phase`: 'work' | 'shortBreak' | 'longBreak' | 'idle'
- `timeLeft`: seconds remaining
- `isRunning`: boolean
- `completedPomodoros`: count

**Features:**
- Phase management (work/break cycles)
- Countdown display (MM:SS)
- Start/Pause/Reset controls
- Auto-phase transitions
- Notifications

---

### VoiceAssistant Component
**Props:**
```typescript
{
  apiKey: string
  onCommand: (command) => void
}
```

**Internal State:**
- `isListening`: recording active
- `isProcessing`: API call in progress
- `error`: error message
- `transcript`: transcribed text

**Features:**
- Microphone access
- Audio recording (WebM)
- Visual feedback (colors, animations)
- Error handling
- Transcript display

---

### SettingsPanel Component
**Props:**
```typescript
{
  settings: AppSettings
  onUpdate: (updates) => void
  isOpen: boolean
  onClose: () => void
}
```

**Sections:**
1. AI Voice Assistant (API key)
2. Pomodoro Timer (durations, intervals, auto-start)
3. Display Options (sorting)

---

### DeleteConfirmModal Component
**Props:**
```typescript
{
  isOpen: boolean
  title: string
  onConfirm: () => void
  onCancel: () => void
}
```

**Features:**
- Backdrop overlay
- Escape key to close
- Prevents accidental deletions

---

## 🗃️ Data Models

### Task Interface
```typescript
{
  id: string              // UUID
  title: string           // Required
  description?: string    // Optional
  completed: boolean      // Status
  createdAt: number       // Timestamp
  completedAt?: number    // Timestamp
  groupId?: string        // Optional group assignment
  order: number           // For manual sorting
}
```

### TaskGroup Interface
```typescript
{
  id: string           // UUID
  name: string         // Group name
  color?: string       // Optional color theme
  expanded: boolean    // UI state
  order: number        // For sorting
  createdAt: number    // Timestamp
}
```

### AppSettings Interface
```typescript
{
  openAIApiKey: string
  pomodoro: {
    workDuration: number
    shortBreak: number
    longBreak: number
    longBreakInterval: number
    autoStartBreaks: boolean
    autoStartPomodoros: boolean
    notificationsEnabled: boolean
  }
  sortBy: 'createdAt' | 'alphabetical' | 'manual'
  theme: 'light' | 'dark'
}
```

---

## 🔗 Component Communication

### Parent → Child (Props)
```
page.tsx passes data and callbacks to all components
```

### Child → Parent (Callbacks)
```
Components call props.onXxx() to trigger parent actions
```

### Hook → Components (State)
```
useTaskManager provides state and methods to page.tsx
```

### localStorage ↔ Hook (Persistence)
```
Hook auto-saves state changes to localStorage
Hook loads initial state from localStorage
```

### Voice → State (Commands)
```
VoiceAssistant → OpenAI API → Parsed Command
→ handleVoiceCommand → useTaskManager methods
```

---

## 🎯 Key Patterns

### 1. Controlled Components
All form inputs are controlled by React state

### 2. Lifting State Up
All state lives in useTaskManager, passed down as props

### 3. Callback Props
Parent functions passed to children for updates

### 4. Custom Hooks
Encapsulate complex state logic (useTaskManager)

### 5. Memoization
useCallback for stable function references

### 6. Effect Hooks
Auto-save, timers, cleanup functions

### 7. Conditional Rendering
Modal visibility, expanded states, empty states

---

## 🚦 State Management Strategy

```
localStorage
    ↕ (on load / on change)
useTaskManager Hook
    ↓ (provides)
State & Methods
    ↓ (passed as props)
Components
    ↓ (render)
User Interface
    ↓ (user actions)
Event Handlers
    ↓ (call methods)
useTaskManager Hook
    ↓ (updates state)
Auto-save to localStorage
```

---

## 🎨 Styling Architecture

### Tailwind Utility Classes
- Direct styling on JSX elements
- No separate CSS files per component
- Responsive and theme-aware

### Global Styles
- `globals.css` for base styles
- Custom scrollbar styling
- Smooth transition defaults

### Component-Specific
- Conditional classes based on state
- Dynamic color schemes for groups
- Hover and focus states

---

## 🔐 Error Boundaries

### Current Implementation
- Try-catch blocks in async operations
- Error state in VoiceAssistant
- Graceful degradation (no API key, no mic access)

### Validation
- Required field checks
- Non-empty title validation
- API response error handling

---

This architecture provides a clean separation of concerns, making the app maintainable, testable, and extensible.

