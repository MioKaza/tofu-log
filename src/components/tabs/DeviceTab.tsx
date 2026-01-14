import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { useDeviceInfo } from '../../hooks/useDeviceInfo';

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

  const appInfo = {
    name: Constants.expoConfig?.name,
    version: Constants.expoConfig?.version,
    sdkVersion: Constants.expoConfig?.sdkVersion,
    bundleId: Constants.expoConfig?.ios?.bundleIdentifier || Constants.expoConfig?.android?.package,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 Device</Text>
        <View style={styles.card}>
          <InfoRow label="Brand" value={deviceInfo?.brand} />
          <InfoRow label="Model" value={deviceInfo?.modelName} />
          <InfoRow label="Type" value={deviceInfo?.deviceType} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ System</Text>
        <View style={styles.card}>
          <InfoRow label="OS" value={deviceInfo?.osName} />
          <InfoRow label="Version" value={deviceInfo?.osVersion} />
          <InfoRow label="Memory" value={formatBytes(deviceInfo?.totalMemory)} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 App</Text>
        <View style={styles.card}>
          <InfoRow label="Name" value={appInfo.name} />
          <InfoRow label="Version" value={appInfo.version} />
          <InfoRow label="SDK Version" value={appInfo.sdkVersion} />
          <InfoRow label="Bundle ID" value={appInfo.bundleId} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Runtime</Text>
        <View style={styles.card}>
          <InfoRow label="Debug Mode" value={__DEV__ ? 'Yes' : 'No'} />
          <InfoRow label="Hermes" value={typeof HermesInternal !== 'undefined' ? 'Enabled' : 'Disabled'} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#16162a',
    borderRadius: 12,
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f3a',
  },
  label: {
    color: '#888',
    fontSize: 14,
  },
  value: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: '500',
  },
});
