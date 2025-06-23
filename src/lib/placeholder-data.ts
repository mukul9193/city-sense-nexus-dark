
import { Camera, ModuleCardData, DetectionEvent } from './types';
import { Video, Shield, Car, CaseSensitive, UserCircle, Bot, Users, Settings, MapPin, Image, BrainCircuit, UsersRound } from 'lucide-react';

export const cameras: Camera[] = [
  { id: 'CAM-001', name: 'Downtown Square Cam', location: '123 Main St', status: 'Online', lastSeen: '2025-06-15 10:30:00' },
  { id: 'CAM-002', name: 'Central Park Entrance', location: '456 Oak Ave', status: 'Online', lastSeen: '2025-06-15 10:30:00' },
  { id: 'CAM-003', name: 'City Hall Rooftop', location: '789 Pine Ln', status: 'Offline', lastSeen: '2025-06-14 22:15:00' },
  { id: 'CAM-004', name: 'Highway 101 Overpass', location: 'Mile 42, H-101', status: 'Online', lastSeen: '2025-06-15 10:30:00' },
  { id: 'CAM-005', name: 'Metro Station Platform 2', location: 'Central Station', status: 'Online', lastSeen: '2025-06-15 10:30:00' },
  { id: 'CAM-006', name: 'Port Authority Gate 3', location: 'SeaPort Blvd', status: 'Warning', lastSeen: '2025-06-15 10:28:00' },
];

export const moduleSummary: ModuleCardData[] = [
  { name: 'Surveillance', status: 'Operational', metric: '345 Detections', icon: Shield, color: "text-accentBlue", activeAlarms: 2, liveAlarms: 1 },
  { name: 'Vehicle Intel', status: 'Operational', metric: '1,289 Plates Read', icon: Car, color: "text-accentPurple", activeAlarms: 0, liveAlarms: 0 },
  { name: 'Camera Mgmt', status: 'Warning', metric: '1 Camera Offline', icon: Video, color: "text-accentYellow", activeAlarms: 1, liveAlarms: 2 },
  { name: 'Image Analysis', status: 'Operational', metric: '78 Analyses Ran', icon: Image, color: "text-accentBlue", activeAlarms: 0, liveAlarms: 0 },
  { name: 'Profiling', status: 'Operational', metric: '5,890 Profiles', icon: UsersRound, color: "text-accentPurple", activeAlarms: 1, liveAlarms: 1 },
  { name: 'Model Mgmt', status: 'Operational', metric: 'BERT v2 Active', icon: BrainCircuit, color: "text-accentYellow", activeAlarms: 0, liveAlarms: 0 },
];

export const recentDetections: DetectionEvent[] = [
  { 
    id: 'DET-001', 
    type: 'FRS', 
    timestamp: '2025-06-15 10:25:00', 
    location: 'Downtown Square Cam', 
    description: 'Unknown person detected', 
    severity: 'Medium',
    cameraId: 'CAM-001'
  },
  { 
    id: 'DET-002', 
    type: 'BorderJumping', 
    timestamp: '2025-06-15 10:20:00', 
    location: 'Central Park Entrance', 
    description: 'Unauthorized boundary crossing', 
    severity: 'High',
    cameraId: 'CAM-002'
  },
  { 
    id: 'DET-003', 
    type: 'VehicleIdentify', 
    timestamp: '2025-06-15 10:15:00', 
    location: 'Highway 101 Overpass', 
    description: 'License plate ABC-123 detected', 
    severity: 'Low',
    cameraId: 'CAM-004'
  },
  { 
    id: 'DET-004', 
    type: 'FRS', 
    timestamp: '2025-06-15 10:10:00', 
    location: 'Metro Station Platform 2', 
    description: 'Suspect profile match: John Doe', 
    severity: 'High',
    cameraId: 'CAM-005'
  },
  { 
    id: 'DET-005', 
    type: 'BorderJumping', 
    timestamp: '2025-06-15 10:05:00', 
    location: 'Port Authority Gate 3', 
    description: 'Perimeter breach detected', 
    severity: 'Medium',
    cameraId: 'CAM-006'
  }
];
