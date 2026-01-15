/**
 * TofuLog Test Bench
 * A collection of buttons to trigger various log scenarios for testing.
 * This is the "Chaos Button" panel for developers.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { COLORS } from '../vibe/theme';

interface TestButton {
  label: string;
  color: string;
  onPress: () => void;
}

const TestBench: React.FC = () => {
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEST ACTIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  const triggerLog = () => {
    console.log('This is a standard log message', { user: 'test', id: 123 });
  };

  const triggerInfo = () => {
    console.info('ℹ️ Info: App initialized successfully');
  };

  const triggerDebug = () => {
    console.debug('Debug: Component rendered with props', {
      visible: true,
      count: 42,
    });
  };

  const triggerWarn = () => {
    console.warn('Warning: This action is deprecated and will be removed in v2.0');
  };

  const triggerNetworkWarn = () => {
    console.warn('Network request failed - check your connection');
  };

  const triggerError = () => {
    console.error('Error: Something went wrong!');
  };

  const triggerErrorWithStack = () => {
    try {
      throw new Error('Cannot read property "id" of undefined');
    } catch (e) {
      console.error(e);
    }
  };

  const triggerNetworkError = () => {
    console.error('Network request failed: Unable to connect to server');
  };

  const trigger401Error = () => {
    console.error('401 Unauthorized: Your session has expired');
  };

  const trigger500Error = () => {
    console.error('500 Internal Server Error: The server encountered an error');
  };

  const triggerTypeError = () => {
    try {
      const obj: any = null;
      obj.someMethod();
    } catch (e) {
      console.error(e);
    }
  };

  const triggerHooksError = () => {
    console.error('Invalid hook call. Hooks can only be called inside of the body of a function component.');
  };

  const triggerTooManyRenders = () => {
    console.error('Too many re-renders. React limits the number of renders to prevent an infinite loop.');
  };

  const triggerSpam = () => {
    for (let i = 0; i < 20; i++) {
      console.log(`Spam log #${i + 1}`, { iteration: i });
    }
  };

  const triggerHugeObject = () => {
    const hugeObject = {
      users: Array.from({ length: 10 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        settings: {
          theme: 'dark',
          notifications: true,
          language: 'en',
        },
      })),
      metadata: {
        timestamp: Date.now(),
        version: '1.0.0',
        environment: 'development',
      },
    };
    console.log('Huge object:', hugeObject);
  };

  const triggerMixedLogs = () => {
    console.log('Starting operation...');
    console.info('Fetching data from API');
    console.debug('Request payload:', { endpoint: '/api/users' });
    console.warn('API response was slow (2.5s)');
    console.log('Operation completed');
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // BUTTON DEFINITIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  const buttons: TestButton[] = [
    // Basic Logs
    { label: '📝 Log', color: COLORS.magenta, onPress: triggerLog },
    { label: 'ℹ️ Info', color: COLORS.cyan, onPress: triggerInfo },
    { label: '🔍 Debug', color: COLORS.gray, onPress: triggerDebug },

    // Warnings
    { label: '⚠️ Warning', color: COLORS.yellow, onPress: triggerWarn },
    { label: '📡 Network Warn', color: COLORS.yellow, onPress: triggerNetworkWarn },

    // Errors
    { label: '❌ Error', color: COLORS.red, onPress: triggerError },
    { label: '💥 Error + Stack', color: COLORS.red, onPress: triggerErrorWithStack },
    { label: '🌐 Network Error', color: COLORS.red, onPress: triggerNetworkError },
    { label: '🔐 401 Error', color: COLORS.red, onPress: trigger401Error },
    { label: '🔥 500 Error', color: COLORS.red, onPress: trigger500Error },
    { label: '🐛 TypeError', color: COLORS.red, onPress: triggerTypeError },
    { label: '🪝 Hooks Error', color: COLORS.red, onPress: triggerHooksError },
    { label: '♾️ Infinite Loop', color: COLORS.red, onPress: triggerTooManyRenders },

    // Stress Tests
    { label: '🔄 Spam 20 Logs', color: COLORS.green, onPress: triggerSpam },
    { label: '📦 Huge Object', color: COLORS.green, onPress: triggerHugeObject },
    { label: '🎭 Mixed Logs', color: COLORS.green, onPress: triggerMixedLogs },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🧪 Test Bench</Text>
      <Text style={styles.subtitle}>Trigger logs to test the Vibe Logger</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Logs</Text>
        <View style={styles.buttonRow}>
          {buttons.slice(0, 3).map((btn, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.button, { backgroundColor: btn.color }]}
              onPress={btn.onPress}
            >
              <Text style={styles.buttonText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Warnings</Text>
        <View style={styles.buttonRow}>
          {buttons.slice(3, 5).map((btn, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.button, { backgroundColor: btn.color }]}
              onPress={btn.onPress}
            >
              <Text style={[styles.buttonText, { color: '#000' }]}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Errors (Knowledge Base)</Text>
        <View style={styles.buttonGrid}>
          {buttons.slice(5, 13).map((btn, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.button, styles.gridButton, { backgroundColor: btn.color }]}
              onPress={btn.onPress}
            >
              <Text style={styles.buttonText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stress Tests</Text>
        <View style={styles.buttonRow}>
          {buttons.slice(13).map((btn, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.button, { backgroundColor: btn.color }]}
              onPress={btn.onPress}
            >
              <Text style={[styles.buttonText, { color: '#000' }]}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.magenta,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.cyan,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
  },
  gridButton: {
    width: '48%',
    minWidth: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default TestBench;
