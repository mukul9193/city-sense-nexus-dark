import { Camera, ModuleCardData, DetectionEvent, FaceRecognitionEvent, ObjectDetectionEvent, BorderJumpingEvent, ANPREvent } from './types';
import { Video, Shield, Car, CaseSensitive, UserCircle, Bot, Users, Settings, MapPin, Image, BrainCircuit, UsersRound } from 'lucide-react';

export const cameras: Camera[] = [
  { 
    id: 'CAM-001', 
    name: 'Downtown Square Cam', 
    location: '123 Main St', 
    status: 'Online', 
    lastSeen: '2025-06-15 10:30:00',
    ip: '192.168.1.101',
    port: 554,
    resolution: '1920x1080',
    fps: 30,
    lat: 40.7128,
    lng: -74.0060,
    isPtz: false
  },
  { 
    id: 'CAM-002', 
    name: 'Central Park Entrance', 
    location: '456 Oak Ave', 
    status: 'Online', 
    lastSeen: '2025-06-15 10:30:00',
    ip: '192.168.1.102',
    port: 554,
    resolution: '1920x1080',
    fps: 25,
    lat: 40.7829,
    lng: -73.9654,
    isPtz: true
  },
  { 
    id: 'CAM-003', 
    name: 'City Hall Rooftop', 
    location: '789 Pine Ln', 
    status: 'Offline', 
    lastSeen: '2025-06-14 22:15:00',
    ip: '192.168.1.103',
    port: 554,
    resolution: '1280x720',
    fps: 20,
    lat: 40.7282,
    lng: -74.0776,
    isPtz: false
  },
  { 
    id: 'CAM-004', 
    name: 'Highway 101 Overpass', 
    location: 'Mile 42, H-101', 
    status: 'Online', 
    lastSeen: '2025-06-15 10:30:00',
    ip: '192.168.1.104',
    port: 554,
    resolution: '1920x1080',
    fps: 30,
    lat: 40.6892,
    lng: -74.0445,
    isPtz: false
  },
  { 
    id: 'CAM-005', 
    name: 'Metro Station Platform 2', 
    location: 'Central Station', 
    status: 'Online', 
    lastSeen: '2025-06-15 10:30:00',
    ip: '192.168.1.105',
    port: 554,
    resolution: '1920x1080',
    fps: 25,
    lat: 40.7589,
    lng: -73.9851,
    isPtz: true
  },
  { 
    id: 'CAM-006', 
    name: 'Port Authority Gate 3', 
    location: 'SeaPort Blvd', 
    status: 'Warning', 
    lastSeen: '2025-06-15 10:28:00',
    ip: '192.168.1.106',
    port: 554,
    resolution: '1280x720',
    fps: 15,
    lat: 40.7484,
    lng: -73.9857,
    isPtz: false
  },
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

export const objectDetectionEvents: ObjectDetectionEvent[] = [
  {
    id: 'OD-001',
    objectType: 'Abandoned Bag',
    confidence: 87,
    timestamp: '2025-06-15 10:25:00',
    location: 'Central Station Platform 1',
    description: 'Unattended baggage detected',
    status: 'Alert'
  },
  {
    id: 'OD-002',
    objectType: 'Weapon',
    confidence: 92,
    timestamp: '2025-06-15 10:20:00',
    location: 'Security Checkpoint A',
    description: 'Potential weapon detected',
    status: 'Alert'
  },
  {
    id: 'OD-003',
    objectType: 'Person',
    confidence: 95,
    timestamp: '2025-06-15 10:15:00',
    location: 'Main Entrance',
    description: 'Person loitering detected',
    status: 'Suspicious'
  },
  {
    id: 'OD-004',
    objectType: 'Vehicle',
    confidence: 89,
    timestamp: '2025-06-15 10:10:00',
    location: 'Parking Area B',
    description: 'Unauthorized vehicle',
    status: 'Suspicious'
  }
];

export const borderJumpingEvents: BorderJumpingEvent[] = [
  {
    id: 'BJ-001',
    severity: 'High',
    timestamp: '2025-06-15 10:25:00',
    location: 'Perimeter Zone A',
    description: 'Multiple persons crossing restricted boundary',
    zone: 'Zone A-1',
    confidence: 94
  },
  {
    id: 'BJ-002',
    severity: 'Medium',
    timestamp: '2025-06-15 10:20:00',
    location: 'Perimeter Zone B',
    description: 'Single person boundary breach',
    zone: 'Zone B-3',
    confidence: 88
  },
  {
    id: 'BJ-003',
    severity: 'Low',
    timestamp: '2025-06-15 10:15:00',
    location: 'Perimeter Zone C',
    description: 'Possible false alarm - animal detected',
    zone: 'Zone C-2',
    confidence: 72
  }
];

export const anprEvents: ANPREvent[] = [
  {
    id: 'ANPR-001',
    plateNumber: 'ABC-1234',
    vehicleType: 'Sedan',
    confidence: 96,
    timestamp: '2025-06-15 10:25:00',
    location: 'Main Gate',
    status: 'Watchlist'
  },
  {
    id: 'ANPR-002',
    plateNumber: 'XYZ-5678',
    vehicleType: 'SUV',
    confidence: 91,
    timestamp: '2025-06-15 10:20:00',
    location: 'Highway 101 Checkpoint',
    status: 'Normal'
  },
  {
    id: 'ANPR-003',
    plateNumber: 'DEF-9101',
    vehicleType: 'Truck',
    confidence: 84,
    timestamp: '2025-06-15 10:15:00',
    location: 'Service Entrance',
    status: 'Unknown'
  }
];

export const objectDetectionStats = [
  { month: 'Jan', detections: 890, alerts: 23 },
  { month: 'Feb', detections: 1020, alerts: 31 },
  { month: 'Mar', detections: 780, alerts: 18 },
  { month: 'Apr', detections: 1150, alerts: 42 },
  { month: 'May', detections: 1320, alerts: 38 },
  { month: 'Jun', detections: 1480, alerts: 51 }
];

export const borderJumpingStats = [
  { month: 'Jan', incidents: 12, breaches: 8 },
  { month: 'Feb', incidents: 15, breaches: 11 },
  { month: 'Mar', incidents: 9, breaches: 6 },
  { month: 'Apr', incidents: 18, breaches: 14 },
  { month: 'May', incidents: 21, breaches: 16 },
  { month: 'Jun', incidents: 17, breaches: 13 }
];

export const anprStats = [
  { month: 'Jan', scans: 2100, matches: 145 },
  { month: 'Feb', scans: 2350, matches: 162 },
  { month: 'Mar', scans: 1980, matches: 128 },
  { month: 'Apr', scans: 2580, matches: 191 },
  { month: 'May', scans: 2720, matches: 203 },
  { month: 'Jun', scans: 2940, matches: 221 }
];
