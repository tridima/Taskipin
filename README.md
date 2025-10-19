# TaskiPin - Smart Task Manager

A powerful and feature-rich task management application built with Next.js and Tailwind CSS.

## Features

### 🎯 Task Management
- **Create, Edit, and Delete Tasks**: Full CRUD operations for tasks with titles and descriptions
- **Task Completion**: Mark tasks as complete and they automatically move to the Completed section
- **Delete Confirmation**: Safe deletion with a confirmation modal
- **Task History**: Archive of completed tasks with timestamps

### 📁 Groups & Organization
- **Task Groups/Folders**: Organize tasks into expandable/collapsible groups
- **Group Management**: Create, edit, and delete groups
- **Drag & Drop**: Reorder tasks within groups (drag-and-drop functionality)
- **Color-Coded Groups**: Visual differentiation for better organization

### ⏲️ Pomodoro Timer
- **Full Pomodoro Implementation**: Work sessions, short breaks, and long breaks
- **Customizable Durations**: Configure work and break periods
- **Auto-Start Options**: Automatically start breaks or work sessions
- **Notifications**: Browser notifications when phases change
- **Session Tracking**: Keep count of completed pomodoros

### 💾 Data Persistence
- **localStorage Integration**: All data persists across sessions
- **Automatic Saving**: Changes save automatically
- **State Restoration**: App state restores exactly as you left it

### 🤖 AI Voice Assistant
- **Voice Commands**: Control tasks using natural language
- **OpenAI Integration**: Powered by Whisper for speech-to-text
- **Supported Commands**:
  - "Create a task to buy groceries"
  - "Mark buy groceries as complete"
  - "Delete the task buy groceries"
  - "Create a group called work tasks"

### ⚙️ Settings Panel
- **OpenAI API Key Configuration**: Set up your API key for voice commands
- **Pomodoro Preferences**: Customize timer durations and behaviors
- **Display Options**: Choose task sorting preferences (manual, alphabetical, creation date)

## Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Taskipin
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Configuration

1. **OpenAI API Key** (Optional, for voice assistant):
   - Click the settings icon in the top-right corner
   - Enter your OpenAI API key
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

2. **Pomodoro Settings**:
   - Configure work duration (default: 25 minutes)
   - Set short break duration (default: 5 minutes)
   - Set long break duration (default: 15 minutes)
   - Customize long break interval (default: 4 pomodoros)

## Usage

### Managing Tasks

**Add a New Task:**
1. Enter task title in the input field
2. Optionally add a description
3. Select a group (or leave as "No Group")
4. Click "Add Task"

**Edit a Task:**
1. Click "Edit" on any task
2. Modify the title or description
3. Click "Save"

**Complete a Task:**
- Click the checkbox next to the task

**Delete a Task:**
1. Click "Delete" on the task
2. Confirm in the modal dialog

### Managing Groups

**Create a Group:**
1. Click "+ Add Group"
2. Enter group name
3. Click "Create"

**Expand/Collapse:**
- Click the arrow icon next to the group name

**Edit/Delete:**
- Use the Edit or Delete buttons on the group header

### Using the Pomodoro Timer

1. Click the timer icon (bottom-right corner) to open
2. Click "Start" to begin a work session
3. Use "Pause" to pause the timer
4. Click "Reset" to start over

The timer automatically switches between work and break sessions based on your settings.

### Voice Commands

1. Click the microphone icon (bottom-left corner)
2. Speak your command clearly
3. Wait for the AI to process and execute

**Example Commands:**
- "Create a task to finish the report"
- "Add a new task call doctor"
- "Complete the task buy groceries"
- "Delete buy milk"
- "Create a group personal tasks"

## Technology Stack

- **Framework**: Next.js 15.5.6
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **AI Integration**: OpenAI API (Whisper + GPT-3.5-turbo)
- **Data Storage**: localStorage

## Project Structure

```
Taskipin/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── TaskItem.tsx      # Individual task component
│   │   ├── TaskGroup.tsx     # Task group component
│   │   ├── PomodoroTimer.tsx # Pomodoro timer component
│   │   ├── SettingsPanel.tsx # Settings modal
│   │   ├── VoiceAssistant.tsx # Voice command interface
│   │   └── DeleteConfirmModal.tsx # Confirmation dialog
│   ├── hooks/
│   │   └── useTaskManager.ts # Task management hook
│   ├── lib/
│   │   ├── storage.ts        # localStorage utilities
│   │   └── voiceCommands.ts  # Voice command processing
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── public/                   # Static assets
├── package.json
└── README.md
```

## Features in Detail

### Data Persistence
All application state is automatically saved to localStorage:
- Tasks (active and completed)
- Groups
- History/Archive
- Settings
- UI preferences

### Drag and Drop
Tasks can be reordered by dragging them to new positions. This works both for tasks in groups and standalone tasks.

### Task Sorting
Choose from three sorting options:
- **Manual Order**: Drag and drop to arrange
- **Creation Date**: Newest first
- **Alphabetical**: Sort by task title

### Responsive Design
The app features a clean, minimal vertical layout optimized for desktop use with:
- Gradient background
- Card-based UI
- Smooth transitions and animations
- Custom scrollbars

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Note**: Voice assistant requires microphone permissions and browser support for MediaRecorder API.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

To start the production server:
```bash
npm start
```

## License

This project is private and proprietary.

## Support

For issues or questions, please refer to the project repository.
