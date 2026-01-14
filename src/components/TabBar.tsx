import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { TabName } from '../types';

interface Tab {
  key: TabName;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { key: 'logs', label: 'Logs', icon: '📋' },
  { key: 'network', label: 'Network', icon: '🌐' },
  { key: 'crashes', label: 'Crashes', icon: '💥' },
  { key: 'device', label: 'Device', icon: '📱' },
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
            <Text style={styles.icon}>{tab.icon}</Text>
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
    backgroundColor: '#16162a',
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2d2d4a',
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    color: '#8888aa',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#ffffff',
  },
});
