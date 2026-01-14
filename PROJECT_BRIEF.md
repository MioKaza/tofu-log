# TofuLog - Project Brief

## Overview
A developer debugging overlay for React Native Expo apps that works seamlessly with both Expo Go and custom dev builds. Zero-config installation, mobile-optimized UI.

## Core Philosophy
- Works out of the box with Expo Go (major differentiator)
- Zero configuration needed
- Mobile-first UI (not a desktop companion app)
- Minimal performance impact
- Production-safe (automatically disabled)
- Beautiful, intuitive interface

## Target Users
- React Native developers using Expo
- Teams debugging mobile apps
- Solo developers who want better logs than console.log

## Key Features (MVP - Phase 1)

### 1. Smart Log Viewer
- Captures all console.log/warn/error
- Color-coded by severity
- Timestamps + relative time
- Search and filter
- Auto-categorization (Network, State, Component, etc)

### 2. Network Inspector
- Automatically intercepts fetch/axios
- Shows: method, URL, status, timing, size
- Request/response viewer with JSON formatting
- Failed request highlighting

### 3. Crash Reporter
- Enhanced error boundaries
- Full stack traces
- Component tree at crash time
- Recent logs before crash
- Export crash report

### 4. Device Info
- OS version, device model, screen size
- Memory usage, app version
- Network status

## UI/UX Design

### Activation
- Shake gesture (default)
- Floating draggable button (optional)
- Three-finger tap (alternative)

### Overlay Interface
- Slides up from bottom (iOS-style)
- Tabs: Logs | Network | Crashes | Device | Settings
- Dark mode optimized
- Swipe down to dismiss
- Minimize to edge pill

## Technical Architecture

### Package Structure
```
tofu-log/
├── src/
│   ├── components/
│   │   ├── Overlay.tsx
│   │   ├── LogViewer.tsx
│   │   ├── NetworkPanel.tsx
│   │   ├── CrashReporter.tsx
│   │   └── FloatingButton.tsx
│   ├── interceptors/
│   │   ├── consoleInterceptor.ts
│   │   ├── networkInterceptor.ts
│   │   └── errorInterceptor.ts
│   ├── storage/
│   │   └── LogStorage.ts
│   ├── types/
│   │   └── index.ts
│   └── index.tsx
```

### Tech Stack
- React Native
- Expo SDK 52+
- TypeScript
- React Navigation (for tabs)
- AsyncStorage (for log persistence)
- expo-sensors (for shake detection)

### Usage API
```typescript
import { DevOverlay } from 'tofu-log';

export default function App() {
  return (
    <DevOverlay>
      <App />
    </DevOverlay>
  );
}
```

## Non-Goals (For MVP)
- State management inspection (add later)
- Performance profiling (add later)
- Remote debugging dashboard (add later)
- Video recording (add later)

## Success Metrics
- Easy installation (1 line of code)
- Works in Expo Go immediately
- < 100ms performance impact
- Intuitive UI that devs love
- 1000+ GitHub stars in 6 months

## Future Enhancements (Post-MVP)
- Redux/Zustand state inspector
- Performance monitoring
- AsyncStorage browser
- Remote log sharing
- Screenshot capture
- Community plugins system
