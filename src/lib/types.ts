import { LucideIcon } from "lucide-react";

export type Camera = {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline' | 'Warning';
  lastSeen: string;
  ip: string;
  port: number;
  resolution: string;
  fps: number;
  lat?: number;
  lng?: number;
  username?: string;
  password?: string;
  rtspUrl?: string;
  onvifPort?: number;
  isPtz?: boolean;
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

export type FaceRecognitionEvent = {
  id: string;
  personId: string;
  name: string;
  confidence: number;
  timestamp: string;
  location: string;
  photoUrl: string;
  status: 'Watchlist' | 'Unknown' | 'Authorized';
};

export type ObjectDetectionEvent = {
  id: string;
  objectType: string;
  confidence: number;
  timestamp: string;
  location: string;
  description: string;
  status: 'Normal' | 'Suspicious' | 'Alert';
};

export type BorderJumpingEvent = {
  id: string;
  severity: 'Low' | 'Medium' | 'High';
  timestamp: string;
  location: string;
  description: string;
  zone: string;
  confidence: number;
};

export type ANPREvent = {
  id: string;
  plateNumber: string;
  vehicleType: string;
  confidence: number;
  timestamp: string;
  location: string;
  status: 'Normal' | 'Watchlist' | 'Unknown';
};
