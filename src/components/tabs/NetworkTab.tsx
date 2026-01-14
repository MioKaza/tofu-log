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
import type { NetworkRequest } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  pending: '#fbbf24',
  success: '#4ade80',
  error: '#f87171',
};

function getStatusColor(request: NetworkRequest): string {
  if (!request.status) return STATUS_COLORS.pending;
  if (request.status >= 200 && request.status < 300) return STATUS_COLORS.success;
  return STATUS_COLORS.error;
}

function formatDuration(ms?: number): string {
  if (!ms) return '...';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: '#60a5fa',
    POST: '#4ade80',
    PUT: '#fbbf24',
    PATCH: '#a78bfa',
    DELETE: '#f87171',
  };
  return colors[method] || '#888';
}

function formatJson(data: unknown): string {
  if (data === undefined || data === null) return 'null';
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

interface RequestDetailsModalProps {
  request: NetworkRequest | null;
  visible: boolean;
  onClose: () => void;
}

function RequestDetailsModal({ request, visible, onClose }: RequestDetailsModalProps) {
  const [activeSection, setActiveSection] = useState<'request' | 'response'>('response');

  if (!request) return null;

  const sections = ['request', 'response'] as const;

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
            <View style={modalStyles.headerInfo}>
              <Text style={[modalStyles.method, { color: getMethodColor(request.method) }]}>
                {request.method}
              </Text>
              <Text style={modalStyles.status}>
                {request.status || 'Pending'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
              <Text style={modalStyles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={modalStyles.url} numberOfLines={2}>
            {request.url}
          </Text>

          <View style={modalStyles.meta}>
            <Text style={modalStyles.metaText}>
              Duration: {formatDuration(request.duration)}
            </Text>
            <Text style={modalStyles.metaText}>
              {new Date(request.startTime).toLocaleTimeString()}
            </Text>
          </View>

          <View style={modalStyles.tabs}>
            {sections.map((section) => (
              <TouchableOpacity
                key={section}
                style={[
                  modalStyles.tab,
                  activeSection === section && modalStyles.tabActive,
                ]}
                onPress={() => setActiveSection(section)}
              >
                <Text
                  style={[
                    modalStyles.tabText,
                    activeSection === section && modalStyles.tabTextActive,
                  ]}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={modalStyles.content}>
            {activeSection === 'request' ? (
              <>
                <Text style={modalStyles.sectionTitle}>Headers</Text>
                <View style={modalStyles.codeBlock}>
                  <Text style={modalStyles.code}>
                    {formatJson(request.requestHeaders)}
                  </Text>
                </View>
                <Text style={modalStyles.sectionTitle}>Body</Text>
                <View style={modalStyles.codeBlock}>
                  <Text style={modalStyles.code}>
                    {formatJson(request.requestBody) || 'No body'}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text style={modalStyles.sectionTitle}>Headers</Text>
                <View style={modalStyles.codeBlock}>
                  <Text style={modalStyles.code}>
                    {formatJson(request.responseHeaders)}
                  </Text>
                </View>
                <Text style={modalStyles.sectionTitle}>Body</Text>
                <View style={modalStyles.codeBlock}>
                  <Text style={modalStyles.code}>
                    {formatJson(request.responseBody) || 'No body'}
                  </Text>
                </View>
                {request.error && (
                  <>
                    <Text style={modalStyles.sectionTitle}>Error</Text>
                    <View style={[modalStyles.codeBlock, { borderColor: '#f87171' }]}>
                      <Text style={[modalStyles.code, { color: '#f87171' }]}>
                        {request.error}
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function NetworkTab() {
  const { networkRequests, clearNetworkRequests } = useDevOverlay();
  const [selectedRequest, setSelectedRequest] = useState<NetworkRequest | null>(null);

  const renderRequestItem = ({ item }: { item: NetworkRequest }) => {
    const statusColor = getStatusColor(item);
    const urlPath = new URL(item.url).pathname;

    return (
      <TouchableOpacity
        style={styles.requestItem}
        onPress={() => setSelectedRequest(item)}
        activeOpacity={0.7}
      >
        <View style={styles.requestHeader}>
          <View style={[styles.methodBadge, { backgroundColor: getMethodColor(item.method) }]}>
            <Text style={styles.methodText}>{item.method}</Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusText}>
            {item.status || '...'}
          </Text>
          <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
        </View>
        <Text style={styles.url} numberOfLines={1}>
          {urlPath}
        </Text>
        <Text style={styles.fullUrl} numberOfLines={1}>
          {item.url}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.count}>
          {networkRequests.length} request{networkRequests.length !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearNetworkRequests}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {networkRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No network requests captured yet</Text>
        </View>
      ) : (
        <FlatList
          data={networkRequests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}

      <RequestDetailsModal
        request={selectedRequest}
        visible={selectedRequest !== null}
        onClose={() => setSelectedRequest(null)}
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
  requestItem: {
    backgroundColor: '#16162a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  methodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  methodText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    color: '#888',
    fontSize: 12,
    marginRight: 8,
  },
  duration: {
    color: '#666',
    fontSize: 11,
    marginLeft: 'auto',
  },
  url: {
    color: '#e0e0e0',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  fullUrl: {
    color: '#666',
    fontSize: 11,
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
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  method: {
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    color: '#888',
    fontSize: 14,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    color: '#888',
    fontSize: 18,
  },
  url: {
    color: '#e0e0e0',
    fontSize: 13,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaText: {
    color: '#666',
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#16162a',
    borderRadius: 8,
    padding: 4,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: '#2d2d4a',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  codeBlock: {
    backgroundColor: '#16162a',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2d2d4a',
  },
  code: {
    color: '#e0e0e0',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
