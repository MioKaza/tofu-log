import { useState, useEffect } from 'react';
import type { DeviceInfo } from '../types';

// Lazy load expo-device to avoid native module errors
let Device: any = null;
try {
  Device = require('expo-device');
} catch (e) {
  console.warn('[TofuLog] expo-device not available');
}

export function useDeviceInfo(): DeviceInfo | null {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    if (!Device) {
      console.warn('[TofuLog] Device info not available');
      return;
    }

    async function gatherDeviceInfo() {
      try {
        const info: DeviceInfo = {
          brand: Device.brand || undefined,
          modelName: Device.modelName || undefined,
          osName: Device.osName || undefined,
          osVersion: Device.osVersion || undefined,
          deviceType: getDeviceTypeName(Device.deviceType),
          totalMemory: Device.totalMemory || undefined,
        };
        setDeviceInfo(info);
      } catch (error) {
        console.warn('[TofuLog] Failed to gather device info:', error);
      }
    }

    gatherDeviceInfo();
  }, []);

  return deviceInfo;
}

function getDeviceTypeName(type: number | null): string | undefined {
  if (type === null || !Device) return undefined;

  // DeviceType enum values: UNKNOWN=0, PHONE=1, TABLET=2, DESKTOP=3, TV=4
  switch (type) {
    case 1: // PHONE
      return 'Phone';
    case 2: // TABLET
      return 'Tablet';
    case 3: // DESKTOP
      return 'Desktop';
    case 4: // TV
      return 'TV';
    default:
      return 'Unknown';
  }
}
