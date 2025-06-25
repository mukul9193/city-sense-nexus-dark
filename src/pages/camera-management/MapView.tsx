
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cameras, recentDetections } from "@/lib/placeholder-data";
import { MapPin, Camera, Plus, Filter, Eye, Activity, TrendingUp, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MapView = () => {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredCameras = cameras.filter(camera => {
    if (filter === 'all') return true;
    if (filter === 'online') return camera.status === 'Online';
    if (filter === 'offline') return camera.status === 'Offline' || camera.status === 'Warning';
    return true;
  });

  // Mock map coordinates for cameras
  const cameraPositions = [
    { id: 'CAM001', x: 25, y: 30, zone: 'Main Entrance' },
    { id: 'CAM002', x: 75, y: 25, zone: 'Parking Lot' },
    { id: 'CAM003', x: 45, y: 60, zone: 'Corridor A' },
    { id: 'CAM004', x: 85, y: 70, zone: 'Emergency Exit' },
    { id: 'CAM005', x: 15, y: 80, zone: 'Reception Area' },
    { id: 'CAM006', x: 65, y: 45, zone: 'Conference Room' },
  ];

  const getCameraByPosition = (positionId: string) => {
    return cameras.find(cam => cam.id === positionId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'bg-green-500';
      case 'Offline': return 'bg-red-500';
      case 'Warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Mock data for selected camera events and analytics
  const getCameraEvents = (cameraId: string) => {
    return recentDetections.filter(detection => detection.camera === cameraId).slice(0, 5);
  };

  const getCameraAnalytics = (cameraId: string) => {
    // Mock hourly detection data
    return [
      { time: '00:00', detections: 5 },
      { time: '04:00', detections: 2 },
      { time: '08:00', detections: 15 },
      { time: '12:00', detections: 12 },
      { time: '16:00', detections: 18 },
      { time: '20:00', detections: 8 },
    ];
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Camera Map View</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Camera
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Facility Layout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                {/* Mock facility layout */}
                <div className="absolute inset-4 bg-white rounded shadow-sm">
                  {/* Building outline */}
                  <div className="absolute inset-4 border-2 border-gray-400 rounded">
                    {/* Rooms */}
                    <div className="absolute top-4 left-4 w-16 h-12 border border-gray-300 rounded">
                      <div className="text-xs p-1 text-center">Reception</div>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-12 border border-gray-300 rounded">
                      <div className="text-xs p-1 text-center">Conference</div>
                    </div>
                    <div className="absolute bottom-4 left-4 w-24 h-16 border border-gray-300 rounded">
                      <div className="text-xs p-1 text-center">Parking</div>
                    </div>
                    <div className="absolute bottom-4 right-4 w-16 h-10 border border-gray-300 rounded">
                      <div className="text-xs p-1 text-center">Exit</div>
                    </div>
                  </div>
                </div>

                {/* Camera positions */}
                {cameraPositions.map((position) => {
                  const camera = getCameraByPosition(position.id);
                  if (!camera) return null;

                  return (
                    <div
                      key={position.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                        selectedCamera === camera.id ? 'z-20' : 'z-10'
                      }`}
                      style={{ left: `${position.x}%`, top: `${position.y}%` }}
                      onClick={() => setSelectedCamera(selectedCamera === camera.id ? null : camera.id)}
                    >
                      {/* Camera icon */}
                      <div className={`w-6 h-6 rounded-full ${getStatusColor(camera.status)} flex items-center justify-center shadow-lg border-2 border-white ${
                        selectedCamera === camera.id ? 'scale-125' : 'hover:scale-110'
                      } transition-transform`}>
                        <Camera className="h-3 w-3 text-white" />
                      </div>
                      
                      {/* Camera label */}
                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {camera.name}
                      </div>

                      {/* Selection indicator */}
                      {selectedCamera === camera.id && (
                        <div className="absolute -inset-2 border-2 border-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Map Legend */}
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Warning</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Camera Info Panel */}
        <div className="space-y-4">
          {selectedCamera ? (
            (() => {
              const camera = cameras.find(c => c.id === selectedCamera);
              if (!camera) return null;
              
              const cameraEvents = getCameraEvents(selectedCamera);
              const analyticsData = getCameraAnalytics(selectedCamera);

              return (
                <>
                  {/* Camera Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        {camera.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Status:</span>
                          <Badge variant={camera.status === 'Online' ? 'default' : 'destructive'}>
                            {camera.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Location:</span>
                          <span className="text-sm text-muted-foreground">{camera.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Last Seen:</span>
                          <span className="text-sm text-muted-foreground">{camera.lastSeen}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Live View */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Live View
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-3">
                        <img 
                          src="/placeholder.svg" 
                          alt="Live Camera Feed" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="destructive" className="bg-red-500 animate-pulse">
                            ● LIVE
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-3 w-3 mr-2" />
                          Full Screen View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Recent Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {cameraEvents.length > 0 ? (
                          cameraEvents.map((event, index) => (
                            <div key={index} className="flex items-start gap-3 p-2 bg-muted/50 rounded-lg">
                              <div className={`w-2 h-2 rounded-full mt-2 ${
                                event.severity === 'High' ? 'bg-red-500' : 
                                event.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{event.type}</p>
                                <p className="text-xs text-muted-foreground">{event.time}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No recent events</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analytics Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Detection Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={analyticsData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="detections" stroke="#8884d8" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-xs text-muted-foreground">Detections in last 24 hours</p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              );
            })()
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Camera Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Click on a camera icon to view detailed information, live feed, and analytics
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Cameras:</span>
                <span className="font-medium">{cameras.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Online:</span>
                <span className="font-medium text-green-600">
                  {cameras.filter(c => c.status === 'Online').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Offline:</span>
                <span className="font-medium text-red-600">
                  {cameras.filter(c => c.status === 'Offline').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Warning:</span>
                <span className="font-medium text-yellow-600">
                  {cameras.filter(c => c.status === 'Warning').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapView;
