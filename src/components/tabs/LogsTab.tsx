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
import { TrashIcon } from '../Icons';
import { Terminal } from 'lucide-react-native';
import { copyToClipboard, formatLogForClipboard } from '../../utils/clipboard';
import { pushLogToTerminal } from '../../interceptors/consoleInterceptor';
import { KAOMOJI, BADGE } from '../../vibe/theme';

// Terminal-style colors matching Vibe Logger theme
const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  log: '#3DB6B1',     // Teal (Cyber-Y2K)
  info: '#06D6A0',    // Bright cyan
  warn: '#FFD60A',    // Bright yellow
  error: '#FF006E',   // Bright red/pink
  debug: '#9D4EDD',   // Purple
};

// Terminal-style labels with kaomojis
const LOG_LEVEL_LABELS: Record<LogLevel, string> = {
  log: `${BADGE.log} LOG`,
  info: `${BADGE.info} INFO`,
  warn: `${BADGE.warn} WARN`,
  error: `${BADGE.error} ERROR`,
  debug: `${BADGE.debug} DEBUG`,
};

const LOG_LEVEL_KAOMOJI: Record<LogLevel, string> = {
  log: KAOMOJI.log,
  info: KAOMOJI.info,
  warn: KAOMOJI.warn,
  error: KAOMOJI.error,
  debug: KAOMOJI.debug,
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

  const handleCopyLog = async (log: LogEntry) => {
    const text = formatLogForClipboard(log);
    await copyToClipboard(text);
  };

  const handlePushToTerminal = (log: LogEntry) => {
    pushLogToTerminal(log);
  };

  const renderLogItem = ({ item }: { item: LogEntry }) => {
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const color = LOG_LEVEL_COLORS[item.level];
    const kaomoji = LOG_LEVEL_KAOMOJI[item.level];

    // Format data if present
    let dataPreview = '';
    if (item.data && item.data.length > 0) {
      try {
        const dataStr = item.data.map(d => 
          typeof d === 'string' ? d : JSON.stringify(d)
        ).join(' ');
        if (dataStr.length > 100) {
          dataPreview = dataStr.substring(0, 100) + '...';
        } else {
          dataPreview = dataStr;
        }
      } catch {
        dataPreview = '[Complex Data]';
      }
    }

    return (
      <View style={styles.logItem}>
        <TouchableOpacity 
          style={styles.logContent}
          onLongPress={() => handleCopyLog(item)}
          delayLongPress={500}
          activeOpacity={0.7}
        >
          <View style={styles.terminalLine}>
            <Text style={[styles.levelBadge, { color, borderColor: color }]}>
              {LOG_LEVEL_LABELS[item.level]}
            </Text>
            <Text style={styles.timestamp}>{time}</Text>
            <Text style={styles.kaomoji}>{kaomoji}</Text>
          </View>
          <Text style={styles.message}>
            {item.message}
          </Text>
          {dataPreview ? (
            <Text style={styles.dataPreview}>
              {dataPreview}
            </Text>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.pushButton}
          onPress={() => handlePushToTerminal(item)}
          activeOpacity={0.7}
        >
          <Terminal size={14} color="#3DB6B1" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    );
  };

  const filterButtons: FilterLevel[] = [
    'all',
    'log',
    'info',
    'warn',
    'error',
    'debug',
  ];

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
          <TrashIcon color="#9ca3af" size={20} />
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
          const color = level === 'all' ? '#9ca3af' : LOG_LEVEL_COLORS[level];

          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterButton,
                isActive && styles.filterButtonActive,
                isActive && { borderColor: color, backgroundColor: color + '20' },
              ]}
              onPress={() => setActiveFilter(level)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  isActive && { color, fontWeight: '600' },
                ]}
              >
                {level.toUpperCase()}
                <Text style={{ opacity: 0.7 }}> {count}</Text>
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
    paddingHorizontal: 16,
    backgroundColor: '#12121a', // Matches bottom sheet background
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 8,
    gap: 8,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#0d0d12',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e8e8e8', // Off-white
    fontSize: 13,
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: '#3DB6B1',
  },
  clearButton: {
    padding: 10,
    backgroundColor: '#0d0d12',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3DB6B1',
  },
  filterContainer: {
    maxHeight: 40,
    marginBottom: 12,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#0d0d12',
    borderWidth: 1,
    borderColor: '#333',
  },
  filterButtonActive: {
    // Background handled dynamically
  },
  filterButtonText: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#0d0d12',
    marginBottom: 4,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#3DB6B1',
    gap: 8,
  },
  logContent: {
    flex: 1,
  },
  pushButton: {
    padding: 8,
    backgroundColor: 'rgba(61, 182, 177, 0.1)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3DB6B1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  terminalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  levelBadge: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontFamily: 'monospace',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(61, 182, 177, 0.1)',
  },
  timestamp: {
    color: '#666',
    fontSize: 10,
    fontFamily: 'monospace',
    flex: 1,
  },
  kaomoji: {
    fontSize: 12,
    color: '#3DB6B1',
  },
  message: {
    color: '#e8e8e8', // Off-white for better readability
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
    marginBottom: 4,
  },
  dataPreview: {
    color: '#888',
    fontSize: 11,
    fontFamily: 'monospace',
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#666',
    fontSize: 13,
    fontFamily: 'monospace',
  },
});
