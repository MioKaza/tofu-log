import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDevOverlay } from '../context/DevOverlayContext';
import { useShakeDetector } from '../hooks/useShakeDetector';
import { useConsoleInterceptor } from '../hooks/useConsoleInterceptor';
import { useNetworkInterceptor } from '../hooks/useNetworkInterceptor';
import { FloatingActionButton } from './FloatingActionButton';
import { BottomSheet } from './BottomSheet';
import { TabBar } from './TabBar';
import { LogsTab, NetworkTab, CrashesTab, DeviceTab } from './tabs';
import type { TabName } from '../types';

interface DevOverlayContainerProps {
  children: React.ReactNode;
}

export function DevOverlayContainer({ children }: DevOverlayContainerProps) {
  const { isVisible, toggle, hide, config, activeTab, setActiveTab } =
    useDevOverlay();

  const handleShake = useCallback(() => {
    toggle();
  }, [toggle]);

  useShakeDetector({
    enabled: config.shakeToOpen,
    onShake: handleShake,
  });

  useConsoleInterceptor();
  useNetworkInterceptor();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'logs':
        return <LogsTab />;
      case 'network':
        return <NetworkTab />;
      case 'crashes':
        return <CrashesTab />;
      case 'device':
        return <DeviceTab />;
      default:
        return <LogsTab />;
    }
  };

  return (
    <View style={styles.container}>
      {children}
      {config.showFab && <FloatingActionButton onPress={toggle} />}
      <BottomSheet visible={isVisible} onClose={hide}>
        <TabBar
          activeTab={activeTab}
          onTabChange={(tab: TabName) => setActiveTab(tab)}
        />
        <View style={styles.tabContent}>{renderTabContent()}</View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
