# 🍃 TofuLog

A lightweight developer debugging overlay for React Native Expo apps. Inspect logs, network requests, crashes, and device info directly on your device.

## Features

- 📋 **Smart Log Viewer** — Capture and filter console logs by level (log, info, warn, error, debug)
- 🌐 **Network Inspector** — Monitor all fetch/XHR requests with headers, bodies, and timing
- 💥 **Crash Reporter** — Automatic error boundary with stack traces and component trees
- 📱 **Device Info** — View device, OS, app, and runtime information
- 🍃 **Floating Action Button** — Draggable FAB to open the overlay
- 📳 **Shake to Open** — Shake your device to toggle the debug panel
- 🌙 **Dark Mode** — Beautiful dark theme optimized for debugging
- 🚀 **Zero Config** — Works out of the box, auto-disabled in production

## Installation

```bash
npm install tofu-log
# or
yarn add tofu-log
```

### Peer Dependencies

This package requires the following Expo packages:

```bash
npx expo install expo-sensors expo-device expo-constants
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

- **Tap the FAB** — A floating 🍃 button appears on screen
- **Shake your device** — Shake gesture toggles the overlay

### Tabs

| Tab | Description |
|-----|-------------|
| 📋 Logs | View console.log, warn, error, info, debug with search and filtering |
| 🌐 Network | Inspect fetch/XHR requests, responses, headers, and timing |
| 💥 Crashes | View captured errors with stack traces and component trees |
| 📱 Device | See device model, OS version, app info, and runtime details |

## Configuration

```tsx
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

- Initial release
- Console log interception with filtering
- Network request inspection
- Crash reporting with Error Boundary
- Device info display
- Shake gesture and FAB activation
- Dark mode UI
