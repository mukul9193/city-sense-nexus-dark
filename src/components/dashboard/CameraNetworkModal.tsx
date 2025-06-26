
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cameras } from "@/lib/placeholder-data";
import { Camera, CameraOff, Edit, Eye, Wifi, WifiOff, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Camera as CameraType } from "@/lib/types";

interface CameraNetworkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditCamera?: (camera: CameraType) => void;
  onViewFrame?: (camera: CameraType) => void;
}

const CameraNetworkModal = ({ open, onOpenChange, onEditCamera, onViewFrame }: CameraNetworkModalProps) => {
  const onlineCameras = cameras.filter(cam => cam.status === 'Online');
  const offlineCameras = cameras.filter(cam => cam.status === 'Offline' || cam.status === 'Warning');

  const getOfflineReason = (camera: CameraType) => {
    // Mock offline reasons - in real app this would come from backend
    const reasons = [
      "Network connection lost",
      "Power supply disconnected", 
      "Camera hardware failure",
      "Authentication failed",
      "Firmware update required"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getLastSeen = (camera: CameraType) => {
    // Mock last seen times
    const times = ["2 minutes ago", "15 minutes ago", "1 hour ago", "3 hours ago", "1 day ago"];
    return times[Math.floor(Math.random() * times.length)];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Network Status
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Cameras</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cameras.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-green-600">Online</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{onlineCameras.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-600">Offline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{offlineCameras.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Online Cameras Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-green-600">Online Cameras ({onlineCameras.length})</h3>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              {onlineCameras.map((camera) => (
                <Card key={camera.id} className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Camera className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{camera.name}</span>
                          <Badge variant="default" className="bg-green-500 text-xs">
                            Online
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{camera.location}</p>
                        <div className="text-xs text-muted-foreground">
                          Resolution: {camera.resolution} | FPS: {camera.fps}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Live streaming
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewFrame?.(camera)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditCamera?.(camera)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Offline Cameras Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold text-red-600">Offline Cameras ({offlineCameras.length})</h3>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2">
              {offlineCameras.map((camera) => (
                <Card key={camera.id} className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CameraOff className={cn(
                            "h-4 w-4",
                            camera.status === 'Offline' ? "text-red-500" : "text-yellow-500"
                          )} />
                          <span className="font-medium">{camera.name}</span>
                          <Badge 
                            variant={camera.status === 'Offline' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {camera.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{camera.location}</p>
                        
                        {/* Offline Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-red-600">
                            <AlertTriangle className="h-3 w-3" />
                            <span className="font-medium">Issue:</span>
                            <span>{getOfflineReason(camera)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Last seen: {getLastSeen(camera)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            IP: {camera.ip} | Port: {camera.port}
                          </div>
                        </div>
                        
                        {/* Troubleshooting Steps */}
                        <div className="text-xs bg-red-50 p-2 rounded">
                          <div className="font-medium text-red-700 mb-1">Troubleshooting:</div>
                          <ul className="text-red-600 space-y-0.5">
                            <li>• Check network connection</li>
                            <li>• Verify power supply</li>
                            <li>• Test camera ping response</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewFrame?.(camera)}
                          disabled={camera.status === 'Offline'}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onEditCamera?.(camera)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraNetworkModal;
