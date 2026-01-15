import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
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

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await Clipboard.setStringAsync(text);
  } catch (error) {
    console.warn('Failed to copy to clipboard:', error);
  }
}

export async function shareFile(filename: string, content: string, mimeType: string = 'text/plain'): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert('Sharing not available', 'Sharing is not supported on this device/simulator');
    return;
  }

  try {
    // Use cacheDirectory if available, otherwise fallback
    const fs = FileSystem as any;
    const directory = fs.cacheDirectory || fs.documentDirectory;
    if (!directory) {
      throw new Error('No valid file system directory found');
    }
    
    const fileUri = `${directory}${filename}`;
    // Use string 'utf8' if enum is missing from types, or cast
    await FileSystem.writeAsStringAsync(fileUri, content, { encoding: 'utf8' });
    await Sharing.shareAsync(fileUri, { mimeType, UTI: mimeType });
  } catch (error) {
    console.error('Failed to share file:', error);
    Alert.alert('Share Failed', 'Could not share the file.');
  }
}
