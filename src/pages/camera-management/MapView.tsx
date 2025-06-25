
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cameras, recentDetections } from "@/lib/placeholder-data";
import { MapPin, Video, Eye, AlertTriangle, Activity, X } from "lucide-react";
import { Camera, DetectionEvent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MapView = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  // Filter events for selected camera
  const getCameraEvents = (cameraId: string): DetectionEvent[] => {
    return recentDetections.filter(event => event.cameraId === cameraId);
  };

  // Get chart data for camera events
  const getCameraChartData = (events: DetectionEvent[]) => {
    const eventsByType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(eventsByType).map(([type, count]) => ({
      type,
      count
    }));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'FRS':
        return <Eye className="h-4 w-4" />;
      case 'BorderJumping':
        return <AlertTriangle className="h-4 w-4" />;
      case 'VehicleIdentify':
        return <Activity className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Camera Map View</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Section */}
        <div className={cn(
          "transition-all duration-300",
          selectedCamera ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Camera Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 opacity-50" />
                
                {/* Camera Markers */}
                {cameras.map((camera) => (
                  <div
                    key={camera.id}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                    style={{
                      left: `${camera.coordinates?.x || Math.random() * 80 + 10}%`,
                      top: `${camera.coordinates?.y || Math.random() * 80 + 10}%`,
                    }}
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <div className={cn(
                      "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 group-hover:scale-110",
                      camera.status === 'Online' ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600',
                      selectedCamera?.id === camera.id && 'scale-125 ring-4 ring-blue-300'
                    )}>
                      <Video className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Camera Name Tooltip */}
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {camera.name}
                    </div>
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                  <h4 className="text-sm font-medium mb-2">Camera Status</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Online</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Offline</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Camera Details Panel */}
        {selectedCamera && (
          <div className="lg:col-span-1">
            <Card className="h-[600px] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">{selectedCamera.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCamera(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 overflow-y-auto h-full pb-20">
                {/* Camera Live View */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Live View</h4>
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                    <div className="text-white text-sm">
                      {selectedCamera.status === 'Online' ? 'Live Feed Active' : 'Camera Offline'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedCamera.status === 'Online' ? 'default' : 'destructive'}>
                      {selectedCamera.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{selectedCamera.location}</span>
                  </div>
                </div>

                {/* Recent Events */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Recent Events</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {getCameraEvents(selectedCamera.id).slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-start gap-2 p-2 rounded border text-xs">
                        <div className={cn(
                          event.severity === 'High' && 'text-red-500',
                          event.severity === 'Medium' && 'text-yellow-500',
                          event.severity === 'Low' && 'text-blue-500'
                        )}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1">
                            <Badge variant={getSeverityVariant(event.severity)} className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-xs">{event.description}</p>
                          <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics Chart */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Event Analytics</h4>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getCameraChartData(getCameraEvents(selectedCamera.id))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
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
