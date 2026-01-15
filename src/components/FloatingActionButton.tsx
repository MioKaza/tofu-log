import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SaturnIcon } from './SaturnIcon';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FAB_SIZE = 56;

interface FloatingActionButtonProps {
  onPress: () => void;
  initialPosition?: { x: number; y: number };
}

export function FloatingActionButton({
  onPress,
  initialPosition = { x: SCREEN_WIDTH - FAB_SIZE - 20, y: SCREEN_HEIGHT - 200 },
}: FloatingActionButtonProps) {
  const pan = useRef(
    new Animated.ValueXY({ x: initialPosition.x, y: initialPosition.y })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as unknown as { _value: number })._value,
          y: (pan.y as unknown as { _value: number })._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        const finalX = Math.max(
          0,
          Math.min(SCREEN_WIDTH - FAB_SIZE, gestureState.moveX - FAB_SIZE / 2)
        );
        const finalY = Math.max(
          50,
          Math.min(
            SCREEN_HEIGHT - FAB_SIZE - 50,
            gestureState.moveY - FAB_SIZE / 2
          )
        );

        Animated.spring(pan, {
          toValue: { x: finalX, y: finalY },
          useNativeDriver: false,
          friction: 5,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <SaturnIcon size={FAB_SIZE} color="#e8e8e8" backgroundColor="#3DB6B1" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  button: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
