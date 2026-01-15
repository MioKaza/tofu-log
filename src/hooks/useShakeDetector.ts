import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

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

    let subscription: ReturnType<typeof Accelerometer.addListener> | null =
      null;

    const startListening = async () => {
      try {
        const isAvailable = await Accelerometer.isAvailableAsync();
        if (!isAvailable) {
          console.warn('[TofuLog] Accelerometer not available on this device');
          return;
        }

        Accelerometer.setUpdateInterval(100);

        subscription = Accelerometer.addListener((data) => {
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
