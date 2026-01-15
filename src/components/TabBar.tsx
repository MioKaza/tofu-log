import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { TabName } from '../types';
import { LogsIcon, NetworkIcon, CrashesIcon, DeviceIcon } from './Icons';

interface Tab {
  key: TabName;
  label: string;
  Icon: React.ElementType;
}

const TABS: Tab[] = [
  { key: 'logs', label: 'Logs', Icon: LogsIcon },
  { key: 'network', label: 'Network', Icon: NetworkIcon },
  { key: 'crashes', label: 'Crashes', Icon: CrashesIcon },
  { key: 'device', label: 'Device', Icon: DeviceIcon },
];

interface TabBarProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <tab.Icon
              color={isActive ? '#e8e8e8' : '#8888aa'}
              size={18}
              strokeWidth={isActive ? 2 : 1.5}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0d0d12', // Dark gray, almost black
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1f',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  activeTab: {
    borderBottomColor: '#6366f1',
  },
  label: {
    fontSize: 11,
    color: '#8888aa',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  activeLabel: {
    color: '#e8e8e8', // Off-white instead of pure white
    fontWeight: '600',
  },
});
