
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Play, BarChart3, X } from "lucide-react";

// Mock camera data with coordinates
const mockCameras = [
  { id: '1', name: 'Main Entrance', location: 'Building A', status: 'Online' as const, lastSeen: '2 min ago', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: '2', name: 'Parking Lot', location: 'Building B', status: 'Online' as const, lastSeen: '1 min ago', coordinates: { lat: 40.7130, lng: -74.0058 } },
  { id: '3', name: 'Side Exit', location: 'Building C', status: 'Offline' as const, lastSeen: '5 min ago', coordinates: { lat: 40.7126, lng: -74.0062 } },
  { id: '4', name: 'Roof Camera', location: 'Building A', status: 'Warning' as const, lastSeen: '3 min ago', coordinates: { lat: 40.7132, lng: -74.0056 } },
];

const mockEvents = [
  { id: '1', type: 'Face Detection', timestamp: '2 min ago', severity: 'Medium' },
  { id: '2', type: 'Motion Alert', timestamp: '5 min ago', severity: 'Low' },
  { id: '3', type: 'Border Crossing', timestamp: '8 min ago', severity: 'High' },
];

const MapView = () => {
  const [selectedCamera, setSelectedCamera] = useState<typeof mockCameras[0] | null>(null);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Camera Map View</h1>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Section */}
        <div className={selectedCamera ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Camera Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Map" 
                  className="w-full h-full object-cover"
                />
                
                {/* Camera Markers */}
                {mockCameras.map((camera) => (
                  <button
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                    style={{
                      left: `${((camera.coordinates.lng + 74.0060) / 0.0006) * 100}%`,
                      top: `${((40.7132 - camera.coordinates.lat) / 0.0006) * 100}%`
                    }}
                  >
                    <div className="relative">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(camera.status)} border-2 border-white shadow-lg`} />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                        {camera.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Camera Details Panel */}
        {selectedCamera && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Camera className="h-5 w-5" />
                    {selectedCamera.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCamera(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={selectedCamera.status === 'Online' ? 'default' : 'destructive'}>
                    {selectedCamera.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last seen: {selectedCamera.lastSeen}
                  </span>
                </div>
                
                {/* Live View */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    <span className="font-medium">Live View</span>
                  </div>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <img 
                      src="/placeholder.svg" 
                      alt="Live Feed" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Recent Events */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Recent Events</span>
                  </div>
                  <div className="space-y-2">
                    {mockEvents.map((event) => (
                      <div key={event.id} className="p-2 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{event.type}</span>
                          <Badge variant={getSeverityVariant(event.severity)}>
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
