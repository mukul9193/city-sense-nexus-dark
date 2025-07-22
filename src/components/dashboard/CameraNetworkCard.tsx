
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cameras } from "@/lib/placeholder-data";
import { Video, Camera, CameraOff, Eye, Clock, AlertTriangle } from "lucide-react";
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
                <PopoverContent className="w-[600px]" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium text-green-600">Online Cameras ({activeCameras.length})</h4>
                    </div>
                    
                    {activeCameras.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Camera Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeCameras.map((camera) => (
                            <TableRow key={camera.id}>
                              <TableCell className="font-medium">{camera.name}</TableCell>
                              <TableCell className="text-muted-foreground">{camera.location}</TableCell>
                              <TableCell>
                                <Badge variant="default" className="bg-green-500">
                                  <div className="w-2 h-2 rounded-full bg-white animate-pulse mr-1" />
                                  Live
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCameraClick(camera)}
                                  className="h-7"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
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
                <PopoverContent className="w-[700px]" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CameraOff className="h-4 w-4 text-red-500" />
                      <h4 className="font-medium text-red-600">Offline Cameras ({inactiveCameras.length})</h4>
                    </div>
                    
                    {inactiveCameras.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Camera Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Last Active</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inactiveCameras.map((camera) => (
                            <TableRow key={camera.id} className="bg-red-50">
                              <TableCell className="font-medium">{camera.name}</TableCell>
                              <TableCell className="text-muted-foreground">{camera.location}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={camera.status === 'Warning' ? 'secondary' : 'destructive'}
                                >
                                  {camera.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-red-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  <span>{getOfflineReason(camera)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{getLastActiveTime(camera)}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
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
