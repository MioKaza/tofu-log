import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SaturnIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function SaturnIcon({ 
  size = 56, 
  color = '#e8e8e8',
  backgroundColor = '#3DB6B1'
}: SaturnIconProps) {
  return (
    <View style={[
      styles.container,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
      }
    ]}>
      <MaterialCommunityIcons 
        name="circle" 
        size={size * 0.6} 
        color={color} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
