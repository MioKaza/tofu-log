import { Alert } from 'react-native';

// Lazy load expo modules to avoid native module errors
let Clipboard: any = null;
let Sharing: any = null;
let FileSystem: any = null;

try {
  Clipboard = require('expo-clipboard');
} catch (e) {
  console.warn('[TofuLog] expo-clipboard not available');
}

try {
  Sharing = require('expo-sharing');
} catch (e) {
  console.warn('[TofuLog] expo-sharing not available');
}

try {
  FileSystem = require('expo-file-system');
} catch (e) {
  console.warn('[TofuLog] expo-file-system not available');
}

import type { LogEntry, NetworkRequest, CrashReport } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════════

export function formatCrashForAI(crash: CrashReport): string {
  return `I encountered this error in my React Native Expo app. Please fix it.

**Error:** \`${crash.error.name}: ${crash.error.message}\`

**Stack Trace:**
\`\`\`
${crash.error.stack || 'No stack trace available'}
\`\`\`

**Component Stack:**
\`\`\`
${crash.componentStack || 'No component stack available'}
\`\`\`

**Timestamp:** ${new Date(crash.timestamp).toISOString()}
`;
}

export function formatLogForClipboard(log: LogEntry): string {
  const dataStr = log.data && log.data.length > 0 
    ? `\nData: ${JSON.stringify(log.data, null, 2)}` 
    : '';
  return `[${log.level.toUpperCase()}] ${new Date(log.timestamp).toLocaleTimeString()} - ${log.message}${dataStr}`;
}

export function formatNetworkAsCurl(req: NetworkRequest): string {
  let curl = `curl -X ${req.method} "${req.url}"`;
  
  if (req.requestHeaders) {
    Object.entries(req.requestHeaders).forEach(([key, value]) => {
      curl += ` \\\n  -H "${key}: ${value}"`;
    });
  }

  if (req.requestBody) {
    const body = typeof req.requestBody === 'string' 
      ? req.requestBody 
      : JSON.stringify(req.requestBody);
    curl += ` \\\n  -d '${body}'`;
  }

  return curl;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!Clipboard) {
    console.warn('[TofuLog] Clipboard not available');
    return false;
  }
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    console.warn('[TofuLog] Failed to copy to clipboard:', error);
    return false;
  }
}

export async function shareFile(filename: string, content: string, mimeType: string = 'text/plain'): Promise<boolean> {
  if (!Sharing || !FileSystem) {
    console.warn('[TofuLog] Sharing or FileSystem not available');
    Alert.alert('Sharing not available', 'Required modules are not installed.');
    return false;
  }

  try {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Sharing not available', 'Sharing is not supported on this device/simulator');
      return false;
    }

    // Use cacheDirectory if available, otherwise fallback
    const directory = FileSystem.cacheDirectory || FileSystem.documentDirectory;
    if (!directory) {
      throw new Error('No valid file system directory found');
    }
    
    const fileUri = `${directory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, content, { encoding: 'utf8' });
    await Sharing.shareAsync(fileUri, { mimeType, UTI: mimeType });
    return true;
  } catch (error) {
    console.error('[TofuLog] Failed to share file:', error);
    Alert.alert('Share Failed', 'Could not share the file.');
    return false;
  }
}
