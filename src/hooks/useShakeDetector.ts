import { useEffect, useRef } from 'react';

// Use a type-only import for Accelerometer types
import type { Accelerometer } from 'expo-sensors';

let AccelerometerModule: typeof Accelerometer | null = null;
try {
  // Use require for the runtime implementation
  AccelerometerModule = require('expo-sensors').Accelerometer;
} catch (e) {
  console.warn('[TofuLog] expo-sensors not available, shake detection disabled');
  AccelerometerModule = null;
}

// Ensure the type is used to satisfy TS
export type { Accelerometer };

const SHAKE_THRESHOLD = 1.5;
const SHAKE_TIMEOUT = 1000;

interface UseShakeDetectorOptions {
  enabled?: boolean;
  onShake: () => void;
  threshold?: number;
}

export function useShakeDetector({
  enabled = true,
  onShake,
  threshold = SHAKE_THRESHOLD,
}: UseShakeDetectorOptions) {
  const lastShakeTime = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let subscription: any = null;

    const startListening = async () => {
      if (!AccelerometerModule) {
        console.warn('[TofuLog] Accelerometer not available');
        return;
      }
      try {
        const isAvailable = await AccelerometerModule.isAvailableAsync();
        if (!isAvailable) {
          console.warn('[TofuLog] Accelerometer not available on this device');
          return;
        }

        AccelerometerModule.setUpdateInterval(100);

        subscription = AccelerometerModule.addListener((data: { x: number; y: number; z: number }) => {
          const { x, y, z } = data;
          const acceleration = Math.sqrt(x * x + y * y + z * z);

          if (acceleration > threshold) {
            const now = Date.now();
            if (now - lastShakeTime.current > SHAKE_TIMEOUT) {
              lastShakeTime.current = now;
              onShake();
            }
          }
        });
      } catch (error) {
        console.warn('[TofuLog] Failed to initialize shake detector:', error);
      }
    };

    startListening();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [enabled, onShake, threshold]);
}
