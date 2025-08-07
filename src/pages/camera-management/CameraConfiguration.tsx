
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cameras } from "@/lib/placeholder-data";
import { Edit, Trash2, Eye, Settings } from "lucide-react";
import { Camera as CameraType } from "@/lib/types";
import { useState } from "react";
import CameraEditDialog from "@/components/dashboard/CameraEditDialog";
import CameraDetailsDialog from "@/components/dashboard/CameraDetailsDialog";
import { cn } from "@/lib/utils";

const CameraConfiguration = () => {
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const getStatusVariant = (status: 'Online' | 'Offline' | 'Warning') => {
    switch (status) {
      case 'Online':
        return 'default';
      case 'Offline':
        return 'destructive';
      case 'Warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getActiveDuration = (camera: CameraType) => {
    if (camera.status === 'Online') {
      const durations = ["2h 45m", "1d 12h", "3h 22m", "45m", "6h 10m", "2d 8h"];
      return durations[Math.floor(Math.random() * durations.length)];
    }
    return null;
  };

  const getInactiveReason = (camera: CameraType) => {
    if (camera.status === 'Offline' || camera.status === 'Warning') {
      const reasons = [
        "Network connection lost",
        "Authentication failed", 
        "Power supply disconnected",
        "Camera hardware failure",
        "RTSP stream timeout",
        "Firmware update required"
      ];
      return reasons[Math.floor(Math.random() * reasons.length)];
    }
    return null;
  };

  const getInactiveDuration = (camera: CameraType) => {
    if (camera.status === 'Offline' || camera.status === 'Warning') {
      const durations = ["15m", "2h", "1d 3h", "30m", "4h 20m", "12h"];
      return durations[Math.floor(Math.random() * durations.length)];
    }
    return null;
  };

  const handleEdit = (camera: CameraType) => {
    setSelectedCamera(camera);
    setEditDialogOpen(true);
  };

  const handleView = (camera: CameraType) => {
    setSelectedCamera(camera);
    setDetailsDialogOpen(true);
  };

  const handleDelete = (camera: CameraType) => {
    console.log('Delete camera:', camera);
    // TODO: Implement delete functionality
  };

  const handleSaveCamera = (updatedCamera: CameraType) => {
    console.log('Save camera:', updatedCamera);
    setEditDialogOpen(false);
    // TODO: Implement save functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Camera Configuration</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            All Cameras ({cameras.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Camera Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration/Reason</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cameras.map((camera) => {
                const activeDuration = getActiveDuration(camera);
                const inactiveReason = getInactiveReason(camera);
                const inactiveDuration = getInactiveDuration(camera);
                
                return (
                  <TableRow key={camera.id}>
                    <TableCell className="font-medium">{camera.name}</TableCell>
                    <TableCell className="text-muted-foreground">{camera.location}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusVariant(camera.status)} 
                        className={cn(
                          camera.status === 'Warning' && 'bg-yellow-500 text-black hover:bg-yellow-600'
                        )}
                      >
                        {camera.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {camera.status === 'Online' ? (
                        <div className="text-sm">
                          <div className="text-green-600 font-medium">Active for {activeDuration}</div>
                          <div className="text-xs text-muted-foreground">Since {camera.lastSeen}</div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div className="text-red-600 font-medium">{inactiveReason}</div>
                          <div className="text-xs text-muted-foreground">Inactive for {inactiveDuration}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {camera.ip}:{camera.port}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {camera.resolution}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(camera)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(camera)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(camera)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Camera Dialog */}
      <CameraEditDialog
        camera={selectedCamera}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveCamera}
      />

      {/* Camera Details Dialog */}
      <CameraDetailsDialog
        camera={selectedCamera}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CameraConfiguration;
