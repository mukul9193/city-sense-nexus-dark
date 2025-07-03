
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, Play, BarChart3, Expand, Activity, Shield, Eye, Users, SquareX } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock camera data with enhanced details
const mockCameras = [
  { 
    id: '1', 
    name: 'Main Entrance', 
    location: 'Building A', 
    status: 'Online' as const, 
    lastSeen: '2 min ago', 
    coordinates: { lat: 40.7128, lng: -74.0060 },
    analytics: ['FRS', 'Object Detection', 'IN/OUT Count'],
    health: 98,
    heartbeat: '2024-01-20 14:30:15'
  },
  { 
    id: '2', 
    name: 'Parking Lot', 
    location: 'Building B', 
    status: 'Online' as const, 
    lastSeen: '1 min ago', 
    coordinates: { lat: 40.7130, lng: -74.0058 },
    analytics: ['Object Detection', 'Border Jumping'],
    health: 95,
    heartbeat: '2024-01-20 14:31:22'
  },
  { 
    id: '3', 
    name: 'Side Exit', 
    location: 'Building C', 
    status: 'Offline' as const, 
    lastSeen: '5 min ago', 
    coordinates: { lat: 40.7126, lng: -74.0062 },
    analytics: ['FRS', 'IN/OUT Count'],
    health: 0,
    heartbeat: '2024-01-20 14:25:43'
  },
  { 
    id: '4', 
    name: 'Roof Camera', 
    location: 'Building A', 
    status: 'Warning' as const, 
    lastSeen: '3 min ago', 
    coordinates: { lat: 40.7132, lng: -74.0056 },
    analytics: ['Border Jumping', 'Object Detection'],
    health: 75,
    heartbeat: '2024-01-20 14:28:11'
  },
];

const mockEvents = [
  { id: '1', type: 'Face Detection', timestamp: '2 min ago', severity: 'Medium', camera: 'Main Entrance', image: '/placeholder.svg' },
  { id: '2', type: 'Border Jump Detected', timestamp: '5 min ago', severity: 'High', camera: 'Roof Camera', image: '/placeholder.svg' },
  { id: '3', type: 'Object Detected', timestamp: '8 min ago', severity: 'Low', camera: 'Parking Lot', image: '/placeholder.svg' },
];

const mockChartData = [
  { time: '14:20', events: 4 },
  { time: '14:25', events: 7 },
  { time: '14:30', events: 5 },
  { time: '14:35', events: 9 },
  { time: '14:40', events: 6 },
];

const MapView = () => {
  const [selectedCamera, setSelectedCamera] = useState<typeof mockCameras[0] | null>(null);
  const [selectedFeed, setSelectedFeed] = useState("raw");
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'bg-green-500';
      case 'Warning': return 'bg-yellow-500';
      case 'Offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
      default: return 'default';
    }
  };

  const getAnalyticIcon = (analytic: string) => {
    switch (analytic) {
      case 'FRS': return Shield;
      case 'Object Detection': return Eye;
      case 'Border Jumping': return Activity;
      case 'IN/OUT Count': return Users;
      default: return Camera;
    }
  };

  // Auto-rotate events every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % mockEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentEvent = mockEvents[currentEventIndex];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Camera Analytics Dashboard</h1>
      
      {/* Main Layout: 60% Map + 40% Analytics Grid */}
      <div className="flex gap-6 h-[800px]">
        {/* Left Panel - Interactive Map (60%) */}
        <div className="w-3/5">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Live Camera Map
                {selectedCamera && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedCamera.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-full p-4">
              <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
                {/* Heatmap overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-yellow-500/10 to-green-500/5 rounded-lg"></div>
                
                <img 
                  src="/placeholder.svg" 
                  alt="Interactive Map" 
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Camera Markers with Enhanced Design */}
                {mockCameras.map((camera) => (
                  <button
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-all duration-200 ${
                      selectedCamera?.id === camera.id ? 'scale-150 z-10' : ''
                    }`}
                    style={{
                      left: `${((camera.coordinates.lng + 74.0060) / 0.0006) * 100}%`,
                      top: `${((40.7132 - camera.coordinates.lat) / 0.0006) * 100}%`
                    }}
                  >
                    <div className="relative">
                      <div className={`w-5 h-5 rounded-full ${getStatusColor(camera.status)} border-3 border-white shadow-xl pulse-animation`}>
                        <Camera className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      {camera.status === 'Online' && (
                        <div className={`absolute inset-0 w-5 h-5 rounded-full ${getStatusColor(camera.status)} opacity-30 animate-ping`}></div>
                      )}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded-md opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        <div className="font-medium">{camera.name}</div>
                        <div className="text-xs text-gray-300">{camera.status}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - 2x2 Analytics Grid (40%) */}
        <div className="w-2/5 grid grid-cols-2 gap-4 h-full">
          {/* 1st Grid - Camera Details & Analytics */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Camera Details
                </span>
                <Button variant="ghost" size="sm">
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3">
              {selectedCamera ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{selectedCamera.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedCamera.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedCamera.status === 'Online' ? 'default' : 'destructive'}>
                      {selectedCamera.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Health: {selectedCamera.health}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium">Analytics Enabled:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedCamera.analytics.map((analytic) => {
                        const Icon = getAnalyticIcon(analytic);
                        return (
                          <Badge key={analytic} variant="secondary" className="text-xs flex items-center gap-1">
                            <Icon className="h-3 w-3" />
                            {analytic}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last heartbeat: {selectedCamera.heartbeat}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a camera to view details</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2nd Grid - Live Feed Viewer */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Live Feed
                </span>
                <Button variant="ghost" size="sm">
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3">
              {selectedCamera && selectedCamera.status === 'Online' ? (
                <div className="space-y-2">
                  <Select value={selectedFeed} onValueChange={setSelectedFeed}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="raw">Raw Feed</SelectItem>
                      <SelectItem value="frs">FRS Processed</SelectItem>
                      <SelectItem value="object">Object Detection</SelectItem>
                      <SelectItem value="custom">Custom View</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Live Feed" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      ● LIVE
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {selectedCamera ? 'Camera Offline' : 'No Camera Selected'}
                    </p>
                    <p className="text-xs">No Data Available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3rd Grid - Live Events Graph */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Live Event Trends
                </span>
                <Button variant="ghost" size="sm">
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3">
              <div className="h-full">
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="events" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">FRS</Badge>
                  <Badge variant="outline" className="text-xs">Objects</Badge>
                  <Badge variant="outline" className="text-xs">Border</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4th Grid - Latest Event Feed */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Latest Event
                </span>
                <Button variant="ghost" size="sm">
                  <Expand className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-3">
              <div className="space-y-3">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={currentEvent.image} 
                    alt="Event Snapshot" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={getSeverityVariant(currentEvent.severity)} className="text-xs">
                      {currentEvent.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {currentEvent.timestamp}
                    </span>
                  </div>
                  
                  <div className="text-xs">
                    <p className="font-medium">{currentEvent.camera}</p>
                    <p className="text-muted-foreground">Auto-refreshing...</p>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full text-xs h-7">
                    View All Events
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;
