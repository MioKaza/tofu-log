import { useEffect, useCallback } from 'react';
import { useDevOverlay } from '../context/DevOverlayContext';
import {
  startConsoleInterceptor,
  stopConsoleInterceptor,
} from '../interceptors/consoleInterceptor';
import type { LogEntry } from '../types';

export function useConsoleInterceptor() {
  const { addLog, config } = useDevOverlay();

  const handleLog = useCallback(
    (entry: LogEntry) => {
      addLog(entry);
    },
    [addLog]
  );

  useEffect(() => {
    if (config.enabled) {
      startConsoleInterceptor({
        callback: handleLog,
        enableVibe: true,
        showBanner: true,
        terminalLogLevel: 'warn', // Only warn/error to Metro terminal by default
      });
    }

    return () => {
      stopConsoleInterceptor();
    };
  }, [config.enabled, handleLog]);
}
