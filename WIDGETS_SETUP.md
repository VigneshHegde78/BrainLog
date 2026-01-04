# Android Widgets Setup Guide - BrainLog

## Overview

BrainLog now includes two homescreen widgets:

- **📝 Notes Widget** - Shows recent notes
- **✓ Tasks Widget** - Shows pending tasks

## Files Created

### Native Code

- `android/app/src/main/java/com/brainlog/widgets/NotesWidgetProvider.kt` - Notes widget provider
- `android/app/src/main/java/com/brainlog/widgets/TasksWidgetProvider.kt` - Tasks widget provider

### Layouts

- `android/app/src/main/res/layout/notes_widget.xml` - Notes widget UI
- `android/app/src/main/res/layout/tasks_widget.xml` - Tasks widget UI

### Configuration

- `android/app/src/main/res/xml/notes_widget_info.xml` - Notes widget configuration
- `android/app/src/main/res/xml/tasks_widget_info.xml` - Tasks widget configuration

### JavaScript/TypeScript

- `utils/widgetManager.ts` - Widget update utilities
- `hooks/useWidgetSync.ts` - Hook for automatic widget sync
- `plugins/withWidgets.js` - Expo config plugin

## Build Instructions

### Step 1: Update AndroidManifest.xml

When building with Expo, you need to ensure the widget providers are declared. Add this to your `app.json` in the `android` section:

```json
{
	"expo": {
		"android": {
			"manifest": {
				"receivers": [
					{
						"action": "android.appwidget.action.APPWIDGET_UPDATE",
						"name": "com.brainlog.widgets.NotesWidgetProvider",
						"exported": true
					},
					{
						"action": "android.appwidget.action.APPWIDGET_UPDATE",
						"name": "com.brainlog.widgets.TasksWidgetProvider",
						"exported": true
					}
				]
			}
		}
	}
}
```

### Step 2: Build with Expo Prebuild

```bash
# Clean build with native modules
expo prebuild --clean --platform android

# Start the Android emulator/device
expo run android
```

### Step 3: Add Widgets to Home Screen

1. Long-press on your Android homescreen
2. Select "Widgets"
3. Search for "Brain Log"
4. Add either the Notes Widget or Tasks Widget
5. The widget will display your recent notes/pending tasks

## How It Works

### Data Flow

1. **NoteContext** saves data to AsyncStorage (`@notes`)
2. **TaskContext** saves data to AsyncStorage (`@tasks`)
3. **Widget Providers** read from the same AsyncStorage keys
4. When you add/delete notes or tasks, AsyncStorage is updated
5. Widgets read the updated data and display it

### Widget Updates

- Widgets check for updates every 30 minutes
- Tap the widget to open the app and view full details
- Widget data is stored in the same location as app data

### Data Persistence

- Notes and tasks persist across app restarts
- Widgets persist across system restarts
- Both use AsyncStorage for reliable storage

## Limitations & Notes

⚠️ **Current Limitations:**

- Widgets are read-only (you can't edit from the widget)
- Widget updates happen on a schedule (not real-time)
- Widgets show preview only (tap to see full details)

✅ **Future Enhancements:**

- Add quick-action buttons to widgets
- Implement real-time widget updates
- Add widget configuration options
- Create list and calendar widgets

## Troubleshooting

### Widgets don't appear after build

1. Make sure you ran `expo prebuild --clean`
2. Verify AndroidManifest.xml includes the receiver declarations
3. Restart your device or emulator

### Widgets show "Loading..."

1. Make sure the app is running at least once (to initialize AsyncStorage)
2. Check that notes/tasks are actually being created
3. Verify the widget has permission to read AsyncStorage

### Build errors

1. Clean Android build cache: `rm -rf android/`
2. Run `expo prebuild --clean --platform android` again
3. Check that Kotlin compiler version is compatible

## Testing

To test widgets without rebuilding:

1. Start the app in dev mode: `expo run android`
2. Add some notes/tasks in the app
3. Open Android Studio's widget preview (Tools > Device File Explorer)
4. Or use a physical device and long-press homescreen to add widget

## Files to Review

- [NotesWidgetProvider.kt](./android/app/src/main/java/com/brainlog/widgets/NotesWidgetProvider.kt)
- [TasksWidgetProvider.kt](./android/app/src/main/java/com/brainlog/widgets/TasksWidgetProvider.kt)
- [widgetManager.ts](./utils/widgetManager.ts)
