
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Search, Camera, Wifi, CheckCircle, RefreshCw } from "lucide-react";

interface DiscoveredCamera {
  id: string;
  name: string;
  ip: string;
  manufacturer: string;
  model: string;
  rtspUrl: string;
  status: 'online' | 'offline';
}

interface ONVIFDiscoveryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCameraSelect: (camera: DiscoveredCamera) => void;
}

const ONVIFDiscovery = ({ open, onOpenChange, onCameraSelect }: ONVIFDiscoveryProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [networkRange, setNetworkRange] = useState('192.168.1.0/24');
  const [discoveredCameras, setDiscoveredCameras] = useState<DiscoveredCamera[]>([]);

  // Mock discovered cameras for demonstration
  const mockCameras: DiscoveredCamera[] = [
    {
      id: '1',
      name: 'Hikvision DS-2CD2085G1',
      ip: '192.168.1.100',
      manufacturer: 'Hikvision',
      model: 'DS-2CD2085G1',
      rtspUrl: 'rtsp://192.168.1.100:554/Streaming/Channels/101',
      status: 'online'
    },
    {
      id: '2',
      name: 'Dahua IPC-HFW4831E',
      ip: '192.168.1.101',
      manufacturer: 'Dahua',
      model: 'IPC-HFW4831E',
      rtspUrl: 'rtsp://192.168.1.101:554/cam/realmonitor?channel=1&subtype=0',
      status: 'online'
    },
    {
      id: '3',
      name: 'Axis M3046-V',
      ip: '192.168.1.102',
      manufacturer: 'Axis',
      model: 'M3046-V',
      rtspUrl: 'rtsp://192.168.1.102:554/axis-media/media.amp',
      status: 'offline'
    }
  ];

  const handleScan = async () => {
    setIsScanning(true);
    setDiscoveredCameras([]);
    
    // Simulate scanning delay
    setTimeout(() => {
      setDiscoveredCameras(mockCameras);
      setIsScanning(false);
    }, 3000);
  };

  const handleSelectCamera = (camera: DiscoveredCamera) => {
    onCameraSelect(camera);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            ONVIF Camera Discovery
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Network Range Input */}
          <div className="space-y-2">
            <Label htmlFor="network-range">Network Range</Label>
            <div className="flex gap-2">
              <Input
                id="network-range"
                value={networkRange}
                onChange={(e) => setNetworkRange(e.target.value)}
                placeholder="192.168.1.0/24"
                className="flex-1"
              />
              <Button 
                onClick={handleScan} 
                disabled={isScanning}
                className="min-w-[120px]"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Scan Network
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the network range to scan for ONVIF-compatible cameras
            </p>
          </div>

          {/* Scanning Progress */}
          {isScanning && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-lg font-medium">Scanning for cameras...</p>
              <p className="text-sm text-muted-foreground">This may take a few moments</p>
            </div>
          )}

          {/* Discovered Cameras */}
          {discoveredCameras.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Discovered Cameras ({discoveredCameras.length})
              </h3>
              
              <div className="grid gap-3">
                {discoveredCameras.map((camera) => (
                  <div 
                    key={camera.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Camera className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{camera.name}</h4>
                          <Badge variant={camera.status === 'online' ? 'default' : 'secondary'}>
                            <Wifi className="h-3 w-3 mr-1" />
                            {camera.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {camera.manufacturer} • {camera.model} • {camera.ip}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {camera.rtspUrl}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleSelectCamera(camera)}
                      disabled={camera.status === 'offline'}
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Select
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Cameras Found */}
          {!isScanning && discoveredCameras.length === 0 && networkRange && (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No cameras found</p>
              <p className="text-sm text-muted-foreground">
                Try scanning a different network range or check if cameras support ONVIF
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">About ONVIF Discovery</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ONVIF is a standard for IP camera communication</li>
              <li>• This tool automatically discovers compatible cameras on your network</li>
              <li>• Most modern IP cameras support ONVIF protocol</li>
              <li>• Ensure cameras are powered on and connected to the same network</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ONVIFDiscovery;
