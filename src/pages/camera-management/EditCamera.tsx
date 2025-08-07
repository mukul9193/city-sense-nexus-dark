
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cameras } from "@/lib/placeholder-data";
import { Camera as CameraType } from "@/lib/types";

const EditCamera = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cameraId = searchParams.get('id');
  const [formData, setFormData] = useState<Partial<CameraType>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cameraId) {
      const camera = cameras.find(c => c.id === cameraId);
      if (camera) {
        setFormData(camera);
      }
    }
    setLoading(false);
  }, [cameraId]);

  const handleChange = (field: keyof CameraType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Save camera:', formData);
    // TODO: Implement save functionality
    navigate('/camera-configuration');
  };

  const handleBack = () => {
    navigate('/camera-configuration');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!formData.name) {
    return <div>Camera not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Edit Camera - {formData.name}</h1>
        </div>
        <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Configuration
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Camera Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Camera Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter camera name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Enter location"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                value={formData.ip || ''}
                onChange={(e) => handleChange('ip', e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={formData.port || ''}
                onChange={(e) => handleChange('port', parseInt(e.target.value))}
                placeholder="8554"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select
                value={formData.resolution || ''}
                onValueChange={(value) => handleChange('resolution', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                  <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                  <SelectItem value="640x480">640x480 (VGA)</SelectItem>
                  <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fps">FPS</Label>
              <Select
                value={formData.fps?.toString() || ''}
                onValueChange={(value) => handleChange('fps', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select FPS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 FPS</SelectItem>
                  <SelectItem value="20">20 FPS</SelectItem>
                  <SelectItem value="25">25 FPS</SelectItem>
                  <SelectItem value="30">30 FPS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="admin"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rtspUrl">RTSP URL</Label>
            <Input
              id="rtspUrl"
              value={formData.rtspUrl || ''}
              onChange={(e) => handleChange('rtspUrl', e.target.value)}
              placeholder="rtsp://192.168.1.100:8554/stream"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="onvifPort">ONVIF Port</Label>
              <Input
                id="onvifPort"
                type="number"
                value={formData.onvifPort || ''}
                onChange={(e) => handleChange('onvifPort', parseInt(e.target.value))}
                placeholder="8080"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || ''}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleBack}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCamera;
