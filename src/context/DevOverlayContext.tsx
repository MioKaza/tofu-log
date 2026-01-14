import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  LogEntry,
  NetworkRequest,
  CrashReport,
  DevOverlayConfig,
  TabName,
} from '../types';

interface DevOverlayState {
  isVisible: boolean;
  activeTab: TabName;
  logs: LogEntry[];
  networkRequests: NetworkRequest[];
  crashReports: CrashReport[];
  config: DevOverlayConfig;
}

interface DevOverlayContextValue extends DevOverlayState {
  show: () => void;
  hide: () => void;
  toggle: () => void;
  setActiveTab: (tab: TabName) => void;
  addLog: (log: LogEntry) => void;
  clearLogs: () => void;
  addNetworkRequest: (request: NetworkRequest) => void;
  updateNetworkRequest: (id: string, updates: Partial<NetworkRequest>) => void;
  clearNetworkRequests: () => void;
  addCrashReport: (report: CrashReport) => void;
  clearCrashReports: () => void;
  updateConfig: (config: Partial<DevOverlayConfig>) => void;
}

const defaultConfig: DevOverlayConfig = {
  enabled: true,
  shakeToOpen: true,
  showFab: true,
  fabPosition: { x: 20, y: 100 },
  maxLogs: 500,
  maxNetworkRequests: 100,
};

const DevOverlayContext = createContext<DevOverlayContextValue | null>(null);

export function useDevOverlay(): DevOverlayContextValue {
  const context = useContext(DevOverlayContext);
  if (!context) {
    throw new Error('useDevOverlay must be used within a DevOverlayProvider');
  }
  return context;
}

interface DevOverlayProviderProps {
  children: React.ReactNode;
  config?: Partial<DevOverlayConfig>;
}

export function DevOverlayProvider({
  children,
  config: initialConfig,
}: DevOverlayProviderProps) {
  const [state, setState] = useState<DevOverlayState>({
    isVisible: false,
    activeTab: 'logs',
    logs: [],
    networkRequests: [],
    crashReports: [],
    config: { ...defaultConfig, ...initialConfig },
  });

  const show = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: true }));
  }, []);

  const hide = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setActiveTab = useCallback((tab: TabName) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  const addLog = useCallback((log: LogEntry) => {
    setState((prev) => {
      const maxLogs = prev.config.maxLogs ?? 500;
      const newLogs = [log, ...prev.logs].slice(0, maxLogs);
      return { ...prev, logs: newLogs };
    });
  }, []);

  const clearLogs = useCallback(() => {
    setState((prev) => ({ ...prev, logs: [] }));
  }, []);

  const addNetworkRequest = useCallback((request: NetworkRequest) => {
    setState((prev) => {
      const maxRequests = prev.config.maxNetworkRequests ?? 100;
      const newRequests = [request, ...prev.networkRequests].slice(
        0,
        maxRequests
      );
      return { ...prev, networkRequests: newRequests };
    });
  }, []);

  const updateNetworkRequest = useCallback(
    (id: string, updates: Partial<NetworkRequest>) => {
      setState((prev) => ({
        ...prev,
        networkRequests: prev.networkRequests.map((req) =>
          req.id === id ? { ...req, ...updates } : req
        ),
      }));
    },
    []
  );

  const clearNetworkRequests = useCallback(() => {
    setState((prev) => ({ ...prev, networkRequests: [] }));
  }, []);

  const addCrashReport = useCallback((report: CrashReport) => {
    setState((prev) => ({
      ...prev,
      crashReports: [report, ...prev.crashReports],
    }));
  }, []);

  const clearCrashReports = useCallback(() => {
    setState((prev) => ({ ...prev, crashReports: [] }));
  }, []);

  const updateConfig = useCallback((config: Partial<DevOverlayConfig>) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, ...config },
    }));
  }, []);

  const value: DevOverlayContextValue = {
    ...state,
    show,
    hide,
    toggle,
    setActiveTab,
    addLog,
    clearLogs,
    addNetworkRequest,
    updateNetworkRequest,
    clearNetworkRequests,
    addCrashReport,
    clearCrashReports,
    updateConfig,
  };

  return (
    <DevOverlayContext.Provider value={value}>
      {children}
    </DevOverlayContext.Provider>
  );
}
