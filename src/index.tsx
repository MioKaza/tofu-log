import React from 'react';
import { View } from 'react-native';
import { DevOverlayProvider, useDevOverlay } from './context/DevOverlayContext';
import { DevOverlayContainer } from './components/DevOverlayContainer';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { DevOverlayConfig, CrashReport } from './types';

export type {
  LogEntry,
  NetworkRequest,
  CrashReport,
  DeviceInfo,
  DevOverlayConfig,
  TabName,
  LogLevel,
} from './types';
export { useDevOverlay, DevOverlayProvider } from './context/DevOverlayContext';
export { ErrorBoundary } from './components/ErrorBoundary';
export { TestBench } from './components';
export { 
  setVibeEnabled, 
  isVibeEnabled,
  setTerminalLogLevel,
  getTerminalLogLevel,
  pushLogToTerminal,
} from './interceptors/consoleInterceptor';
export * from './vibe/theme';

interface DevOverlayProps {
  children: React.ReactNode;
  config?: Partial<DevOverlayConfig>;
  enabled?: boolean;
}

function DevOverlayWithErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const { addCrashReport } = useDevOverlay();

  const handleError = (report: CrashReport) => {
    addCrashReport(report);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <DevOverlayContainer>{children}</DevOverlayContainer>
    </ErrorBoundary>
  );
}

function DevOverlayInternal({
  children,
  config,
}: Omit<DevOverlayProps, 'enabled'>) {
  return (
    <DevOverlayProvider config={config}>
      <DevOverlayWithErrorBoundary>{children}</DevOverlayWithErrorBoundary>
    </DevOverlayProvider>
  );
}

function PassThrough({ children }: { children: React.ReactNode }) {
  return <View style={{ flex: 1 }}>{children}</View>;
}

export function DevOverlay({ children, config, enabled }: DevOverlayProps) {
  const shouldEnable = enabled ?? __DEV__;

  if (!shouldEnable) {
    return <PassThrough>{children}</PassThrough>;
  }

  return <DevOverlayInternal config={config}>{children}</DevOverlayInternal>;
}
