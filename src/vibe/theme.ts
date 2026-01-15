/**
 * TofuLog Vibe Theme
 * Cyber-Y2K / Glitch / Next.js Inspired
 *
 * Edit this file to customize the "skin" of your logger.
 * All visual constants are centralized here.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS (Hex for Chrome CSS, ANSI codes for Terminal)
// ═══════════════════════════════════════════════════════════════════════════════

export const COLORS = {
  // Primary Palette
  magenta: '#3DB6B1',
  cyan: '#00F0FF',
  yellow: '#FFE600',
  red: '#FF0055',
  green: '#00FF88',
  white: '#FFFFFF',
  gray: '#888888',
  darkGray: '#333333',
  black: '#000000',

  // Semantic Colors
  error: '#FF0055',
  warn: '#FFE600',
  info: '#00F0FF',
  debug: '#888888',
  log: '#FFFFFF',
} as const;

// ANSI Escape Codes for Terminal
export const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  blink: '\x1b[5m',
  inverse: '\x1b[7m',

  // Foreground Colors
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
  },

  // Background Colors
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    gray: '\x1b[100m',
    brightRed: '\x1b[101m',
    brightMagenta: '\x1b[105m',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// KAOMOJIS - Expressive faces for different log levels
// ═══════════════════════════════════════════════════════════════════════════════

export const KAOMOJI = {
  // Error States
  crash: '(╯°□°)╯︵ ┻━┻',
  error: '(҂◡_◡)',
  panic: '(;´༎ຶД༎ຶ`)',
  dead: '(✖╭╮✖)',
  confused: '(⊙_⊙)?',

  // Warning States
  warn: '(¬_¬")',
  suspicious: '(눈_눈)',
  thinking: '(・・?)',
  sweating: '(°△°|||)',

  // Success / Info States
  cool: '(⌐■_■)',
  happy: '(◕‿◕)',
  sparkle: '(ノ◕ヮ◕)ノ*:・゚✧',
  thumbsUp: '(๑•̀ㅂ•́)و✧',
  shrug: '¯\\_(ツ)_/¯',

  // Network States
  loading: '( ˘▽˘)っ♨',
  sending: '(ノ・∀・)ノ',
  received: '(•‿•)',
  timeout: '(－_－) zzZ',

  // Debug / Log States
  debug: '(•_•)',
  log: '(｡◕‿◕｡)',
  info: '(◉‿◉)',
  trace: '(¬‿¬)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ASCII BOX DRAWING - For creating "cards" around errors
// ═══════════════════════════════════════════════════════════════════════════════

export const BOX = {
  // Single Line
  topLeft: '┌',
  topRight: '┐',
  bottomLeft: '└',
  bottomRight: '┘',
  horizontal: '─',
  vertical: '│',

  // Double Line (for emphasis)
  dTopLeft: '╔',
  dTopRight: '╗',
  dBottomLeft: '╚',
  dBottomRight: '╝',
  dHorizontal: '═',
  dVertical: '║',

  // Connectors
  teeRight: '├',
  teeLeft: '┤',
  teeDown: '┬',
  teeUp: '┴',
  cross: '┼',

  // Double Connectors
  dTeeRight: '╠',
  dTeeLeft: '╣',
  dTeeDown: '╦',
  dTeeUp: '╩',
  dCross: '╬',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// GLITCH TEXT - Decorative elements
// ═══════════════════════════════════════════════════════════════════════════════

export const GLITCH = {
  bar: '█▓▒░',
  barReverse: '░▒▓█',
  dots: '•••',
  arrow: '►',
  arrowDouble: '»',
  bullet: '◆',
  star: '★',
  sparkle: '✦',
  lightning: '⚡',
  fire: '🔥',
  skull: '💀',
  warning: '⚠',
  check: '✓',
  cross: '✗',
  radioactive: '☢',
  biohazard: '☣',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BADGES & LABELS - Prefixes for different log types
// ═══════════════════════════════════════════════════════════════════════════════

export const BADGE = {
  error: `${GLITCH.skull} ERROR`,
  warn: `${GLITCH.warning} WARN`,
  info: `${GLITCH.bullet} INFO`,
  debug: `${GLITCH.dots} DEBUG`,
  log: `${GLITCH.arrow} LOG`,
  network: `${GLITCH.lightning} NET`,
  crash: `${GLITCH.fire} CRASH`,
  tip: `${GLITCH.sparkle} TIP`,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// CHROME CSS STYLES - For %c formatting in browser console
// ═══════════════════════════════════════════════════════════════════════════════

export const CSS_STYLES = {
  badge: {
    error: `background: ${COLORS.red}; color: ${COLORS.white}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
    warn: `background: ${COLORS.yellow}; color: ${COLORS.black}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
    info: `background: ${COLORS.cyan}; color: ${COLORS.black}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
    debug: `background: ${COLORS.gray}; color: ${COLORS.white}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
    log: `background: ${COLORS.magenta}; color: ${COLORS.white}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
    network: `background: ${COLORS.cyan}; color: ${COLORS.black}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
    crash: `background: ${COLORS.red}; color: ${COLORS.white}; padding: 2px 6px; border-radius: 3px; font-weight: bold; text-transform: uppercase;`,
    tip: `background: ${COLORS.green}; color: ${COLORS.black}; padding: 2px 6px; border-radius: 3px; font-weight: bold;`,
  },
  message: {
    error: `color: ${COLORS.red}; font-weight: bold;`,
    warn: `color: ${COLORS.yellow};`,
    info: `color: ${COLORS.cyan};`,
    debug: `color: ${COLORS.gray};`,
    log: `color: ${COLORS.white};`,
  },
  reset: 'color: inherit; background: inherit; font-weight: normal;',
  kaomoji: `font-size: 14px;`,
  timestamp: `color: ${COLORS.gray}; font-size: 10px;`,
  stackTrace: `color: ${COLORS.gray}; font-family: monospace; font-size: 11px;`,
  aiContext: `background: ${COLORS.darkGray}; color: ${COLORS.cyan}; padding: 8px; border-radius: 4px; font-family: monospace; margin: 4px 0;`,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ASCII ART TEMPLATES - Pre-built card layouts
// ═══════════════════════════════════════════════════════════════════════════════

const BOX_WIDTH = 60;

export function createBoxTop(title: string = ''): string {
  const titleWithPadding = title ? ` ${title} ` : '';
  const remainingWidth = BOX_WIDTH - 2 - titleWithPadding.length;
  const leftPad = Math.floor(remainingWidth / 2);
  const rightPad = remainingWidth - leftPad;
  return `${BOX.dTopLeft}${BOX.dHorizontal.repeat(leftPad)}${titleWithPadding}${BOX.dHorizontal.repeat(rightPad)}${BOX.dTopRight}`;
}

export function createBoxLine(content: string = ''): string {
  const contentLength = content.length;
  const padding = BOX_WIDTH - 4 - contentLength;
  const paddedContent = padding > 0 ? content + ' '.repeat(padding) : content.slice(0, BOX_WIDTH - 4);
  return `${BOX.dVertical} ${paddedContent} ${BOX.dVertical}`;
}

export function createBoxDivider(): string {
  return `${BOX.dTeeRight}${BOX.dHorizontal.repeat(BOX_WIDTH - 2)}${BOX.dTeeLeft}`;
}

export function createBoxBottom(): string {
  return `${BOX.dBottomLeft}${BOX.dHorizontal.repeat(BOX_WIDTH - 2)}${BOX.dBottomRight}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOFU BRANDING
// ═══════════════════════════════════════════════════════════════════════════════

export const TOFU_LOGO = `
  ╔════════════════════════════════════════╗
  ║   ████████╗ ██████╗ ███████╗██╗   ██╗  ║
  ║   ╚══██╔══╝██╔═══██╗██╔════╝██║   ██║  ║
  ║      ██║   ██║   ██║█████╗  ██║   ██║  ║
  ║      ██║   ██║   ██║██╔══╝  ██║   ██║  ║
  ║      ██║   ╚██████╔╝██║     ╚██████╔╝  ║
  ║      ╚═╝    ╚═════╝ ╚═╝      ╚═════╝   ║
  ║            L O G G E R                 ║
  ╚════════════════════════════════════════╝
`;

export const TOFU_MINI = '🧈 TOFU';
