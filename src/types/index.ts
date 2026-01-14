export type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: unknown[];
}

export interface NetworkRequest {
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

export interface CrashReport {
  id: string;
  error: Error;
  componentStack?: string;
  timestamp: number;
}

export interface DeviceInfo {
  brand?: string;
  modelName?: string;
  osName?: string;
  osVersion?: string;
  deviceType?: string;
  totalMemory?: number;
}

export interface DevOverlayConfig {
  enabled?: boolean;
  shakeToOpen?: boolean;
  showFab?: boolean;
  fabPosition?: { x: number; y: number };
  maxLogs?: number;
  maxNetworkRequests?: number;
}

export type TabName = 'logs' | 'network' | 'crashes' | 'device';
