
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
  const [activeView, setActiveView] = useState<'all' | 'active' | 'inactive'>('all');
  
  const onlineCameras = cameras.filter(cam => cam.status === 'Online');
  const offlineCameras = cameras.filter(cam => cam.status === 'Offline' || cam.status === 'Warning');

  const handleCameraClick = (camera: CameraType) => {
    setSelectedCamera(camera);
    setDetailsModalOpen(true);
  };

  const handleEdit = (camera: CameraType) => {
    console.log('Edit camera:', camera);
    setDetailsModalOpen(false);
    onEditCamera?.(camera);
  };

  const handleViewFrame = (camera: CameraType) => {
    console.log('View frame:', camera);
    setDetailsModalOpen(false);
    onViewFrame?.(camera);
  };

  const CameraCard = ({ camera }: { camera: CameraType }) => {
    const isOnline = camera.status === 'Online';
    
    return (
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md",
          isOnline 
            ? "border-green-200 bg-green-50 hover:bg-green-100" 
            : "border-red-200 bg-red-50 hover:bg-red-100"
        )}
        onClick={() => handleCameraClick(camera)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center",
              isOnline ? "bg-green-500" : "bg-red-500"
            )}>
              {isOnline ? (
                <Camera className="h-6 w-6 text-white" />
              ) : (
                <CameraOff className="h-6 w-6 text-white" />
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(camera);
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewFrame(camera);
                }}
              >
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-sm truncate">{camera.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{camera.location}</p>
            <div className="flex items-center gap-2">
              <Badge 
                variant={isOnline ? "default" : "destructive"}
                className={isOnline ? "bg-green-500 hover:bg-green-600" : ""}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full mr-1",
                  isOnline ? "bg-white animate-pulse" : "bg-red-200"
                )} />
                {isOnline ? "Active" : "Offline"}
              </Badge>
              {camera.isPtz && (
                <Badge variant="secondary" className="text-xs">
                  PTZ
                </Badge>
              )}
            </div>
            {!isOnline && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last seen: {camera.lastSeen}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
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

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={activeView === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('all')}
              >
                All Cameras
              </Button>
              <Button
                variant={activeView === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('active')}
                className="text-green-600"
              >
                <Wifi className="h-4 w-4 mr-1" />
                Active ({onlineCameras.length})
              </Button>
              <Button
                variant={activeView === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('inactive')}
                className="text-red-600"
              >
                <WifiOff className="h-4 w-4 mr-1" />
                Inactive ({offlineCameras.length})
              </Button>
            </div>

            {/* Camera Grid based on active view */}
            {(activeView === 'all' || activeView === 'active') && onlineCameras.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-green-600">
                    Active Cameras ({onlineCameras.length})
                  </h3>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {onlineCameras.map((camera) => (
                    <CameraCard key={camera.id} camera={camera} />
                  ))}
                </div>
              </div>
            )}

            {(activeView === 'all' || activeView === 'inactive') && offlineCameras.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-red-600">
                    Inactive Cameras ({offlineCameras.length})
                  </h3>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {offlineCameras.map((camera) => (
                    <CameraCard key={camera.id} camera={camera} />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {((activeView === 'active' && onlineCameras.length === 0) ||
              (activeView === 'inactive' && offlineCameras.length === 0)) && (
              <div className="text-center py-8">
                <div className="text-muted-foreground">
                  No {activeView} cameras found
                </div>
              </div>
            )}
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
