import React from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DevOverlay, TestBench } from 'tofu-log';

export default function App() {
  return (
    <DevOverlay>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>TofuLog Vibe Check 🧈</Text>
          <Text style={styles.subtitle}>Open your terminal to see the logs!</Text>
        </View>
        <TestBench />
        <StatusBar style="light" />
      </SafeAreaView>
    </DevOverlay>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F81CE5', // Magenta
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
});
