import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useDevOverlay } from '../../context/DevOverlayContext';
import type { CrashReport } from '../../types';

interface CrashDetailsModalProps {
  crash: CrashReport | null;
  visible: boolean;
  onClose: () => void;
}

function CrashDetailsModal({ crash, visible, onClose }: CrashDetailsModalProps) {
  if (!crash) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Crash Report</Text>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Text style={modalStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={modalStyles.content}>
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Error</Text>
              <View style={modalStyles.errorBox}>
                <Text style={modalStyles.errorName}>{crash.error.name}</Text>
                <Text style={modalStyles.errorMessage}>{crash.error.message}</Text>
              </View>
            </View>

            {crash.error.stack && (
              <View style={modalStyles.section}>
                <Text style={modalStyles.sectionTitle}>Stack Trace</Text>
                <View style={modalStyles.codeBlock}>
                  <Text style={modalStyles.code}>{crash.error.stack}</Text>
                </View>
              </View>
            )}

            {crash.componentStack && (
              <View style={modalStyles.section}>
                <Text style={modalStyles.sectionTitle}>Component Stack</Text>
                <View style={modalStyles.codeBlock}>
                  <Text style={modalStyles.code}>{crash.componentStack}</Text>
                </View>
              </View>
            )}

            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Timestamp</Text>
              <Text style={modalStyles.timestamp}>
                {new Date(crash.timestamp).toLocaleString()}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function CrashesTab() {
  const { crashReports, clearCrashReports } = useDevOverlay();
  const [selectedCrash, setSelectedCrash] = useState<CrashReport | null>(null);

  const renderCrashItem = ({ item }: { item: CrashReport }) => {
    const time = new Date(item.timestamp).toLocaleTimeString();

    return (
      <TouchableOpacity
        style={styles.crashItem}
        onPress={() => setSelectedCrash(item)}
        activeOpacity={0.7}
      >
        <View style={styles.crashHeader}>
          <View style={styles.errorBadge}>
            <Text style={styles.badgeText}>💥</Text>
          </View>
          <Text style={styles.errorName}>{item.error.name}</Text>
          <Text style={styles.timestamp}>{time}</Text>
        </View>
        <Text style={styles.errorMessage} numberOfLines={2}>
          {item.error.message}
        </Text>
        {item.error.stack && (
          <Text style={styles.stackPreview} numberOfLines={2}>
            {item.error.stack.split('\n').slice(1, 3).join('\n')}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.count}>
          {crashReports.length} crash{crashReports.length !== 1 ? 'es' : ''}
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearCrashReports}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {crashReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✨</Text>
          <Text style={styles.emptyText}>No crashes recorded</Text>
          <Text style={styles.emptySubtext}>Your app is running smoothly!</Text>
        </View>
      ) : (
        <FlatList
          data={crashReports}
          renderItem={renderCrashItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}

      <CrashDetailsModal
        crash={selectedCrash}
        visible={selectedCrash !== null}
        onClose={() => setSelectedCrash(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  count: {
    color: '#888',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  crashItem: {
    backgroundColor: '#16162a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f87171',
  },
  crashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  errorBadge: {
    marginRight: 8,
  },
  badgeText: {
    fontSize: 16,
  },
  errorName: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    color: '#666',
    fontSize: 11,
  },
  errorMessage: {
    color: '#e0e0e0',
    fontSize: 13,
    marginBottom: 6,
  },
  stackPreview: {
    color: '#666',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
});

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: '#888',
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorBox: {
    backgroundColor: '#2d1f1f',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f87171',
  },
  errorName: {
    color: '#f87171',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  errorMessage: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  codeBlock: {
    backgroundColor: '#16162a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2d2d4a',
  },
  code: {
    color: '#a0a0a0',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  timestamp: {
    color: '#e0e0e0',
    fontSize: 14,
  },
});
