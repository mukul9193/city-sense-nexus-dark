
import { Camera, ModuleCardData } from './types';
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
  { name: 'Surveillance', status: 'Operational', metric: '345 Detections', icon: Shield, color: "text-accentBlue" },
  { name: 'Vehicle Intel', status: 'Operational', metric: '1,289 Plates Read', icon: Car, color: "text-accentPurple" },
  { name: 'Camera Mgmt', status: 'Warning', metric: '1 Camera Offline', icon: Video, color: "text-accentYellow" },
  { name: 'Image Analysis', status: 'Operational', metric: '78 Analyses Ran', icon: Image, color: "text-accentBlue" },
  { name: 'Profiling', status: 'Operational', metric: '5,890 Profiles', icon: UsersRound, color: "text-accentPurple" },
  { name: 'Model Mgmt', status: 'Operational', metric: 'BERT v2 Active', icon: BrainCircuit, color: "text-accentYellow" },
];

export const systemUptimeData = [
  { name: 'Online', value: 99.8, fill: '#3A86FF' },
  { name: 'Maintenance', value: 0.2, fill: '#FFBE0B' },
  { name: 'Offline', value: 0, fill: '#FF006E'}
];

export const alertsData = [
  { name: '00:00', alerts: 5 },
  { name: '02:00', alerts: 8 },
  { name: '04:00', alerts: 3 },
  { name: '06:00', alerts: 12 },
  { name: '08:00', alerts: 15 },
  { name: '10:00', alerts: 9 },
  { name: '12:00', alerts: 20 },
];
