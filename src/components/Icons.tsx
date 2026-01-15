import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface IconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export const LogsIcon = ({ color = '#cad3f5', size = 16 }: IconProps) => (
  <MaterialCommunityIcons name="text-box-outline" size={size} color={color} />
);

export const NetworkIcon = ({ color = '#cad3f5', size = 16 }: IconProps) => (
  <MaterialCommunityIcons name="web" size={size} color={color} />
);

export const CrashesIcon = ({ color = '#cad3f5', size = 16 }: IconProps) => (
  <MaterialCommunityIcons name="bug" size={size} color={color} />
);

export const DeviceIcon = ({ color = '#cad3f5', size = 16 }: IconProps) => (
  <MaterialCommunityIcons name="cellphone" size={size} color={color} />
);

export const CloseIcon = ({ color = '#cad3f5', size = 16 }: IconProps) => (
  <MaterialCommunityIcons name="close" size={size} color={color} />
);

export const TrashIcon = ({ color = '#cad3f5', size = 16 }: IconProps) => (
  <MaterialCommunityIcons name="delete-outline" size={size} color={color} />
);

export const LeafIcon = ({ color = '#cad3f5', size = 24 }: IconProps) => (
  <MaterialCommunityIcons name="leaf" size={size} color={color} />
);

export const CopyIcon = ({ color = '#cad3f5', size = 16 }: IconProps) => (
  <MaterialCommunityIcons name="content-copy" size={size} color={color} />
);

export const ShareIcon = ({ color = '#cad3f5', size = 16 }: IconProps) => (
  <MaterialCommunityIcons name="share-variant" size={size} color={color} />
);

