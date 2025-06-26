
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cameras } from "@/lib/placeholder-data";
import { Video, Camera, CameraOff, Eye, Users } from "lucide-react";
import { useState } from "react";
import { Camera as CameraType } from "@/lib/types";
import CameraDetailsDialog from "./CameraDetailsDialog";
import CameraNetworkModal from "./CameraNetworkModal";

const CameraNetworkCard = () => {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [networkModalOpen, setNetworkModalOpen] = useState(false);

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

  const handleViewFrame = (camera: CameraType) => {
    console.log('View frame for camera:', camera);
    // TODO: Implement frame viewing
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
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                <Camera className="h-3 w-3 mr-1" />
                {activeCameras.length} Online
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge variant="destructive">
                <CameraOff className="h-3 w-3 mr-1" />
                {inactiveCameras.length} Offline
              </Badge>
            </div>
          </div>
          
          {/* View All Button */}
          <Button 
            onClick={() => setNetworkModalOpen(true)}
            variant="outline" 
            className="w-full"
          >
            <Eye className="h-4 w-4 mr-2" />
            View All Cameras
          </Button>
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

      {/* Camera Network Modal */}
      <CameraNetworkModal
        open={networkModalOpen}
        onOpenChange={setNetworkModalOpen}
        onEditCamera={handleEdit}
        onViewFrame={handleViewFrame}
      />
    </>
  );
};

export default CameraNetworkCard;
