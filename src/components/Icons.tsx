import React from 'react';
import {
  ScrollText,
  Activity,
  Smartphone,
  X,
  Trash2,
  Leaf,
  Bug,
  Copy,
  Share,
} from 'lucide-react-native';

interface IconProps {
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export const LogsIcon = ({ color = '#cad3f5', size = 16, strokeWidth = 1.5 }: IconProps) => (
  <ScrollText color={color} size={size} strokeWidth={strokeWidth} />
);

export const NetworkIcon = ({ color = '#cad3f5', size = 16, strokeWidth = 1.5 }: IconProps) => (
  <Activity color={color} size={size} strokeWidth={strokeWidth} />
);

export const CrashesIcon = ({ color = '#cad3f5', size = 16, strokeWidth = 1.5 }: IconProps) => (
  <Bug color={color} size={size} strokeWidth={strokeWidth} />
);

export const DeviceIcon = ({ color = '#cad3f5', size = 16, strokeWidth = 1.5 }: IconProps) => (
  <Smartphone color={color} size={size} strokeWidth={strokeWidth} />
);

export const CloseIcon = ({ color = '#cad3f5', size = 16, strokeWidth = 1.5 }: IconProps) => (
  <X color={color} size={size} strokeWidth={strokeWidth} />
);

export const TrashIcon = ({ color = '#cad3f5', size = 16, strokeWidth = 1.5 }: IconProps) => (
  <Trash2 color={color} size={size} strokeWidth={strokeWidth} />
);

export const LeafIcon = ({ color = '#cad3f5', size = 24, strokeWidth = 1.5 }: IconProps) => (
  <Leaf color={color} size={size} strokeWidth={strokeWidth} />
);

export const CopyIcon = ({ color = '#cad3f5', size = 16, strokeWidth = 1.5 }: IconProps) => (
  <Copy color={color} size={size} strokeWidth={strokeWidth} />
);

export const ShareIcon = ({ color = '#cad3f5', size = 16, strokeWidth = 1.5 }: IconProps) => (
  <Share color={color} size={size} strokeWidth={strokeWidth} />
);

