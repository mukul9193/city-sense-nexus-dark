
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cameras } from "@/lib/placeholder-data";
import { Camera, CameraOff, Edit, Eye, Wifi, WifiOff, Clock, AlertTriangle, MapPin, Settings, Monitor, RotateCcw, FileText, Maximize, Calendar, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Camera as CameraType } from "@/lib/types";
import { useState } from "react";

interface CameraNetworkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditCamera?: (camera: CameraType) => void;
  onViewFrame?: (camera: CameraType) => void;
}

interface CameraDetailsModalProps {
  camera: CameraType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CameraDetailsModal = ({ camera, open, onOpenChange }: CameraDetailsModalProps) => {
  if (!camera) return null;

  const isOnline = camera.status === 'Online';
  
  const getOfflineReason = () => {
    const reasons = [
      "RTSP connection timeout",
      "Authentication failed", 
      "Network unreachable",
      "Camera hardware failure",
      "Power supply disconnected"
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Camera className="h-5 w-5 text-green-500" />
                Camera Active - {camera.name}
              </>
            ) : (
              <>
                <CameraOff className="h-5 w-5 text-red-500" />
                Camera Offline - {camera.name}
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Live Stream / Latest Frame */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {isOnline ? "Live Stream View" : "Latest Available Frame"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {isOnline ? "Live stream would appear here" : "Last captured frame would appear here"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Camera Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Camera ID:</span>
                  <p className="font-medium">{camera.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">IP Address:</span>
                  <p className="font-medium">{camera.ip}:{camera.port}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{camera.location}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Resolution:</span>
                  <p className="font-medium">{camera.resolution} @ {camera.fps}fps</p>
                </div>
                {!isOnline && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Last Active:</span>
                    <p className="font-medium">{camera.lastSeen}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Diagnostics for Offline Cameras */}
          {!isOnline && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Diagnostics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-red-600 font-medium">Detected Issue:</span>
                  <p className="text-sm text-red-700">{getOfflineReason()}</p>
                </div>
                <div>
                  <span className="text-sm text-red-600 font-medium">Admin Notes:</span>
                  <p className="text-sm text-gray-600 italic">No notes added</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Edit className="h-4 w-4 mr-2" />
              {isOnline ? "Edit Settings" : "Edit Info"}
            </Button>
            
            {isOnline ? (
              <>
                <Button variant="outline" size="sm" className="justify-start">
                  <Target className="h-4 w-4 mr-2" />
                  Configure Analytics
                </Button>
                
                {camera.isPtz && (
                  <Button variant="outline" size="sm" className="justify-start">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    PTZ Positions
                  </Button>
                )}
                
                <Button variant="outline" size="sm" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
                
                <Button variant="outline" size="sm" className="justify-start">
                  <Maximize className="h-4 w-4 mr-2" />
                  Fullscreen
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="justify-start">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
                
                <Button variant="outline" size="sm" className="justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Error Log
                </Button>
                
                <Button variant="outline" size="sm" className="justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Last Frame
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CameraNetworkModal = ({ open, onOpenChange, onEditCamera, onViewFrame }: CameraNetworkModalProps) => {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const onlineCameras = cameras.filter(cam => cam.status === 'Online');
  const offlineCameras = cameras.filter(cam => cam.status === 'Offline' || cam.status === 'Warning');

  const handleCameraClick = (camera: CameraType) => {
    setSelectedCamera(camera);
    setDetailsModalOpen(true);
  };

  return (
    <>
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

            {/* Online Cameras Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-green-500" />
                <h3 className="text-lg font-semibold text-green-600">Online Cameras ({onlineCameras.length})</h3>
              </div>
              
              <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
                {onlineCameras.map((camera) => (
                  <Card 
                    key={camera.id} 
                    className="border-green-200 bg-green-50 cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => handleCameraClick(camera)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm font-medium truncate">{camera.name}</div>
                      <div className="text-xs text-green-600 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse mr-1"></div>
                        Active
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Offline Cameras Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <WifiOff className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-red-600">Offline Cameras ({offlineCameras.length})</h3>
              </div>
              
              <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-6">
                {offlineCameras.map((camera) => (
                  <Card 
                    key={camera.id} 
                    className="border-red-200 bg-red-50 cursor-pointer hover:bg-red-100 transition-colors"
                    onClick={() => handleCameraClick(camera)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <CameraOff className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-sm font-medium truncate">{camera.name}</div>
                      <div className="text-xs text-red-600 mt-1">
                        <Clock className="h-3 w-3 inline-block mr-1" />
                        Offline
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Camera Details Modal */}
      <CameraDetailsModal
        camera={selectedCamera}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </>
  );
};

export default CameraNetworkModal;
