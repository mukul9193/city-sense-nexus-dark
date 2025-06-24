
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Camera, TestTube, Settings, MapPin, Network, Eye } from "lucide-react";
import CameraTestPreview from "@/components/camera-management/CameraTestPreview";
import BorderJumpingSetup from "@/components/camera-management/BorderJumpingSetup";
import ONVIFDiscovery from "@/components/camera-management/ONVIFDiscovery";

const AddCamera = () => {
  const [cameraData, setCameraData] = useState({
    name: '',
    location: '',
    rtspUrl: '',
    username: '',
    password: '',
    resolution: '1920x1080',
    fps: '30'
  });

  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>([]);
  const [showTestPreview, setShowTestPreview] = useState(false);
  const [showBorderSetup, setShowBorderSetup] = useState(false);
  const [showONVIF, setShowONVIF] = useState(false);
  const [testFrameUrl, setTestFrameUrl] = useState('');

  const analytics = [
    { id: 'frs', name: 'Face Recognition System (FRS)', description: 'Detect and recognize faces' },
    { id: 'object-detection', name: 'Object Detection', description: 'Detect vehicles, people, and objects' },
    { id: 'anpr', name: 'ANPR (License Plate Recognition)', description: 'Automatic number plate recognition' },
    { id: 'border-jumping', name: 'Border Jumping Detection', description: 'Detect boundary crossings' },
    { id: 'crowd-analysis', name: 'Crowd Analysis', description: 'Monitor crowd density and behavior' },
    { id: 'loitering', name: 'Loitering Detection', description: 'Detect people staying in areas too long' }
  ];

  const handleAnalyticsChange = (analyticsId: string, checked: boolean) => {
    if (checked) {
      setSelectedAnalytics([...selectedAnalytics, analyticsId]);
    } else {
      setSelectedAnalytics(selectedAnalytics.filter(id => id !== analyticsId));
    }
  };

  const handleTestCamera = () => {
    // Simulate getting a test frame
    setTestFrameUrl('/placeholder.svg');
    setShowTestPreview(true);
  };

  const handleAddCamera = () => {
    console.log('Adding camera:', { cameraData, selectedAnalytics });
    // TODO: Implement camera addition logic
  };

  const handleONVIFSelect = (cameraInfo: any) => {
    setCameraData({
      ...cameraData,
      name: cameraInfo.name || 'ONVIF Camera',
      rtspUrl: cameraInfo.rtspUrl,
      username: cameraInfo.username || '',
      password: cameraInfo.password || ''
    });
    setShowONVIF(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Add New Camera</h1>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Camera Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Camera Name</Label>
              <Input
                id="name"
                value={cameraData.name}
                onChange={(e) => setCameraData({...cameraData, name: e.target.value})}
                placeholder="Enter camera name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={cameraData.location}
                onChange={(e) => setCameraData({...cameraData, location: e.target.value})}
                placeholder="Enter camera location"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="rtsp">RTSP URL</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowONVIF(true)}
                  className="text-xs"
                >
                  <Network className="h-3 w-3 mr-1" />
                  Auto Discover (ONVIF)
                </Button>
              </div>
              <Input
                id="rtsp"
                value={cameraData.rtspUrl}
                onChange={(e) => setCameraData({...cameraData, rtspUrl: e.target.value})}
                placeholder="rtsp://username:password@ip:port/stream"
              />
              <p className="text-xs text-muted-foreground">
                Example: rtsp://admin:password@192.168.1.100:554/stream1
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={cameraData.username}
                  onChange={(e) => setCameraData({...cameraData, username: e.target.value})}
                  placeholder="Camera username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={cameraData.password}
                  onChange={(e) => setCameraData({...cameraData, password: e.target.value})}
                  placeholder="Camera password"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolution</Label>
                <Select value={cameraData.resolution} onValueChange={(value) => setCameraData({...cameraData, resolution: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                    <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                    <SelectItem value="2560x1440">2560x1440 (2K)</SelectItem>
                    <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fps">Frame Rate (FPS)</Label>
                <Select value={cameraData.fps} onValueChange={(value) => setCameraData({...cameraData, fps: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 FPS</SelectItem>
                    <SelectItem value="25">25 FPS</SelectItem>
                    <SelectItem value="30">30 FPS</SelectItem>
                    <SelectItem value="60">60 FPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleTestCamera}
              variant="outline"
              className="w-full"
              disabled={!cameraData.rtspUrl}
            >
              <TestTube className="h-4 w-4 mr-2" />
              Test Camera Connection
            </Button>
          </CardContent>
        </Card>

        {/* Analytics Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Analytics Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the analytics modules you want to enable for this camera:
            </p>
            
            <div className="space-y-3">
              {analytics.map((analytic) => (
                <div key={analytic.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={analytic.id}
                    checked={selectedAnalytics.includes(analytic.id)}
                    onCheckedChange={(checked) => handleAnalyticsChange(analytic.id, checked as boolean)}
                  />
                  <div className="space-y-1 flex-1">
                    <Label htmlFor={analytic.id} className="text-sm font-medium cursor-pointer">
                      {analytic.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {analytic.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedAnalytics.includes('border-jumping') && (
              <Button
                variant="outline"
                onClick={() => setShowBorderSetup(true)}
                className="w-full"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Configure Border Lines
              </Button>
            )}

            <div className="pt-4 space-y-3">
              <Button onClick={handleAddCamera} className="w-full" size="lg">
                <Camera className="h-4 w-4 mr-2" />
                Add Camera
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CameraTestPreview
        open={showTestPreview}
        onOpenChange={setShowTestPreview}
        frameUrl={testFrameUrl}
        cameraName={cameraData.name}
      />

      <BorderJumpingSetup
        open={showBorderSetup}
        onOpenChange={setShowBorderSetup}
        frameUrl={testFrameUrl}
      />

      <ONVIFDiscovery
        open={showONVIF}
        onOpenChange={setShowONVIF}
        onCameraSelect={handleONVIFSelect}
      />
    </div>
  );
};

export default AddCamera;
