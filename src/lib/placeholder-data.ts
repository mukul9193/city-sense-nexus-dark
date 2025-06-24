import { Camera, ModuleCardData, DetectionEvent, FaceRecognitionEvent } from './types';
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

export const faceRecognitionEvents: FaceRecognitionEvent[] = [
  {
    id: 'FR-001',
    personId: 'P-001',
    name: 'John Doe',
    confidence: 95,
    timestamp: '2025-06-15 10:25:00',
    location: 'Downtown Square Cam',
    photoUrl: '/placeholder.svg',
    status: 'Watchlist'
  },
  {
    id: 'FR-002',
    personId: 'P-002',
    name: 'Unknown Person',
    confidence: 87,
    timestamp: '2025-06-15 10:20:00',
    location: 'Central Park Entrance',
    photoUrl: '/placeholder.svg',
    status: 'Unknown'
  },
  {
    id: 'FR-003',
    personId: 'P-003',
    name: 'Jane Smith',
    confidence: 92,
    timestamp: '2025-06-15 10:15:00',
    location: 'Metro Station Platform 2',
    photoUrl: '/placeholder.svg',
    status: 'Authorized'
  },
  {
    id: 'FR-004',
    personId: 'P-004',
    name: 'Mike Johnson',
    confidence: 88,
    timestamp: '2025-06-15 09:45:00',
    location: 'City Hall Entrance',
    photoUrl: '/placeholder.svg',
    status: 'Authorized'
  },
  {
    id: 'FR-005',
    personId: 'P-005',
    name: 'Sarah Wilson',
    confidence: 93,
    timestamp: '2025-06-15 09:30:00',
    location: 'Port Authority Gate 1',
    photoUrl: '/placeholder.svg',
    status: 'Watchlist'
  }
];

export const faceRecognitionStats = [
  { month: 'Jan', detections: 1200, matches: 45 },
  { month: 'Feb', detections: 1400, matches: 52 },
  { month: 'Mar', detections: 1100, matches: 38 },
  { month: 'Apr', detections: 1600, matches: 61 },
  { month: 'May', detections: 1800, matches: 73 },
  { month: 'Jun', detections: 2100, matches: 89 }
];

export const faceRecognitionStatusData = [
  { name: 'Authorized', value: 65, fill: '#22c55e' },
  { name: 'Unknown', value: 25, fill: '#eab308' },
  { name: 'Watchlist', value: 10, fill: '#ef4444' }
];

export const dailyDetectionTrends = [
  { time: '00:00', detections: 12 },
  { time: '04:00', detections: 8 },
  { time: '08:00', detections: 45 },
  { time: '12:00', detections: 67 },
  { time: '16:00', detections: 89 },
  { time: '20:00', detections: 56 },
  { time: '23:59', detections: 23 }
];

export const alertsData = [
  { time: '00:00', alerts: 2 },
  { time: '04:00', alerts: 1 },
  { time: '08:00', alerts: 5 },
  { time: '12:00', alerts: 3 },
  { time: '16:00', alerts: 7 },
  { time: '20:00', alerts: 4 },
  { time: '23:59', alerts: 2 }
];

export const systemUptimeData = [
  { name: 'Online', value: 92, fill: '#22c55e' },
  { name: 'Maintenance', value: 5, fill: '#eab308' },
  { name: 'Offline', value: 3, fill: '#ef4444' }
];
