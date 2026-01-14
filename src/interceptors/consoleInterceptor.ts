import type { LogLevel, LogEntry } from '../types';
import { generateId } from '../utils/generateId';

type LogCallback = (entry: LogEntry) => void;

let isIntercepting = false;
let logCallback: LogCallback | null = null;

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug,
};

function formatArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    })
    .join(' ');
}

function createInterceptedMethod(level: LogLevel) {
  return function (...args: unknown[]) {
    originalConsole[level].apply(console, args);

    if (logCallback) {
      const entry: LogEntry = {
        id: generateId(),
        level,
        message: formatArgs(args),
        timestamp: Date.now(),
        data: args,
      };
      logCallback(entry);
    }
  };
}

export function startConsoleInterceptor(callback: LogCallback): void {
  if (isIntercepting) return;

  logCallback = callback;
  isIntercepting = true;

  console.log = createInterceptedMethod('log');
  console.warn = createInterceptedMethod('warn');
  console.error = createInterceptedMethod('error');
  console.info = createInterceptedMethod('info');
  console.debug = createInterceptedMethod('debug');
}

export function stopConsoleInterceptor(): void {
  if (!isIntercepting) return;

  console.log = originalConsole.log;
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;

  logCallback = null;
  isIntercepting = false;
}

export function isConsoleIntercepting(): boolean {
  return isIntercepting;
}
