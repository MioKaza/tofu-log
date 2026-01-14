import { useState, useEffect } from 'react';
import * as Device from 'expo-device';
import type { DeviceInfo } from '../types';

export function useDeviceInfo(): DeviceInfo | null {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
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

function getDeviceTypeName(type: Device.DeviceType | null): string | undefined {
  if (type === null) return undefined;

  switch (type) {
    case Device.DeviceType.PHONE:
      return 'Phone';
    case Device.DeviceType.TABLET:
      return 'Tablet';
    case Device.DeviceType.DESKTOP:
      return 'Desktop';
    case Device.DeviceType.TV:
      return 'TV';
    default:
      return 'Unknown';
  }
}
