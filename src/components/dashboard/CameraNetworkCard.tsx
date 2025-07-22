
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cameras } from "@/lib/placeholder-data";
import { Video, Camera, CameraOff, Eye, Users, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Camera as CameraType } from "@/lib/types";
import CameraDetailsDialog from "./CameraDetailsDialog";

const CameraNetworkCard = () => {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeCameras = cameras.filter(cam => cam.status === 'Online');
  const inactiveCameras = cameras.filter(cam => cam.status === 'Offline' || cam.status === 'Warning');

  const handleCameraClick = (camera: CameraType) => {
    setSelectedCamera(camera);
    setDialogOpen(true);
  };

  const handleEdit = (camera: CameraType) => {
    console.log('Edit camera:', camera);
    setDialogOpen(false);
    // TODO: Implement edit functionality
  };

  const handleDelete = (camera: CameraType) => {
    console.log('Delete camera:', camera);
    setDialogOpen(false);
    // TODO: Implement delete functionality
  };

  const getOfflineReason = (camera: CameraType) => {
    const reasons = [
      "Network connection timeout",
      "Authentication failed", 
      "Power supply disconnected",
      "Camera hardware failure",
      "RTSP stream unavailable"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getLastActiveTime = (camera: CameraType) => {
    const times = ["2 hours ago", "5 hours ago", "1 day ago", "3 days ago", "1 week ago"];
    return times[Math.floor(Math.random() * times.length)];
  };

  return (
    <>
      <Card className="col-span-full md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Camera Network</CardTitle>
          <Video className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">{cameras.length} Total</div>
          
          {/* Camera Status Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="cursor-pointer transition-colors">
                    <Badge 
                      variant="default" 
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      {activeCameras.length} Online
                    </Badge>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium text-green-600">Active Cameras ({activeCameras.length})</h4>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {activeCameras.map((camera) => (
                        <div 
                          key={camera.id}
                          className="p-2 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => handleCameraClick(camera)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{camera.name}</p>
                              <p className="text-xs text-muted-foreground">{camera.location}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="default" className="bg-green-500 text-xs">
                                Live
                              </Badge>
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            Resolution: {camera.resolution} • FPS: {camera.fps}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {activeCameras.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-4">
                        No active cameras found
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-center justify-between">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="cursor-pointer transition-colors">
                    <Badge 
                      variant="destructive"
                      className="hover:bg-destructive/90"
                    >
                      <CameraOff className="h-3 w-3 mr-1" />
                      {inactiveCameras.length} Offline
                    </Badge>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CameraOff className="h-4 w-4 text-red-500" />
                      <h4 className="font-medium text-red-600">Offline Cameras ({inactiveCameras.length})</h4>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {inactiveCameras.map((camera) => (
                        <div 
                          key={camera.id}
                          className="p-2 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
                          onClick={() => handleCameraClick(camera)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{camera.name}</p>
                              <p className="text-xs text-muted-foreground">{camera.location}</p>
                            </div>
                            <Badge 
                              variant={camera.status === 'Warning' ? 'secondary' : 'destructive'} 
                              className="text-xs"
                            >
                              {camera.status}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-1 text-xs text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Reason: {getOfflineReason(camera)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Last active: {getLastActiveTime(camera)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {inactiveCameras.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-4">
                        All cameras are online
                      </p>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera Details Dialog */}
      <CameraDetailsDialog
        camera={selectedCamera}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
};

export default CameraNetworkCard;
