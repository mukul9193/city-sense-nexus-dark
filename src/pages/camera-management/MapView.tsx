
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cameras } from "@/lib/placeholder-data";
import { MapPin, Camera, Settings, Plus, Edit } from "lucide-react";
import { useState } from "react";
import { Camera as CameraType } from "@/lib/types";
import CameraEditDialog from "@/components/dashboard/CameraEditDialog";
import AnalyticsEditDialog from "@/components/camera-management/AnalyticsEditDialog";

const MapView = () => {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  const regions = ["all", "entrance", "parking", "warehouse", "office"];
  
  const filteredCameras = selectedRegion === "all" 
    ? cameras 
    : cameras.filter(camera => camera.location.toLowerCase().includes(selectedRegion));

  const getStatusColor = (status: 'Online' | 'Offline' | 'Warning') => {
    switch (status) {
      case 'Online':
        return 'bg-green-500';
      case 'Offline':
        return 'bg-red-500';
      case 'Warning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleEditCamera = (camera: CameraType) => {
    setSelectedCamera(camera);
    setEditDialogOpen(true);
  };

  const handleEditAnalytics = (camera: CameraType) => {
    setSelectedCamera(camera);
    setAnalyticsDialogOpen(true);
  };

  const handleSaveCamera = (updatedCamera: CameraType) => {
    console.log('Save camera:', updatedCamera);
    setEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Camera Map View</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="entrance">Entrance</SelectItem>
              <SelectItem value="parking">Parking</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
              <SelectItem value="office">Office</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="secondary">
            {filteredCameras.length} Cameras
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Site Layout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-[500px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                {/* Simple site layout background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                  {/* Building outline */}
                  <div className="absolute top-10 left-10 w-80 h-60 border-4 border-gray-400 bg-white/50 rounded-lg">
                    <div className="p-2 text-sm font-medium text-gray-600">Main Building</div>
                  </div>
                  
                  {/* Parking area */}
                  <div className="absolute top-10 right-10 w-40 h-60 border-4 border-gray-400 bg-gray-200/50 rounded-lg">
                    <div className="p-2 text-sm font-medium text-gray-600">Parking</div>
                  </div>
                  
                  {/* Entrance area */}
                  <div className="absolute bottom-10 left-10 w-80 h-20 border-4 border-gray-400 bg-yellow-100/50 rounded-lg">
                    <div className="p-2 text-sm font-medium text-gray-600">Entrance Gate</div>
                  </div>
                </div>

                {/* Camera markers */}
                {filteredCameras.map((camera, index) => {
                  const positions = [
                    { x: 15, y: 15 }, // Entrance 1
                    { x: 85, y: 15 }, // Parking 1
                    { x: 15, y: 50 }, // Main Building 1
                    { x: 50, y: 30 }, // Main Building 2
                    { x: 85, y: 50 }, // Parking 2
                    { x: 50, y: 85 }, // Gate
                  ];
                  
                  const position = positions[index] || { x: 50, y: 50 };
                  
                  return (
                    <div
                      key={camera.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`
                      }}
                      onClick={() => setSelectedCamera(camera)}
                    >
                      {/* Camera icon with status */}
                      <div className={`relative ${getStatusColor(camera.status)} rounded-full p-2 shadow-lg border-2 border-white`}>
                        <Camera className="h-4 w-4 text-white" />
                        
                        {/* Pulse animation for online cameras */}
                        {camera.status === 'Online' && (
                          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                        )}
                      </div>
                      
                      {/* Camera info tooltip */}
                      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        <div className="font-medium">{camera.name}</div>
                        <div className="text-gray-300">{camera.location}</div>
                        <div className={`text-${camera.status === 'Online' ? 'green' : 'red'}-300`}>
                          {camera.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Camera Details Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCamera ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{selectedCamera.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedCamera.location}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={selectedCamera.status === 'Online' ? 'default' : 'destructive'}
                    >
                      {selectedCamera.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedCamera.ip}:{selectedCamera.port}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolution:</span>
                      <span>{selectedCamera.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">FPS:</span>
                      <span>{selectedCamera.fps}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span>{selectedCamera.lastSeen}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-4">
                    <Button 
                      onClick={() => handleEditCamera(selectedCamera)}
                      size="sm"
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Edit Camera Settings
                    </Button>
                    
                    <Button 
                      onClick={() => handleEditAnalytics(selectedCamera)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Configure Analytics
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Click on a camera marker to view details
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Camera List */}
          <Card>
            <CardHeader>
              <CardTitle>All Cameras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredCameras.map((camera) => (
                  <div
                    key={camera.id}
                    className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedCamera?.id === camera.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedCamera(camera)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(camera.status)}`} />
                      <div>
                        <div className="font-medium text-sm">{camera.name}</div>
                        <div className="text-xs text-muted-foreground">{camera.location}</div>
                      </div>
                    </div>
                    <Badge 
                      variant={camera.status === 'Online' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {camera.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Camera Dialog */}
      <CameraEditDialog
        camera={selectedCamera}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveCamera}
      />

      {/* Analytics Edit Dialog */}
      <AnalyticsEditDialog
        camera={selectedCamera}
        open={analyticsDialogOpen}
        onOpenChange={setAnalyticsDialogOpen}
      />
    </div>
  );
};

export default MapView;
