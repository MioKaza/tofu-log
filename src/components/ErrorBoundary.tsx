import React, { Component, ErrorInfo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import type { CrashReport } from '../types';
import { generateId } from '../utils/generateId';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (report: CrashReport) => void;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  componentStack: string | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      componentStack: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const componentStack = errorInfo.componentStack || null;

    this.setState({ componentStack });

    if (this.props.onError) {
      const report: CrashReport = {
        id: generateId(),
        error,
        componentStack: componentStack || undefined,
        timestamp: Date.now(),
      };
      this.props.onError(report);
    }
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      componentStack: null,
    });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.icon}>💥</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.errorName}>
              {this.state.error?.name || 'Error'}
            </Text>
            <Text style={styles.errorMessage}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>

            {this.state.componentStack && (
              <ScrollView style={styles.stackContainer}>
                <Text style={styles.stackTitle}>Component Stack:</Text>
                <Text style={styles.stackTrace}>
                  {this.state.componentStack}
                </Text>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  errorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f87171',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 16,
  },
  stackContainer: {
    maxHeight: 200,
    backgroundColor: '#16162a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  stackTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 11,
    color: '#a0a0a0',
    fontFamily: 'monospace',
  },
  retryButton: {
    backgroundColor: '#4ade80',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
