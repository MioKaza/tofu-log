import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useDeviceInfo } from '../../hooks/useDeviceInfo';

// Lazy load expo-constants to avoid native module errors
let Constants: any = null;
try {
  Constants = require('expo-constants').default;
} catch (e) {
  console.warn('[TofuLog] expo-constants not available');
}

interface InfoRowProps {
  label: string;
  value: string | number | undefined;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? 'N/A'}</Text>
    </View>
  );
}

function formatBytes(bytes: number | undefined): string {
  if (!bytes) return 'N/A';
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(2)} GB`;
}

export function DeviceTab() {
  const deviceInfo = useDeviceInfo();

  const appInfo = Constants ? {
    name: Constants.expoConfig?.name,
    version: Constants.expoConfig?.version,
    sdkVersion: Constants.expoConfig?.sdkVersion,
    bundleId:
      Constants.expoConfig?.ios?.bundleIdentifier ||
      Constants.expoConfig?.android?.package,
  } : {
    name: undefined,
    version: undefined,
    sdkVersion: undefined,
    bundleId: undefined,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DEVICE</Text>
        <View style={styles.card}>
          <InfoRow label="Brand" value={deviceInfo?.brand} />
          <InfoRow label="Model" value={deviceInfo?.modelName} />
          <InfoRow label="Type" value={deviceInfo?.deviceType} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SYSTEM</Text>
        <View style={styles.card}>
          <InfoRow label="OS" value={deviceInfo?.osName} />
          <InfoRow label="Version" value={deviceInfo?.osVersion} />
          <InfoRow
            label="Memory"
            value={formatBytes(deviceInfo?.totalMemory)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APP</Text>
        <View style={styles.card}>
          <InfoRow label="Name" value={appInfo.name} />
          <InfoRow label="Version" value={appInfo.version} />
          <InfoRow label="SDK Version" value={appInfo.sdkVersion} />
          <InfoRow label="Bundle ID" value={appInfo.bundleId} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RUNTIME</Text>
        <View style={styles.card}>
          <InfoRow label="Debug Mode" value={__DEV__ ? 'Yes' : 'No'} />
          <InfoRow
            label="Hermes"
            value={
              typeof HermesInternal !== 'undefined' ? 'Enabled' : 'Disabled'
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 20,
    paddingTop: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#16162a',
    borderRadius: 8,
    padding: 0,
    borderWidth: 1,
    borderColor: '#1f1f2e',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f2e',
  },
  label: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
  },
});
