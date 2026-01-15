/**
 * TofuLog Vibe Logger
 * Core formatting logic for Terminal (ANSI) and Chrome DevTools (CSS)
 *
 * Detects the runtime environment and applies the appropriate styling.
 */

import {
  ANSI,
  KAOMOJI,
  BADGE,
  CSS_STYLES,
  GLITCH,
  createBoxTop,
  createBoxLine,
  createBoxDivider,
  createBoxBottom,
  TOFU_MINI,
} from './theme';
import { findErrorDefinition } from '../utils/errorDictionary';
import type { LogLevel } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

type Environment = 'terminal' | 'chrome' | 'unknown';

function detectEnvironment(): Environment {
  // Check if we're in a browser environment (Chrome DevTools remote debugging)
  // Using typeof checks to avoid ReferenceErrors in non-browser environments
  if (typeof globalThis !== 'undefined') {
    const g = globalThis as any;
    if (typeof g.window !== 'undefined' && typeof g.document !== 'undefined') {
      return 'chrome';
    }
  }

  // Check if we're in Node/Metro terminal
  if (typeof process !== 'undefined' && process.stdout && (process.stdout as any).isTTY) {
    return 'terminal';
  }

  // React Native without remote debugging - still use terminal-style
  // because Metro bundler will display the output
  if (typeof global !== 'undefined' && (global as any).__DEV__) {
    return 'terminal';
  }

  return 'terminal'; // Default to terminal for React Native
}

const ENV = detectEnvironment();

// ═══════════════════════════════════════════════════════════════════════════════
// TIMESTAMP FORMATTING
// ═══════════════════════════════════════════════════════════════════════════════

function getTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TERMINAL (ANSI) FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════════

function getAnsiColorForLevel(level: LogLevel): string {
  switch (level) {
    case 'error':
      return ANSI.fg.brightRed;
    case 'warn':
      return ANSI.fg.brightYellow;
    case 'info':
      return ANSI.fg.brightCyan;
    case 'debug':
      return ANSI.fg.gray;
    case 'log':
    default:
      return ANSI.fg.brightMagenta;
  }
}

function getKaomojiForLevel(level: LogLevel): string {
  switch (level) {
    case 'error':
      return KAOMOJI.error;
    case 'warn':
      return KAOMOJI.warn;
    case 'info':
      return KAOMOJI.info;
    case 'debug':
      return KAOMOJI.debug;
    case 'log':
    default:
      return KAOMOJI.log;
  }
}

function getBadgeForLevel(level: LogLevel): string {
  switch (level) {
    case 'error':
      return BADGE.error;
    case 'warn':
      return BADGE.warn;
    case 'info':
      return BADGE.info;
    case 'debug':
      return BADGE.debug;
    case 'log':
    default:
      return BADGE.log;
  }
}

function formatTerminalSimple(level: LogLevel, message: string): string {
  const color = getAnsiColorForLevel(level);
  const badge = getBadgeForLevel(level);
  const kaomoji = getKaomojiForLevel(level);
  const timestamp = getTimestamp();

  return `${ANSI.fg.gray}${timestamp}${ANSI.reset} ${color}${ANSI.bold}${badge}${ANSI.reset} ${kaomoji} ${color}${message}${ANSI.reset}`;
}

function formatTerminalErrorCard(message: string, stack?: string): string[] {
  const lines: string[] = [];
  const errorDef = findErrorDefinition(message);

  // Header
  lines.push('');
  lines.push(`${ANSI.fg.brightRed}${ANSI.bold}${createBoxTop(`${KAOMOJI.crash} CRASH DETECTED`)}${ANSI.reset}`);

  // Error Message
  const truncatedMessage = message.length > 54 ? message.slice(0, 51) + '...' : message;
  lines.push(`${ANSI.fg.brightRed}${createBoxLine('')}${ANSI.reset}`);
  lines.push(`${ANSI.fg.brightRed}${createBoxLine(truncatedMessage)}${ANSI.reset}`);

  // Knowledge Base Tip (if found)
  if (errorDef) {
    lines.push(`${ANSI.fg.brightRed}${createBoxDivider()}${ANSI.reset}`);
    lines.push(`${ANSI.fg.brightGreen}${createBoxLine(`${GLITCH.sparkle} ${errorDef.title}`)}${ANSI.reset}`);
    lines.push(`${ANSI.fg.brightCyan}${createBoxLine('')}${ANSI.reset}`);

    // Word wrap the explanation
    const explanationWords = errorDef.explanation.split(' ');
    let currentLine = '';
    for (const word of explanationWords) {
      if ((currentLine + ' ' + word).length > 54) {
        lines.push(`${ANSI.fg.white}${createBoxLine(currentLine.trim())}${ANSI.reset}`);
        currentLine = word;
      } else {
        currentLine += ' ' + word;
      }
    }
    if (currentLine.trim()) {
      lines.push(`${ANSI.fg.white}${createBoxLine(currentLine.trim())}${ANSI.reset}`);
    }

    lines.push(`${ANSI.fg.brightCyan}${createBoxLine('')}${ANSI.reset}`);
    lines.push(`${ANSI.fg.brightYellow}${createBoxLine(`${BADGE.tip}: ${errorDef.tip.slice(0, 45)}...`)}${ANSI.reset}`);
  }

  // AI Context Section (Copy-Paste Ready)
  lines.push(`${ANSI.fg.brightRed}${createBoxDivider()}${ANSI.reset}`);
  lines.push(`${ANSI.fg.brightCyan}${createBoxLine(`${GLITCH.lightning} COPY FOR AI ${GLITCH.lightning}`)}${ANSI.reset}`);
  lines.push(`${ANSI.fg.brightRed}${createBoxLine('')}${ANSI.reset}`);

  // The actual copyable content
  lines.push(`${ANSI.fg.gray}+-----------------------------------------------------------+${ANSI.reset}`);
  lines.push(`${ANSI.fg.white}  Error: ${message.slice(0, 50)}${ANSI.reset}`);
  if (stack) {
    const stackLines = stack.split('\n').slice(0, 3);
    for (const stackLine of stackLines) {
      lines.push(`${ANSI.fg.gray}  ${stackLine.trim().slice(0, 55)}${ANSI.reset}`);
    }
  }
  lines.push(`${ANSI.fg.gray}+-----------------------------------------------------------+${ANSI.reset}`);

  // Footer
  lines.push(`${ANSI.fg.brightRed}${createBoxBottom()}${ANSI.reset}`);
  lines.push('');

  return lines;
}

function formatTerminalWarnCard(message: string): string[] {
  const lines: string[] = [];
  const errorDef = findErrorDefinition(message);

  lines.push('');
  lines.push(`${ANSI.fg.brightYellow}${ANSI.bold}+--- ${KAOMOJI.warn} WARNING -------------------------------------------+${ANSI.reset}`);

  const truncatedMessage = message.length > 54 ? message.slice(0, 51) + '...' : message;
  lines.push(`${ANSI.fg.brightYellow}| ${truncatedMessage.padEnd(56)} |${ANSI.reset}`);

  if (errorDef) {
    lines.push(`${ANSI.fg.brightGreen}| ${BADGE.tip}: ${errorDef.tip.slice(0, 48).padEnd(52)} |${ANSI.reset}`);
  }

  lines.push(`${ANSI.fg.brightYellow}+----------------------------------------------------------+${ANSI.reset}`);
  lines.push('');

  return lines;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHROME (CSS) FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════════

interface ChromeLogArgs {
  format: string;
  styles: string[];
  data: unknown[];
}

function formatChromeSimple(level: LogLevel, message: string, data: unknown[]): ChromeLogArgs {
  const badge = getBadgeForLevel(level);
  const kaomoji = getKaomojiForLevel(level);
  const badgeStyle = CSS_STYLES.badge[level] || CSS_STYLES.badge.log;
  const messageStyle = CSS_STYLES.message[level] || CSS_STYLES.message.log;

  return {
    format: `%c${TOFU_MINI}%c %c${badge}%c ${kaomoji} %c${message}%c`,
    styles: [
      CSS_STYLES.badge.log,
      CSS_STYLES.reset,
      badgeStyle,
      CSS_STYLES.reset,
      messageStyle,
      CSS_STYLES.reset,
    ],
    data: data.length > 0 ? data : [],
  };
}

function formatChromeErrorCard(message: string, stack?: string, data?: unknown[]): ChromeLogArgs {
  const errorDef = findErrorDefinition(message);

  const parts: string[] = [];
  const styles: string[] = [];

  // Header Badge
  parts.push(`%c${KAOMOJI.crash} CRASH%c`);
  styles.push(CSS_STYLES.badge.crash, CSS_STYLES.reset);

  // Error Message
  parts.push(` %c${message}%c`);
  styles.push(CSS_STYLES.message.error, CSS_STYLES.reset);

  // Knowledge Base
  if (errorDef) {
    parts.push(`\n\n%c${GLITCH.sparkle} ${errorDef.title}%c`);
    styles.push(CSS_STYLES.badge.tip, CSS_STYLES.reset);

    parts.push(`\n%c${errorDef.explanation}%c`);
    styles.push('color: #AAA; font-style: italic;', CSS_STYLES.reset);

    parts.push(`\n\n%c TIP:%c %c${errorDef.tip}%c`);
    styles.push(CSS_STYLES.badge.tip, CSS_STYLES.reset, 'color: #00FF88;', CSS_STYLES.reset);
  }

  // AI Context
  parts.push(`\n\n%c${GLITCH.lightning} COPY FOR AI:%c`);
  styles.push(CSS_STYLES.badge.network, CSS_STYLES.reset);

  const stackText = stack ? stack.split('\n').slice(0, 5).join('\n') : '';
  parts.push(`\n%c\`\`\`\nError: ${message}\n${stackText}\n\`\`\`%c`);
  styles.push(CSS_STYLES.aiContext, CSS_STYLES.reset);

  return {
    format: parts.join(''),
    styles,
    data: data || [],
  };
}

function formatChromeWarnCard(message: string, data?: unknown[]): ChromeLogArgs {
  const errorDef = findErrorDefinition(message);

  const parts: string[] = [];
  const styles: string[] = [];

  parts.push(`%c${KAOMOJI.warn} WARN%c`);
  styles.push(CSS_STYLES.badge.warn, CSS_STYLES.reset);

  parts.push(` %c${message}%c`);
  styles.push(CSS_STYLES.message.warn, CSS_STYLES.reset);

  if (errorDef) {
    parts.push(`\n%c TIP: ${errorDef.tip}%c`);
    styles.push('color: #00FF88; font-size: 11px;', CSS_STYLES.reset);
  }

  return {
    format: parts.join(''),
    styles,
    data: data || [],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API - The main formatting functions
// ═══════════════════════════════════════════════════════════════════════════════

export interface VibeLogOptions {
  level: LogLevel;
  message: string;
  data?: unknown[];
  stack?: string;
  useCard?: boolean; // Force card layout for errors/warns
}

/**
 * Format and print a log entry with the Vibe style.
 * Automatically detects Terminal vs Chrome and applies appropriate formatting.
 */
export function vibeLog(
  originalConsole: Record<string, (...args: unknown[]) => void>,
  options: VibeLogOptions
): void {
  const { level, message, data = [], stack, useCard } = options;

  // Determine if we should use card layout
  const shouldUseCard = useCard ?? (level === 'error' || level === 'warn');

  if (ENV === 'chrome') {
    // Chrome DevTools formatting
    let logArgs: ChromeLogArgs;

    if (level === 'error' && shouldUseCard) {
      logArgs = formatChromeErrorCard(message, stack, data);
    } else if (level === 'warn' && shouldUseCard) {
      logArgs = formatChromeWarnCard(message, data);
    } else {
      logArgs = formatChromeSimple(level, message, data);
    }

    const consoleMethod = originalConsole[level] || originalConsole.log;
    if (logArgs.data.length > 0) {
      consoleMethod(logArgs.format, ...logArgs.styles, ...logArgs.data);
    } else {
      consoleMethod(logArgs.format, ...logArgs.styles);
    }
  } else {
    // Terminal (Metro Bundler) formatting
    const consoleMethod = originalConsole[level] || originalConsole.log;
    
    // Store ANSI codes in variables to avoid React hook detection
    const grayColor = ANSI.fg.gray;
    const resetCode = ANSI.reset;

    if (level === 'error' && shouldUseCard) {
      const lines = formatTerminalErrorCard(message, stack);
      for (const line of lines) {
        consoleMethod(line);
      }
      // Also log the raw data for inspection
      if (data.length > 0) {
        consoleMethod(`${grayColor}Raw data:${resetCode}`, ...data);
      }
    } else if (level === 'warn' && shouldUseCard) {
      const lines = formatTerminalWarnCard(message);
      for (const line of lines) {
        consoleMethod(line);
      }
      if (data.length > 0) {
        consoleMethod(`${grayColor}Raw data:${resetCode}`, ...data);
      }
    } else {
      const formatted = formatTerminalSimple(level, message);
      if (data.length > 0) {
        consoleMethod(formatted, ...data);
      } else {
        consoleMethod(formatted);
      }
    }
  }
}

/**
 * Print the TofuLog startup banner.
 */
export function printStartupBanner(originalConsole: Record<string, (...args: unknown[]) => void>): void {
  if (ENV === 'chrome') {
    originalConsole.log(
      `%c${TOFU_MINI}%c Vibe Logger Active ${KAOMOJI.sparkle}`,
      CSS_STYLES.badge.log,
      'color: #3DB6B1; font-weight: bold;'
    );
  } else {
    originalConsole.log('');
    originalConsole.log(`${ANSI.fg.brightMagenta}${ANSI.bold}  +=======================================+${ANSI.reset}`);
    originalConsole.log(`${ANSI.fg.brightMagenta}${ANSI.bold}  |  ${TOFU_MINI} VIBE LOGGER ACTIVE ${KAOMOJI.sparkle}    |${ANSI.reset}`);
    originalConsole.log(`${ANSI.fg.brightMagenta}${ANSI.bold}  +=======================================+${ANSI.reset}`);
    originalConsole.log('');
  }
}

export { ENV as currentEnvironment };
