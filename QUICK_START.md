# TaskiPin Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Start the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 2. Add Your First Task
1. Type a task title in the input field (e.g., "Buy groceries")
2. Optionally add a description
3. Click "Add Task"

### 3. Explore Features
- ✅ Check the box to complete a task
- ⏲️ Click the timer icon (bottom-right) to start Pomodoro
- 🎤 Click the microphone icon (bottom-left) for voice commands
- ⚙️ Click the settings icon (top-right) to configure

---

## 📋 Essential Features

### Create a Group
1. Click "+ Add Group"
2. Name your group (e.g., "Work Tasks")
3. When adding tasks, select the group from dropdown

### Use Voice Commands
**First time:**
1. Open Settings (⚙️ icon)
2. Enter your OpenAI API key
3. Save settings

**To use:**
1. Click microphone icon (🎤)
2. Say: "Create a task to call mom"
3. Wait for processing

### Start a Pomodoro Session
1. Click timer icon (⏲️)
2. Click "Start"
3. Focus for 25 minutes!
4. Timer auto-switches to break time

---

## 💡 Pro Tips

1. **Drag & Drop**: Click and drag tasks to reorder them
2. **Quick Edit**: Click "Edit" on any task to modify
3. **Safe Delete**: Confirmation modal prevents accidents
4. **Auto-Save**: Everything saves automatically to localStorage
5. **History**: Check "History" section to see completed tasks

---

## 🎯 Voice Command Examples

- "Create a task to finish the report"
- "Add a new task call doctor with reminder to ask about prescription"
- "Mark buy groceries as complete"
- "Delete the task buy milk"
- "Create a group called personal tasks"

---

## ⚙️ Recommended Settings

**For Deep Work:**
- Work Duration: 25 minutes
- Short Break: 5 minutes
- Long Break: 15 minutes
- Auto-start breaks: ON
- Notifications: ON

**For Quick Tasks:**
- Work Duration: 15 minutes
- Short Break: 3 minutes
- Auto-start pomodoros: OFF

---

## 🆘 Troubleshooting

**Voice assistant not working?**
- Check if OpenAI API key is set in Settings
- Grant microphone permissions when prompted
- Ensure you have internet connection

**Tasks not saving?**
- Check browser console for errors
- Ensure localStorage is enabled
- Try a different browser

**Pomodoro notifications not showing?**
- Enable browser notifications when prompted
- Check browser notification settings
- Enable in Settings panel

---

## 📱 Browser Requirements

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Required Permissions:**
- Microphone (for voice commands)
- Notifications (for Pomodoro alerts)

---

## 🎨 UI Overview

```
┌─────────────────────────────────────────┐
│  TaskiPin                    [⚙️]        │
├─────────────────────────────────────────┤
│  [Add New Task Input]                   │
│  [Description] [Group Dropdown] [Add]   │
├─────────────────────────────────────────┤
│  Groups (expandable)                    │
│    └─ Tasks in group                    │
├─────────────────────────────────────────┤
│  Active Tasks                           │
│    └─ Individual tasks                  │
├─────────────────────────────────────────┤
│  Completed Tasks                        │
│    └─ Finished tasks                    │
├─────────────────────────────────────────┤
│  History                    [Clear]     │
│    └─ Task archive                      │
└─────────────────────────────────────────┘

[🎤] Voice          [⏲️] Pomodoro
(bottom-left)      (bottom-right)
```

---

## 🔥 Keyboard Tips

- **Enter** in task input → Add task
- **Escape** in modals → Close
- Click outside modals → Close

---

## 📊 Data Management

**Your data includes:**
- All tasks (active & completed)
- Groups and organization
- Complete history
- All settings
- UI state (expanded/collapsed groups)

**Stored in:** Browser localStorage
**Backup:** Copy localStorage data or export manually

---

Happy task managing! 🎉

