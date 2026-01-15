import type { LogLevel, LogEntry } from '../types';
import { generateId } from '../utils/generateId';
import { vibeLog, printStartupBanner } from '../vibe/logger';

type LogCallback = (entry: LogEntry) => void;

let isIntercepting = false;
let logCallback: LogCallback | null = null;
let vibeEnabled = true; // Enable Vibe Logger styling by default
let terminalLogLevel: LogLevel | 'all' = 'warn'; // Only warn/error to terminal by default

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

function extractErrorStack(args: unknown[]): string | undefined {
  for (const arg of args) {
    if (arg instanceof Error && arg.stack) {
      return arg.stack;
    }
  }
  return undefined;
}

function shouldLogToTerminal(level: LogLevel): boolean {
  if (terminalLogLevel === 'all') return true;
  
  // Define priority: error > warn > info > log > debug
  const levelPriority: Record<LogLevel, number> = {
    error: 4,
    warn: 3,
    info: 2,
    log: 1,
    debug: 0,
  };
  
  return levelPriority[level] >= levelPriority[terminalLogLevel];
}

function createInterceptedMethod(level: LogLevel) {
  return function (...args: unknown[]) {
    const message = formatArgs(args);
    const stack = extractErrorStack(args);

    // Output to terminal only if level passes filter
    if (shouldLogToTerminal(level)) {
      if (vibeEnabled) {
        vibeLog(originalConsole, {
          level,
          message,
          data: args,
          stack,
        });
      } else {
        originalConsole[level].apply(console, args);
      }
    }

    // Capture for the UI overlay
    if (logCallback) {
      const entry: LogEntry = {
        id: generateId(),
        level,
        message,
        timestamp: Date.now(),
        data: args,
      };
      logCallback(entry);
    }
  };
}

export interface ConsoleInterceptorOptions {
  callback: LogCallback;
  enableVibe?: boolean; // Default: true
  showBanner?: boolean; // Default: true
  terminalLogLevel?: LogLevel | 'all'; // Default: 'warn' (only warn/error to terminal)
}

export function startConsoleInterceptor(options: ConsoleInterceptorOptions | LogCallback): void {
  if (isIntercepting) return;

  // Support both old API (just callback) and new API (options object)
  if (typeof options === 'function') {
    logCallback = options;
    vibeEnabled = true;
  } else {
    logCallback = options.callback;
    vibeEnabled = options.enableVibe !== false;
    terminalLogLevel = options.terminalLogLevel ?? 'warn';
    
    // Show startup banner
    if (options.showBanner !== false && vibeEnabled) {
      printStartupBanner(originalConsole);
    }
  }

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

export function setVibeEnabled(enabled: boolean): void {
  vibeEnabled = enabled;
}

export function isVibeEnabled(): boolean {
  return vibeEnabled;
}

export function setTerminalLogLevel(level: LogLevel | 'all'): void {
  terminalLogLevel = level;
}

export function getTerminalLogLevel(): LogLevel | 'all' {
  return terminalLogLevel;
}

export function pushLogToTerminal(entry: LogEntry): void {
  try {
    if (!vibeEnabled) {
      originalConsole[entry.level].apply(console, entry.data || [entry.message]);
      return;
    }

    const errorData = entry.data?.find(d => d instanceof Error) as Error | undefined;
    const stack = errorData?.stack;
    vibeLog(originalConsole, {
      level: entry.level,
      message: entry.message,
      data: entry.data || [],
      stack,
    });
  } catch (error) {
    // If push fails, log to original console as fallback
    originalConsole.error('[TofuLog] Failed to push log to terminal:', error);
    originalConsole[entry.level](entry.message, ...(entry.data || []));
  }
}
