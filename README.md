# 🪐 TofuLog

A lightweight developer debugging overlay for React Native Expo apps with a **Cyber-Y2K aesthetic**. Inspect logs, network requests, crashes, and device info directly on your device with beautiful terminal-style output.

## Features

### 🎨 Vibe Logger - Terminal-Style Console Output
- **Cyber-Y2K aesthetic** with teal accents and monospace fonts
- **Smart filtering** - Only warnings/errors show in Metro terminal by default (keeps it clean!)
- **Full log history** - Everything is captured in the beautiful in-app overlay
- **Push to Terminal** - Manually send any log to Metro with one tap
- **Configurable** - Override terminal log level if you want to see everything

### 📋 Smart Log Viewer
- **Terminal-style UI** with ASCII rendering and kaomojis (◕‿◕)
- **Filter by level** - log, info, warn, error, debug
- **Search logs** - Find what you need fast
- **Copy on long-press** - Share logs with your team
- **Data preview** - See object/array contents inline

### 🧠 AI-Ready Debugging
- **Copy for AI** - One-click formatted context for ChatGPT/Claude
- **Share reports** - Export crash reports and network requests
- **Copy as cURL** - Replay network requests outside the app

### 🌐 Network Inspector
- Monitor all fetch/XHR requests with headers, bodies, and timing
- Copy requests as cURL commands
- View request/response bodies with syntax highlighting

### 💥 Crash Reporter
- Automatic error boundary with stack traces and component trees
- Share crash reports for debugging
- Copy formatted errors for AI assistance

### 📱 Device Info
- View device, OS, app, and runtime information
- Helpful for debugging device-specific issues

### 🪐 Beautiful UX
- **Saturn FAB** - Draggable floating action button with teal glow
- **Shake to Open** - Shake your device to toggle the debug panel
- **Dark theme** - Cyber-Y2K inspired design optimized for debugging
- **Zero Config** - Works out of the box, auto-disabled in production

## Installation

```bash
npm install tofu-log
# or
yarn add tofu-log
```

### Peer Dependencies

This package requires the following Expo packages:

```bash
npx expo install expo-sensors expo-device expo-constants expo-clipboard expo-file-system expo-sharing lucide-react-native
```

## Quick Start

Wrap your app with the `DevOverlay` component:

```tsx
import { DevOverlay } from 'tofu-log';

export default function App() {
  return (
    <DevOverlay>
      <YourApp />
    </DevOverlay>
  );
}
```

That's it! The overlay is automatically enabled in development (`__DEV__`) and disabled in production.

## Usage

### Opening the Overlay

- **Tap the FAB** — A floating 🪐 Saturn button appears on screen (draggable!)
- **Shake your device** — Shake gesture toggles the overlay

### Tabs

| Tab | Description |
|-----|-------------|
| 📋 Logs | Terminal-style log viewer with search, filtering, and push-to-terminal |
| 🌐 Network | Inspect requests with Copy as cURL and detailed headers/bodies |
| 💥 Crashes | Error reports with Copy for AI and Share functionality |
| 📱 Device | Device model, OS version, app info, and runtime details |

## Configuration

```tsx
import { DevOverlay, setTerminalLogLevel } from 'tofu-log';

// Basic usage
<DevOverlay
  enabled={true}           // Override __DEV__ check
  config={{
    shakeToOpen: true,     // Enable shake gesture (default: true)
    showFab: true,         // Show floating action button (default: true)
    maxLogs: 500,          // Maximum logs to store (default: 500)
    maxNetworkRequests: 100, // Maximum network requests to store (default: 100)
  }}
>
  <YourApp />
</DevOverlay>

// Customize terminal log level (optional)
setTerminalLogLevel('all');  // Show all logs in Metro terminal
setTerminalLogLevel('warn'); // Only warn/error (default - keeps terminal clean!)
setTerminalLogLevel('error'); // Only errors
```

## API Reference

### Components

#### `<DevOverlay>`

Main wrapper component that provides the debug overlay.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Your app content |
| `enabled` | `boolean` | `__DEV__` | Force enable/disable the overlay |
| `config` | `DevOverlayConfig` | `{}` | Configuration options |

#### `<ErrorBoundary>`

Standalone error boundary component (also built into DevOverlay).

```tsx
import { ErrorBoundary } from 'tofu-log';

<ErrorBoundary
  onError={(report) => console.log(report)}
  fallback={<CustomErrorScreen />}
>
  <YourComponent />
</ErrorBoundary>
```

### Hooks

#### `useDevOverlay()`

Access the overlay state and controls programmatically.

```tsx
import { useDevOverlay } from 'tofu-log';

function MyComponent() {
  const {
    show,           // () => void - Open overlay
    hide,           // () => void - Close overlay
    toggle,         // () => void - Toggle overlay
    isVisible,      // boolean - Current visibility
    logs,           // LogEntry[] - Captured logs
    networkRequests, // NetworkRequest[] - Captured requests
    crashReports,   // CrashReport[] - Captured crashes
    clearLogs,      // () => void - Clear all logs
    clearNetworkRequests, // () => void - Clear network requests
    clearCrashReports,    // () => void - Clear crash reports
  } = useDevOverlay();

  return <Button onPress={toggle} title="Toggle Debug" />;
}
```

### Types

```typescript
type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: unknown[];
}

interface NetworkRequest {
  id: string;
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: unknown;
  responseBody?: unknown;
  startTime: number;
  endTime?: number;
  duration?: number;
  error?: string;
}

interface CrashReport {
  id: string;
  error: Error;
  componentStack?: string;
  timestamp: number;
}

interface DeviceInfo {
  brand?: string;
  modelName?: string;
  osName?: string;
  osVersion?: string;
  deviceType?: string;
  totalMemory?: number;
}

interface DevOverlayConfig {
  enabled?: boolean;
  shakeToOpen?: boolean;
  showFab?: boolean;
  fabPosition?: { x: number; y: number };
  maxLogs?: number;
  maxNetworkRequests?: number;
}
```

## Examples

### Programmatic Control

```tsx
import { useDevOverlay } from 'tofu-log';

function DebugButton() {
  const { toggle, logs } = useDevOverlay();
  
  return (
    <TouchableOpacity onPress={toggle}>
      <Text>Debug ({logs.length} logs)</Text>
    </TouchableOpacity>
  );
}
```

### Custom Error Handling

```tsx
import { DevOverlay, useDevOverlay } from 'tofu-log';

function App() {
  return (
    <DevOverlay>
      <ErrorReporter />
      <MainApp />
    </DevOverlay>
  );
}

function ErrorReporter() {
  const { crashReports } = useDevOverlay();
  
  useEffect(() => {
    if (crashReports.length > 0) {
      // Send to your error tracking service
      sendToSentry(crashReports[0]);
    }
  }, [crashReports]);
  
  return null;
}
```

## Requirements

- React Native 0.70+
- Expo SDK 48+
- React 18+

## License

MIT © Sergio Morales

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Changelog

### 0.1.0

- 🎨 **Vibe Logger** - Cyber-Y2K terminal-style console output
- 🎯 **Smart filtering** - Clean Metro terminal (only warn/error by default)
- 🚀 **Push to Terminal** - Manually send any log to Metro with one tap
- 📋 **Terminal-style Logs tab** - ASCII rendering, kaomojis, monospace fonts
- 🧠 **AI-Ready** - Copy for AI, Share reports, Copy as cURL
- 🪐 **Saturn FAB** - Beautiful draggable floating action button with teal theme
- 🌐 **Network Inspector** - Monitor fetch/XHR with detailed headers/bodies
- 💥 **Crash Reporter** - Error boundary with stack traces and component trees
- 📱 **Device Info** - View device, OS, app, and runtime information
- 📳 **Shake to Open** - Shake gesture to toggle debug panel
- 🌙 **Dark Mode** - Cyber-Y2K inspired design
- 🚀 **Zero Config** - Works out of the box, auto-disabled in production
