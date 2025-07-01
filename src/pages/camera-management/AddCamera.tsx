import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { Camera, TestTube, Settings, MapPin, Network, Eye, ArrowLeft, ArrowRight, RotateCw, Users, Target, Plus, Trash2, Clock, ZoomIn, ZoomOut, Lock, Unlock, Save } from "lucide-react";
import CameraTestPreview from "@/components/camera-management/CameraTestPreview";
import ONVIFDiscovery from "@/components/camera-management/ONVIFDiscovery";

type ConfigurationStep = 'camera' | 'analytics' | 'summary';

interface Point {
  x: number;
  y: number;
}

interface AnalyticsLine {
  id: string;
  type: 'border-jumping' | 'in-out-counting';
  name: string;
  points: Point[];
  color: string;
  direction?: 'horizontal' | 'vertical';
  countType?: 'people' | 'vehicles' | 'objects';
  locked: boolean;
}

interface PTZPosition {
  pan: number;
  tilt: number;
  zoom: number;
}

interface AnalyticsSchedule {
  id: string;
  startTime: string;
  endTime: string;
  days: string[];
}

interface AnalyticsConfiguration {
  id: string;
  type: 'frs' | 'anpr' | 'object-detection' | 'border-jumping' | 'in-out-counting' | 'crowd-analysis' | 'loitering';
  name: string;
  ptzPosition?: PTZPosition;
  schedule?: AnalyticsSchedule[];
  lines?: AnalyticsLine[];
  locked: boolean;
  configured: boolean;
}

const AddCamera = () => {
  const [currentStep, setCurrentStep] = useState<ConfigurationStep>('camera');
  const [cameraData, setCameraData] = useState({
    name: '',
    ip: '',
    port: '554',
    latitude: '',
    longitude: '',
    location: '',
    rtspUrl: '',
    username: '',
    password: '',
    onvifPort: '80',
    resolution: '1920x1080',
    fps: '30',
    isPTZ: false
  });

  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>([]);
  const [analyticsConfigurations, setAnalyticsConfigurations] = useState<AnalyticsConfiguration[]>([]);
  const [showTestPreview, setShowTestPreview] = useState(false);
  const [showONVIF, setShowONVIF] = useState(false);
  const [testFrameUrl, setTestFrameUrl] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);

  // PTZ Control states
  const [currentPTZ, setCurrentPTZ] = useState<PTZPosition>({ pan: 0, tilt: 0, zoom: 1 });
  const [activeAnalyticConfig, setActiveAnalyticConfig] = useState<string>('');

  // Line drawing states
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [lineColor, setLineColor] = useState('#ff0000');
  const [lineName, setLineName] = useState('');
  const [lineDirection, setLineDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [countType, setCountType] = useState<'people' | 'vehicles' | 'objects'>('people');

  // Schedule states
  const [scheduleStartTime, setScheduleStartTime] = useState('09:00');
  const [scheduleEndTime, setScheduleEndTime] = useState('17:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);

  const analytics = [
    { id: 'frs', name: 'FRS', fullName: 'Face Recognition System', needsLines: false, needsSchedule: true },
    { id: 'anpr', name: 'ANPR', fullName: 'License Plate Recognition', needsLines: false, needsSchedule: true },
    { id: 'object-detection', name: 'Object Detection', fullName: 'Object Detection', needsLines: false, needsSchedule: false },
    { id: 'border-jumping', name: 'Border', fullName: 'Border Jumping Detection', needsLines: true, needsSchedule: false },
    { id: 'in-out-counting', name: 'In/Out Count', fullName: 'In/Out Counting', needsLines: true, needsSchedule: false },
    { id: 'crowd-analysis', name: 'Crowd Analysis', fullName: 'Crowd Analysis', needsLines: false, needsSchedule: false },
    { id: 'loitering', name: 'Loitering', fullName: 'Loitering Detection', needsLines: true, needsSchedule: false }
  ];

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const generateRTSP = () => {
    if (cameraData.username && cameraData.password && cameraData.ip && cameraData.port) {
      const rtsp = `rtsp://${cameraData.username}:${cameraData.password}@${cameraData.ip}:${cameraData.port}/stream1`;
      setCameraData({...cameraData, rtspUrl: rtsp});
    }
  };

  const handleAnalyticsChange = (analyticsId: string, checked: boolean) => {
    if (checked) {
      setSelectedAnalytics([...selectedAnalytics, analyticsId]);
      const analyticInfo = analytics.find(a => a.id === analyticsId);
      if (analyticInfo) {
        const newConfig: AnalyticsConfiguration = {
          id: analyticsId,
          type: analyticsId as any,
          name: analyticInfo.fullName,
          locked: false,
          configured: false,
          lines: [],
          schedule: []
        };
        setAnalyticsConfigurations(prev => [...prev, newConfig]);
      }
    } else {
      setSelectedAnalytics(selectedAnalytics.filter(id => id !== analyticsId));
      setAnalyticsConfigurations(prev => prev.filter(config => config.id !== analyticsId));
      if (activeAnalyticConfig === analyticsId) {
        setActiveAnalyticConfig('');
      }
    }
  };

  const handleTestCamera = () => {
    setTestFrameUrl('/placeholder.svg');
    setShowTestPreview(true);
  };

  const handleTestComplete = () => {
    setTestCompleted(true);
    setCurrentStep('analytics');
  };

  const handleAddCamera = () => {
    console.log('Adding camera:', { cameraData, analyticsConfigurations });
    setCurrentStep('summary');
  };

  const handleONVIFSelect = (cameraInfo: any) => {
    setCameraData({
      ...cameraData,
      name: cameraInfo.name || 'ONVIF Camera',
      rtspUrl: cameraInfo.rtspUrl,
      username: cameraInfo.username || '',
      password: cameraInfo.password || '',
      ip: cameraInfo.ip || ''
    });
    setShowONVIF(false);
  };

  // PTZ Control Functions
  const handlePTZChange = (axis: 'pan' | 'tilt' | 'zoom', value: number) => {
    setCurrentPTZ(prev => ({ ...prev, [axis]: value }));
  };

  const lockPTZPosition = () => {
    if (activeAnalyticConfig) {
      setAnalyticsConfigurations(prev => prev.map(config => 
        config.id === activeAnalyticConfig 
          ? { ...config, ptzPosition: { ...currentPTZ }, locked: true }
          : config
      ));
    }
  };

  // Line Drawing Functions
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingLine) return;
    
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentLine(prev => [...prev, { x, y }]);
  };

  const startDrawingLine = () => {
    if (!lineName || !activeAnalyticConfig) return;
    setIsDrawingLine(true);
    setCurrentLine([]);
  };

  const finishLine = () => {
    if (currentLine.length < 2 || !activeAnalyticConfig) return;

    const analyticConfig = analyticsConfigurations.find(config => config.id === activeAnalyticConfig);
    const analyticInfo = analytics.find(a => a.id === activeAnalyticConfig);

    const newLine: AnalyticsLine = {
      id: Date.now().toString(),
      type: analyticInfo?.id === 'border-jumping' ? 'border-jumping' : 'in-out-counting',
      name: lineName,
      points: currentLine,
      color: lineColor,
      locked: false,
      ...(analyticInfo?.id === 'in-out-counting' && {
        direction: lineDirection,
        countType: countType
      })
    };

    setAnalyticsConfigurations(prev => prev.map(config => 
      config.id === activeAnalyticConfig 
        ? { ...config, lines: [...(config.lines || []), newLine] }
        : config
    ));

    setCurrentLine([]);
    setIsDrawingLine(false);
    setLineName('');
  };

  const toggleLineLock = (lineId: string) => {
    if (!activeAnalyticConfig) return;
    
    setAnalyticsConfigurations(prev => prev.map(config => 
      config.id === activeAnalyticConfig 
        ? { 
            ...config, 
            lines: config.lines?.map(line => 
              line.id === lineId ? { ...line, locked: !line.locked } : line
            ) 
          }
        : config
    ));
  };

  const deleteLine = (lineId: string) => {
    if (!activeAnalyticConfig) return;
    
    setAnalyticsConfigurations(prev => prev.map(config => 
      config.id === activeAnalyticConfig 
        ? { 
            ...config, 
            lines: config.lines?.filter(line => line.id !== lineId) 
          }
        : config
    ));
  };

  const addSchedule = () => {
    if (!activeAnalyticConfig) return;
    
    // Check for time conflicts
    const activeConfig = analyticsConfigurations.find(config => config.id === activeAnalyticConfig);
    const hasConflict = activeConfig?.schedule?.some(schedule => {
      const existingStart = parseInt(schedule.startTime.replace(':', ''));
      const existingEnd = parseInt(schedule.endTime.replace(':', ''));
      const newStart = parseInt(scheduleStartTime.replace(':', ''));
      const newEnd = parseInt(scheduleEndTime.replace(':', ''));
      
      return (newStart >= existingStart && newStart < existingEnd) || 
             (newEnd > existingStart && newEnd <= existingEnd);
    });

    if (hasConflict) {
      alert('Time conflict detected! Please choose a different time slot.');
      return;
    }

    const newSchedule: AnalyticsSchedule = {
      id: Date.now().toString(),
      startTime: scheduleStartTime,
      endTime: scheduleEndTime,
      days: selectedDays
    };

    setAnalyticsConfigurations(prev => prev.map(config => 
      config.id === activeAnalyticConfig 
        ? { ...config, schedule: [...(config.schedule || []), newSchedule] }
        : config
    ));
  };

  const saveAnalyticsConfiguration = () => {
    if (!activeAnalyticConfig) return;
    
    const analyticInfo = analytics.find(a => a.id === activeAnalyticConfig);
    const config = analyticsConfigurations.find(c => c.id === activeAnalyticConfig);
    
    let isConfigured = true;
    
    // Validation rules
    if (analyticInfo?.needsLines && (!config?.lines || config.lines.length === 0)) {
      alert('Please draw and lock at least one line/area before saving.');
      isConfigured = false;
    }
    
    if (cameraData.isPTZ && !config?.ptzPosition) {
      alert('Please set and lock PTZ position before saving.');
      isConfigured = false;
    }
    
    if (analyticInfo?.needsSchedule && (!config?.schedule || config.schedule.length === 0)) {
      alert('Please add at least one schedule before saving.');
      isConfigured = false;
    }

    if (isConfigured) {
      setAnalyticsConfigurations(prev => prev.map(config => 
        config.id === activeAnalyticConfig 
          ? { ...config, configured: true }
          : config
      ));
      setActiveAnalyticConfig('');
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'camera': return 'Camera Configuration';
      case 'analytics': return 'Analytics Configuration';
      case 'summary': return 'Configuration Summary';
      default: return 'Camera Configuration';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'camera':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Camera Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Camera Name *</Label>
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
              </div>

              {/* Network Information */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ip">Camera IP Address *</Label>
                  <Input
                    id="ip"
                    value={cameraData.ip}
                    onChange={(e) => setCameraData({...cameraData, ip: e.target.value})}
                    placeholder="192.168.1.100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">RTSP Port</Label>
                  <Input
                    id="port"
                    value={cameraData.port}
                    onChange={(e) => setCameraData({...cameraData, port: e.target.value})}
                    placeholder="554"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onvifPort">ONVIF Port</Label>
                  <Input
                    id="onvifPort"
                    value={cameraData.onvifPort}
                    onChange={(e) => setCameraData({...cameraData, onvifPort: e.target.value})}
                    placeholder="80"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={cameraData.latitude}
                    onChange={(e) => setCameraData({...cameraData, latitude: e.target.value})}
                    placeholder="40.7128"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={cameraData.longitude}
                    onChange={(e) => setCameraData({...cameraData, longitude: e.target.value})}
                    placeholder="-74.0060"
                  />
                </div>
              </div>

              {/* Authentication */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={cameraData.username}
                    onChange={(e) => setCameraData({...cameraData, username: e.target.value})}
                    placeholder="admin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={cameraData.password}
                    onChange={(e) => setCameraData({...cameraData, password: e.target.value})}
                    placeholder="password"
                  />
                </div>
              </div>

              {/* RTSP URL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rtsp">RTSP URL</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateRTSP}
                      disabled={!cameraData.username || !cameraData.password || !cameraData.ip}
                    >
                      Generate RTSP
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowONVIF(true)}
                      className="text-xs"
                    >
                      <Network className="h-3 w-3 mr-1" />
                      Auto Discover
                    </Button>
                  </div>
                </div>
                <Input
                  id="rtsp"
                  value={cameraData.rtspUrl}
                  onChange={(e) => setCameraData({...cameraData, rtspUrl: e.target.value})}
                  placeholder="rtsp://username:password@ip:port/stream1"
                />
                <p className="text-xs text-muted-foreground">
                  You can manually enter RTSP URL or generate it from credentials above
                </p>
              </div>

              {/* Camera Settings */}
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

              {/* PTZ Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ptz"
                  checked={cameraData.isPTZ}
                  onCheckedChange={(checked) => setCameraData({...cameraData, isPTZ: checked as boolean})}
                />
                <Label htmlFor="ptz" className="text-sm font-medium">
                  This is a PTZ (Pan-Tilt-Zoom) Camera
                </Label>
              </div>

              {/* Test Connection */}
              <Button
                onClick={handleTestCamera}
                variant="outline"
                className="w-full"
                disabled={!cameraData.rtspUrl || !cameraData.name}
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Camera Connection
              </Button>

              {testCompleted && (
                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep('analytics')}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Continue to Analytics
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Camera Info Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h2 className="text-lg font-semibold">{cameraData.name} / {cameraData.ip}</h2>
              </div>
              <Badge variant={cameraData.isPTZ ? "default" : "secondary"}>
                {cameraData.isPTZ ? "PTZ Camera" : "Fixed Camera"}
              </Badge>
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* LEFT SIDE - Live Feed + PTZ Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Feed
                    {cameraData.isPTZ && <span className="text-sm text-muted-foreground">+ PTZ Controls</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* PTZ Controls (only if camera is PTZ) */}
                  {cameraData.isPTZ && (
                    <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                      <Label className="font-medium">PTZ Position Control</Label>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Pan</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePTZChange('pan', Math.max(-180, currentPTZ.pan - 10))}
                            >
                              -
                            </Button>
                            <span className="text-xs w-8 text-center">{currentPTZ.pan}°</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePTZChange('pan', Math.min(180, currentPTZ.pan + 10))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Tilt</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePTZChange('tilt', Math.max(-90, currentPTZ.tilt - 10))}
                            >
                              -
                            </Button>
                            <span className="text-xs w-8 text-center">{currentPTZ.tilt}°</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePTZChange('tilt', Math.min(90, currentPTZ.tilt + 10))}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs">Zoom</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePTZChange('zoom', Math.max(1, currentPTZ.zoom - 1))}
                            >
                              <ZoomOut className="h-3 w-3" />
                            </Button>
                            <span className="text-xs w-8 text-center">{currentPTZ.zoom}x</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePTZChange('zoom', Math.min(10, currentPTZ.zoom + 1))}
                            >
                              <ZoomIn className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {activeAnalyticConfig && (
                        <Button onClick={lockPTZPosition} size="sm" className="w-full">
                          <Lock className="h-4 w-4 mr-2" />
                          Lock Position for {analytics.find(a => a.id === activeAnalyticConfig)?.name}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Camera Frame */}
                  <div className="relative border rounded-lg overflow-hidden">
                    <div 
                      className={`relative ${isDrawingLine ? 'cursor-crosshair' : 'cursor-default'}`}
                      onClick={handleCanvasClick}
                      style={{ aspectRatio: '16/9' }}
                    >
                      {testFrameUrl ? (
                        <img 
                          src={testFrameUrl} 
                          alt="Camera Frame" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="aspect-video bg-black flex items-center justify-center text-white">
                          Live Camera Feed
                        </div>
                      )}
                      
                      {/* Display analytics lines */}
                      {activeAnalyticConfig && analyticsConfigurations
                        .find(config => config.id === activeAnalyticConfig)
                        ?.lines?.map((line) => (
                        <svg key={line.id} className="absolute inset-0 w-full h-full pointer-events-none">
                          <polyline
                            points={line.points.map(p => `${p.x}%,${p.y}%`).join(' ')}
                            stroke={line.color}
                            strokeWidth="3"
                            fill="none"
                            opacity={line.locked ? 1 : 0.7}
                          />
                          {line.points.length > 0 && (
                            <text
                              x={`${line.points[0].x}%`}
                              y={`${line.points[0].y - 2}%`}
                              fill={line.color}
                              fontSize="12"
                              fontWeight="bold"
                            >
                              {line.name}
                            </text>
                          )}
                        </svg>
                      ))}

                      {/* Current drawing line */}
                      {isDrawingLine && currentLine.length > 0 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <polyline
                            points={currentLine.map(p => `${p.x}%,${p.y}%`).join(' ')}
                            stroke={lineColor}
                            strokeWidth="3"
                            fill="none"
                          />
                          {currentLine.map((point, index) => (
                            <circle
                              key={index}
                              cx={`${point.x}%`}
                              cy={`${point.y}%`}
                              r="3"
                              fill={lineColor}
                            />
                          ))}
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Drawing Status */}
                  {isDrawingLine && (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Drawing "{lineName}" - Click points on frame to create line
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={finishLine} size="sm" disabled={currentLine.length < 2}>
                          Finish Line
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsDrawingLine(false);
                            setCurrentLine([]);
                          }} 
                          variant="outline" 
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* RIGHT SIDE - Dynamic Analytics Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Dynamic Analytics Form Area
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedAnalytics.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Select analytics below to configure them
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {/* Active Analytics Tabs */}
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalytics.map(analyticId => {
                          const analyticInfo = analytics.find(a => a.id === analyticId);
                          const config = analyticsConfigurations.find(c => c.id === analyticId);
                          return (
                            <Button
                              key={analyticId}
                              variant={activeAnalyticConfig === analyticId ? "default" : "outline"}
                              size="sm"
                              onClick={() => setActiveAnalyticConfig(analyticId)}
                              className="flex items-center gap-2"
                            >
                              {analyticInfo?.name}
                              {config?.configured && <Badge className="ml-1 h-4 text-xs">✓</Badge>}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Configuration Form for Active Analytic */}
                      {activeAnalyticConfig && (() => {
                        const analyticInfo = analytics.find(a => a.id === activeAnalyticConfig);
                        const config = analyticsConfigurations.find(c => c.id === activeAnalyticConfig);
                        
                        return (
                          <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="font-medium">{analyticInfo?.fullName} Configuration</h3>
                            
                            {/* PTZ Position Display */}
                            {cameraData.isPTZ && (
                              <div className="space-y-2">
                                <Label>PTZ Position</Label>
                                {config?.ptzPosition ? (
                                  <div className="text-sm bg-green-50 p-2 rounded">
                                    Locked: Pan {config.ptzPosition.pan}°, Tilt {config.ptzPosition.tilt}°, Zoom {config.ptzPosition.zoom}x
                                  </div>
                                ) : (
                                  <div className="text-sm bg-yellow-50 p-2 rounded">
                                    Set PTZ position and click "Lock Position" button above
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Line Drawing Configuration */}
                            {analyticInfo?.needsLines && (
                              <div className="space-y-4">
                                <Label>Line/Area Configuration</Label>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-2">
                                    <Label className="text-sm">Line Name</Label>
                                    <Input
                                      value={lineName}
                                      onChange={(e) => setLineName(e.target.value)}
                                      placeholder="Enter line name"
                                    />
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label className="text-sm">Color</Label>
                                    <div className="flex gap-1">
                                      {colors.slice(0, 3).map(color => (
                                        <button
                                          key={color}
                                          onClick={() => setLineColor(color)}
                                          className={`w-6 h-6 rounded border-2 ${lineColor === color ? 'border-black' : 'border-gray-300'}`}
                                          style={{ backgroundColor: color }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {activeAnalyticConfig === 'in-out-counting' && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                      <Label className="text-sm">Count Type</Label>
                                      <Select value={countType} onValueChange={(value: 'people' | 'vehicles' | 'objects') => setCountType(value)}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="people">People</SelectItem>
                                          <SelectItem value="vehicles">Vehicles</SelectItem>
                                          <SelectItem value="objects">Objects</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label className="text-sm">Direction</Label>
                                      <Select value={lineDirection} onValueChange={(value: 'horizontal' | 'vertical') => setLineDirection(value)}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="horizontal">Horizontal</SelectItem>
                                          <SelectItem value="vertical">Vertical</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}

                                <Button
                                  onClick={startDrawingLine}
                                  disabled={!lineName || isDrawingLine}
                                  size="sm"
                                  className="w-full"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Start Drawing Line
                                </Button>

                                {/* Existing Lines */}
                                {config?.lines && config.lines.length > 0 && (
                                  <div className="space-y-2">
                                    <Label className="text-sm">Current Lines</Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                      {config.lines.map((line) => (
                                        <div key={line.id} className="flex items-center justify-between p-2 border rounded text-sm">
                                          <div className="flex items-center gap-2">
                                            <div 
                                              className="w-3 h-3 rounded"
                                              style={{ backgroundColor: line.color }}
                                            />
                                            <span className="font-medium">{line.name}</span>
                                            {line.locked && <Lock className="h-3 w-3 text-green-600" />}
                                          </div>
                                          <div className="flex gap-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => toggleLineLock(line.id)}
                                            >
                                              {line.locked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => deleteLine(line.id)}
                                              disabled={line.locked}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Schedule Configuration */}
                            {analyticInfo?.needsSchedule && (
                              <div className="space-y-4">
                                <Label>Schedule Configuration</Label>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm">Start Time</Label>
                                    <Input
                                      type="time"
                                      value={scheduleStartTime}
                                      onChange={(e) => setScheduleStartTime(e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm">End Time</Label>
                                    <Input
                                      type="time"
                                      value={scheduleEndTime}
                                      onChange={(e) => setScheduleEndTime(e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm">Days</Label>
                                  <div className="flex flex-wrap gap-2">
                                    {days.map(day => (
                                      <Button
                                        key={day}
                                        variant={selectedDays.includes(day) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => {
                                          setSelectedDays(prev => 
                                            prev.includes(day) 
                                              ? prev.filter(d => d !== day)
                                              : [...prev, day]
                                          );
                                        }}
                                        className="text-xs"
                                      >
                                        {day.slice(0, 3)}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                <Button onClick={addSchedule} size="sm" className="w-full">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Schedule
                                </Button>

                                {/* Existing Schedules */}
                                {config?.schedule && config.schedule.length > 0 && (
                                  <div className="space-y-2">
                                    <Label className="text-sm">Active Schedules (Max 5)</Label>
                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                      {config.schedule.map((schedule) => (
                                        <div key={schedule.id} className="p-2 border rounded text-sm">
                                          <div className="flex justify-between items-center">
                                            <span>{schedule.startTime} - {schedule.endTime}</span>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                setAnalyticsConfigurations(prev => prev.map(config => 
                                                  config.id === activeAnalyticConfig 
                                                    ? { 
                                                        ...config, 
                                                        schedule: config.schedule?.filter(s => s.id !== schedule.id) 
                                                      }
                                                    : config
                                                ));
                                              }}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {schedule.days.join(', ')}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Save Configuration */}
                            <Button onClick={saveAnalyticsConfiguration} className="w-full">
                              <Save className="h-4 w-4 mr-2" />
                              Save {analyticInfo?.name} Configuration
                            </Button>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Analytics Selection (Bottom) */}
            <Card>
              <CardHeader>
                <CardTitle>Analytics Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {analytics.map((analytic) => (
                    <div key={analytic.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={analytic.id}
                        checked={selectedAnalytics.includes(analytic.id)}
                        onCheckedChange={(checked) => handleAnalyticsChange(analytic.id, checked as boolean)}
                      />
                      <Label htmlFor={analytic.id} className="text-sm cursor-pointer">
                        {analytic.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep('camera')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleAddCamera}
                disabled={selectedAnalytics.length === 0 || !analyticsConfigurations.every(config => config.configured)}
              >
                Next: Summary →
              </Button>
            </div>
          </div>
        );

      case 'summary':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Camera Details</h3>
                  <p className="text-sm text-muted-foreground">
                    {cameraData.name} ({cameraData.ip}) - {cameraData.isPTZ ? 'PTZ' : 'Fixed'} Camera
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Configured Analytics ({analyticsConfigurations.length})</h3>
                  <div className="space-y-2">
                    {analyticsConfigurations.map(config => (
                      <div key={config.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{config.name}</span>
                          <Badge variant="default">Configured</Badge>
                        </div>
                        {config.ptzPosition && (
                          <p className="text-xs text-muted-foreground">
                            PTZ: Pan {config.ptzPosition.pan}°, Tilt {config.ptzPosition.tilt}°, Zoom {config.ptzPosition.zoom}x
                          </p>
                        )}
                        {config.lines && config.lines.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Lines: {config.lines.length} configured
                          </p>
                        )}
                        {config.schedule && config.schedule.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            Schedules: {config.schedule.length} configured
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep('analytics')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Analytics
                </Button>
                <Button onClick={() => console.log('Final save:', { cameraData, analyticsConfigurations })}>
                  <Camera className="h-4 w-4 mr-2" />
                  Save Camera Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (!cameraData.isPTZ && selectedAnalytics.length > 0 && analyticsConfigurations.length === 0) {
      // Create a default static position for non-PTZ cameras
      const staticPosition: AnalyticsConfiguration = {
        id: 'static',
        type: 'object-detection',
        name: 'Static View',
        locked: false,
        configured: false,
        lines: []
      };
      setAnalyticsConfigurations([staticPosition]);
    }
  }, [cameraData.isPTZ, selectedAnalytics.length, analyticsConfigurations.length]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Camera</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Step: {getStepTitle()}
        </div>
      </div>
      
      {renderStepContent()}

      {/* Modals */}
      <CameraTestPreview
        open={showTestPreview}
        onOpenChange={setShowTestPreview}
        frameUrl={testFrameUrl}
        cameraName={cameraData.name}
        onConfirmAndContinue={handleTestComplete}
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
