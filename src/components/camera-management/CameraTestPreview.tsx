
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye, Wifi, ArrowRight } from "lucide-react";

interface CameraTestPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frameUrl: string;
  cameraName: string;
  onConfirmAndContinue?: () => void;
}

const CameraTestPreview = ({ 
  open, 
  onOpenChange, 
  frameUrl, 
  cameraName, 
  onConfirmAndContinue 
}: CameraTestPreviewProps) => {
  const connectionStatus = frameUrl ? 'connected' : 'disconnected';
  const resolution = '1920x1080';
  const fps = '30';
  const latency = '145ms';

  const handleConfirmAndContinue = () => {
    if (onConfirmAndContinue) {
      onConfirmAndContinue();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Camera Test Preview - {cameraName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                Connection: 
                <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'} className="ml-2">
                  {connectionStatus === 'connected' ? 'Connected' : 'Failed'}
                </Badge>
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="h-3 w-3" />
              Resolution: {resolution} | FPS: {fps} | Latency: {latency}
            </div>
          </div>

          {/* Latest Frame Preview */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {frameUrl ? (
              <>
                <img 
                  src={frameUrl} 
                  alt="Latest Camera Frame" 
                  className="w-full h-full object-cover"
                />
                {/* Live indicator */}
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="bg-red-500 animate-pulse">
                    ● LATEST FRAME
                  </Badge>
                </div>
                {/* Frame timestamp */}
                <div className="absolute bottom-4 right-4">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    {new Date().toLocaleTimeString()}
                  </Badge>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-white">
                <div className="text-center">
                  <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
                  <p className="text-lg font-medium">No Video Signal</p>
                  <p className="text-sm text-gray-400">Check RTSP URL and credentials</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" disabled={!frameUrl}>
                Test Again
              </Button>
              <Button disabled={!frameUrl} onClick={handleConfirmAndContinue}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue to Analytics
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CameraTestPreview;
