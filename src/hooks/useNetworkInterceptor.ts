import { useEffect, useCallback } from 'react';
import { useDevOverlay } from '../context/DevOverlayContext';
import {
  startNetworkInterceptor,
  stopNetworkInterceptor,
} from '../interceptors/networkInterceptor';
import type { NetworkRequest } from '../types';

export function useNetworkInterceptor() {
  const { addNetworkRequest, updateNetworkRequest, config } = useDevOverlay();

  const handleRequestStart = useCallback(
    (request: NetworkRequest) => {
      addNetworkRequest(request);
    },
    [addNetworkRequest]
  );

  const handleRequestEnd = useCallback(
    (id: string, updates: Partial<NetworkRequest>) => {
      updateNetworkRequest(id, updates);
    },
    [updateNetworkRequest]
  );

  useEffect(() => {
    if (config.enabled) {
      startNetworkInterceptor(handleRequestStart, handleRequestEnd);
    }

    return () => {
      stopNetworkInterceptor();
    };
  }, [config.enabled, handleRequestStart, handleRequestEnd]);
}
