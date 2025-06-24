
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit, Trash2, MapPin, Clock, Signal } from "lucide-react";
import { Camera as CameraType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CameraDetailsDialogProps {
  camera: CameraType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (camera: CameraType) => void;
  onDelete: (camera: CameraType) => void;
}

const CameraDetailsDialog = ({ camera, open, onOpenChange, onEdit, onDelete }: CameraDetailsDialogProps) => {
  if (!camera) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'Offline':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'Warning':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-lg font-semibold">{camera.name}</div>
            <div className="text-sm text-muted-foreground">{camera.id}</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{camera.location}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <Signal className="h-4 w-4 text-muted-foreground" />
              <Badge className={cn("text-xs", getStatusColor(camera.status))}>
                {camera.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Last seen: {camera.lastSeen}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(camera)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(camera)}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDetailsDialog;
