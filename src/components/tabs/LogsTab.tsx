import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDevOverlay } from '../../context/DevOverlayContext';
import type { LogLevel, LogEntry } from '../../types';

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  log: '#a0a0a0',
  info: '#60a5fa',
  warn: '#fbbf24',
  error: '#f87171',
  debug: '#a78bfa',
};

const LOG_LEVEL_LABELS: Record<LogLevel, string> = {
  log: 'LOG',
  info: 'INFO',
  warn: 'WARN',
  error: 'ERR',
  debug: 'DBG',
};

type FilterLevel = LogLevel | 'all';

export function LogsTab() {
  const { logs, clearLogs } = useDevOverlay();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterLevel>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesFilter =
        activeFilter === 'all' || log.level === activeFilter;
      const matchesSearch =
        searchQuery === '' ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [logs, activeFilter, searchQuery]);

  const logCounts = useMemo(() => {
    const counts: Record<FilterLevel, number> = {
      all: logs.length,
      log: 0,
      info: 0,
      warn: 0,
      error: 0,
      debug: 0,
    };
    logs.forEach((log) => {
      counts[log.level]++;
    });
    return counts;
  }, [logs]);

  const renderLogItem = ({ item }: { item: LogEntry }) => {
    const time = new Date(item.timestamp).toLocaleTimeString();
    const color = LOG_LEVEL_COLORS[item.level];

    return (
      <View style={styles.logItem}>
        <View style={styles.logHeader}>
          <View style={[styles.levelBadge, { backgroundColor: color }]}>
            <Text style={styles.levelText}>{LOG_LEVEL_LABELS[item.level]}</Text>
          </View>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={5}>
          {item.message}
        </Text>
      </View>
    );
  };

  const filterButtons: FilterLevel[] = ['all', 'log', 'info', 'warn', 'error', 'debug'];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search logs..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.clearButton} onPress={clearLogs}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filterButtons.map((level) => {
          const isActive = activeFilter === level;
          const count = logCounts[level];
          const color = level === 'all' ? '#888' : LOG_LEVEL_COLORS[level];

          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterButton,
                isActive && styles.filterButtonActive,
                isActive && { borderColor: color },
              ]}
              onPress={() => setActiveFilter(level)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isActive && { color },
                ]}
              >
                {level.toUpperCase()} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filteredLogs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {logs.length === 0
              ? 'No logs captured yet'
              : 'No logs match your filter'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredLogs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#16162a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  filterContainer: {
    maxHeight: 40,
    marginBottom: 12,
  },
  filterContent: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#16162a',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#1a1a3a',
  },
  filterButtonText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  logItem: {
    backgroundColor: '#16162a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  timestamp: {
    color: '#666',
    fontSize: 11,
  },
  message: {
    color: '#e0e0e0',
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});
