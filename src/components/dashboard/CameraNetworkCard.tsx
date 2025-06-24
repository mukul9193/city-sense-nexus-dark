
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cameras } from "@/lib/placeholder-data";
import { Video, Camera, CameraOff, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Camera as CameraType } from "@/lib/types";
import CameraDetailsDialog from "./CameraDetailsDialog";

const CameraNetworkCard = () => {
  const [showActiveCameras, setShowActiveCameras] = useState(false);
  const [showInactiveCameras, setShowInactiveCameras] = useState(false);
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

  return (
    <>
      <Card className="col-span-full md:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Camera Network</CardTitle>
          <Video className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">{cameras.length} Total</div>
          
          {/* Active Cameras Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  <Camera className="h-3 w-3 mr-1" />
                  {activeCameras.length} Online
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowActiveCameras(!showActiveCameras)}
                  className="h-6 px-2 text-xs"
                >
                  View {showActiveCameras ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </div>
            
            {showActiveCameras && (
              <div className="space-y-1 pl-2 border-l-2 border-green-500">
                {activeCameras.map((camera) => (
                  <div 
                    key={camera.id} 
                    className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => handleCameraClick(camera)}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <Camera className="h-3 w-3 text-green-500" />
                      <span className="font-medium">{camera.name}</span>
                    </div>
                    <Badge variant="default" className="bg-green-500 text-xs px-1 py-0">
                      Online
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inactive Cameras Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">
                  <CameraOff className="h-3 w-3 mr-1" />
                  {inactiveCameras.length} Offline
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInactiveCameras(!showInactiveCameras)}
                  className="h-6 px-2 text-xs"
                >
                  View {showInactiveCameras ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                </Button>
              </div>
            </div>
            
            {showInactiveCameras && (
              <div className="space-y-1 pl-2 border-l-2 border-red-500">
                {inactiveCameras.map((camera) => (
                  <div 
                    key={camera.id} 
                    className="flex items-center justify-between p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => handleCameraClick(camera)}
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <CameraOff className={cn(
                        "h-3 w-3",
                        camera.status === 'Offline' ? "text-red-500" : "text-yellow-500"
                      )} />
                      <span className="font-medium">{camera.name}</span>
                    </div>
                    <Badge variant={camera.status === 'Offline' ? 'destructive' : 'secondary'} className="text-xs px-1 py-0">
                      {camera.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
