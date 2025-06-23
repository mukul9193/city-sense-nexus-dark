
import { LucideIcon } from "lucide-react";

export type Camera = {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline' | 'Warning';
  lastSeen: string;
};

export type ModuleCardData = {
  name: string;
  status: 'Operational' | 'Warning' | 'Offline';
  metric: string;
  icon: LucideIcon;
  color: string;
  activeAlarms: number;
  liveAlarms: number;
};

export type DetectionEvent = {
  id: string;
  type: 'FRS' | 'BorderJumping' | 'VehicleIdentify';
  timestamp: string;
  location: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  cameraId: string;
};
