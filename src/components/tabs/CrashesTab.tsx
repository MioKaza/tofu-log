import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useDevOverlay } from '../../context/DevOverlayContext';
import type { CrashReport } from '../../types';
import { TrashIcon, CloseIcon, CrashesIcon, ShareIcon, CopyIcon } from '../Icons';
import { formatCrashForAI, copyToClipboard, shareFile } from '../../utils/clipboard';

interface CrashDetailsModalProps {
  crash: CrashReport | null;
  visible: boolean;
  onClose: () => void;
}

function CrashDetailsModal({
  crash,
  visible,
  onClose,
}: CrashDetailsModalProps) {
  if (!crash) return null;

  const handleCopyForAI = async () => {
    const text = formatCrashForAI(crash);
    await copyToClipboard(text);
    Alert.alert('Copied', 'Crash report formatted for AI and copied to clipboard.');
  };

  const handleShareReport = async () => {
    const text = formatCrashForAI(crash);
    await shareFile(`crash-report-${crash.timestamp}.txt`, text);
  };

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
            <View style={modalStyles.actions}>
              <TouchableOpacity onPress={handleCopyForAI} style={modalStyles.actionButton}>
                <CopyIcon color="#cad3f5" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShareReport} style={modalStyles.actionButton}>
                <ShareIcon color="#cad3f5" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                <CloseIcon color="#cad3f5" size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={modalStyles.content}>
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Error</Text>
              <View style={modalStyles.errorBox}>
                <Text style={modalStyles.errorName}>{crash.error.name}</Text>
                <Text style={modalStyles.errorMessage}>
                  {crash.error.message}
                </Text>
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
            <CrashesIcon color="#ef4444" size={20} />
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
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearCrashReports}
        >
          <TrashIcon color="#9ca3af" size={20} />
        </TouchableOpacity>
      </View>

      {crashReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <CrashesIcon color="#10b981" size={48} />
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
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  count: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '500',
  },
  clearButton: {
    padding: 6,
    backgroundColor: '#1f1f2e',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  crashItem: {
    backgroundColor: '#16162a', // Keeping card bg slightly distinct
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
  errorName: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  timestamp: {
    color: '#6b7280',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  errorMessage: {
    color: '#e5e7eb',
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  stackPreview: {
    color: '#9ca3af',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptySubtext: {
    color: '#6b7280',
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
    backgroundColor: '#111111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
  content: {
    flex: 1,
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
  errorBox: {
    backgroundColor: '#2d1f1f',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f87171',
  },
  errorName: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  errorMessage: {
    color: '#e5e7eb',
    fontSize: 14,
    lineHeight: 20,
  },
  codeBlock: {
    backgroundColor: '#1f1f2e',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  code: {
    color: '#d1d5db',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  timestamp: {
    color: '#e5e7eb',
    fontSize: 14,
  },
});
