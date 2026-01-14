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
      startConsoleInterceptor(handleLog);
    }

    return () => {
      stopConsoleInterceptor();
    };
  }, [config.enabled, handleLog]);
}
