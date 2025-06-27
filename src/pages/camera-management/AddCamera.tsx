import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { Camera, TestTube, Settings, MapPin, Network, Eye, ArrowLeft, ArrowRight, RotateCw, Users, Target, Plus, Trash2, Clock, ZoomIn, ZoomOut } from "lucide-react";
import CameraTestPreview from "@/components/camera-management/CameraTestPreview";
import ONVIFDiscovery from "@/components/camera-management/ONVIFDiscovery";

type ConfigurationStep = 'camera' | 'analytics';

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
}

interface PTZPosition {
  id: string;
  name: string;
  position: { x: number; y: number };
  zoom: number;
  analyticsLines: AnalyticsLine[];
}

interface PTZSchedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  positionId: string;
  enabled: boolean;
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
  const [showTestPreview, setShowTestPreview] = useState(false);
  const [showONVIF, setShowONVIF] = useState(false);
  const [testFrameUrl, setTestFrameUrl] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);

  // PTZ Configuration states
  const [ptzPositions, setPtzPositions] = useState<PTZPosition[]>([]);
  const [ptzSchedules, setPtzSchedules] = useState<PTZSchedule[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [currentPTZZoom, setCurrentPTZZoom] = useState(1);
  const [newPositionName, setNewPositionName] = useState('');
  
  // Line drawing states
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [selectedAnalyticType, setSelectedAnalyticType] = useState<'border-jumping' | 'in-out-counting'>('border-jumping');
  const [lineColor, setLineColor] = useState('#ff0000');
  const [lineName, setLineName] = useState('');
  const [lineDirection, setLineDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [countType, setCountType] = useState<'people' | 'vehicles' | 'objects'>('people');

  const analytics = [
    { id: 'frs', name: 'Face Recognition System (FRS)', description: 'Detect and recognize faces', needsLines: false },
    { id: 'object-detection', name: 'Object Detection', description: 'Detect vehicles, people, and objects', needsLines: false },
    { id: 'anpr', name: 'ANPR (License Plate Recognition)', description: 'Automatic number plate recognition', needsLines: false },
    { id: 'border-jumping', name: 'Border Jumping Detection', description: 'Detect boundary crossings', needsLines: true },
    { id: 'in-out-counting', name: 'In/Out Counting', description: 'Count objects crossing virtual lines', needsLines: true },
    { id: 'crowd-analysis', name: 'Crowd Analysis', description: 'Monitor crowd density and behavior', needsLines: false },
    { id: 'loitering', name: 'Loitering Detection', description: 'Detect people staying in areas too long', needsLines: true }
  ];

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  const generateRTSP = () => {
    if (cameraData.username && cameraData.password && cameraData.ip && cameraData.port) {
      const rtsp = `rtsp://${cameraData.username}:${cameraData.password}@${cameraData.ip}:${cameraData.port}/stream1`;
      setCameraData({...cameraData, rtspUrl: rtsp});
    }
  };

  const handleAnalyticsChange = (analyticsId: string, checked: boolean) => {
    if (checked) {
      setSelectedAnalytics([...selectedAnalytics, analyticsId]);
    } else {
      setSelectedAnalytics(selectedAnalytics.filter(id => id !== analyticsId));
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
    console.log('Adding camera:', { cameraData, selectedAnalytics, ptzPositions, ptzSchedules });
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

  // PTZ Functions
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isDrawingLine) {
      setCurrentLine(prev => [...prev, { x, y }]);
    }
  };

  const setPTZPosition = (name: string) => {
    if (!name || ptzPositions.length >= 5) return;
    
    const newPosition: PTZPosition = {
      id: Date.now().toString(),
      name: name,
      position: { x: 50, y: 50 }, // Center position
      zoom: currentPTZZoom,
      analyticsLines: []
    };
    setPtzPositions(prev => [...prev, newPosition]);
    setSelectedPosition(newPosition.id);
    setNewPositionName('');
  };

  const startDrawingLine = () => {
    if (!lineName) return;
    setIsDrawingLine(true);
    setCurrentLine([]);
  };

  const finishLine = () => {
    if (currentLine.length < 2) return;

    const newLine: AnalyticsLine = {
      id: Date.now().toString(),
      type: selectedAnalyticType,
      name: lineName,
      points: currentLine,
      color: lineColor,
      ...(selectedAnalyticType === 'in-out-counting' && {
        direction: lineDirection,
        countType: countType
      })
    };

    if (cameraData.isPTZ && selectedPosition) {
      setPtzPositions(prev => prev.map(pos => 
        pos.id === selectedPosition 
          ? { ...pos, analyticsLines: [...pos.analyticsLines, newLine] }
          : pos
      ));
    } else if (!cameraData.isPTZ) {
      // For static camera, add to the single static position
      setPtzPositions(prev => prev.map(pos => 
        pos.id === 'static' 
          ? { ...pos, analyticsLines: [...pos.analyticsLines, newLine] }
          : pos
      ));
    }

    setCurrentLine([]);
    setIsDrawingLine(false);
    setLineName('');
  };

  const deleteAnalyticsLine = (positionId: string, lineId: string) => {
    setPtzPositions(prev => prev.map(pos => 
      pos.id === positionId 
        ? { ...pos, analyticsLines: pos.analyticsLines.filter(line => line.id !== lineId) }
        : pos
    ));
  };

  const deletePosition = (id: string) => {
    setPtzPositions(prev => prev.filter(position => position.id !== id));
    if (selectedPosition === id) {
      setSelectedPosition('');
    }
  };

  const addSchedule = () => {
    const newSchedule: PTZSchedule = {
      id: Date.now().toString(),
      name: `Schedule ${ptzSchedules.length + 1}`,
      startTime: '09:00',
      endTime: '17:00',
      positionId: '',
      enabled: true
    };
    setPtzSchedules(prev => [...prev, newSchedule]);
  };

  const updateSchedule = (id: string, field: string, value: any) => {
    setPtzSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, [field]: value } : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setPtzSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  const hasLineBasedAnalytics = selectedAnalytics.some(a => analytics.find(an => an.id === a)?.needsLines);
  const selectedPositionData = ptzPositions.find(pos => pos.id === selectedPosition);
  const staticPositionData = ptzPositions.find(pos => pos.id === 'static');

  const getStepTitle = () => {
    switch (currentStep) {
      case 'camera': return 'Camera Configuration';
      case 'analytics': return 'Analytics Configuration';
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
            {/* Analytics Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Analytics Selection
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
                        <Label htmlFor={analytic.id} className="text-sm font-medium cursor-pointer flex items-center gap-2">
                          {analytic.name}
                          {analytic.needsLines && <Badge variant="outline" className="text-xs">Line Drawing</Badge>}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {analytic.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Camera View & Configuration */}
            {hasLineBasedAnalytics && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Side - Camera Frame with integrated PTZ and Line Drawing */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Camera View & Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* PTZ Controls (only if camera is PTZ) */}
                    {cameraData.isPTZ && (
                      <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label className="font-medium">PTZ Position Setup</Label>
                          <Badge>{ptzPositions.length}/5 positions</Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Position name"
                            value={newPositionName}
                            onChange={(e) => setNewPositionName(e.target.value)}
                            className="flex-1"
                            disabled={ptzPositions.length >= 5}
                          />
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPTZZoom(Math.max(1, currentPTZZoom - 1))}
                              disabled={currentPTZZoom <= 1}
                            >
                              <ZoomOut className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{currentPTZZoom}x</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPTZZoom(Math.min(5, currentPTZZoom + 1))}
                              disabled={currentPTZZoom >= 5}
                            >
                              <ZoomIn className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            onClick={() => setPTZPosition(newPositionName)}
                            size="sm"
                            disabled={!newPositionName || ptzPositions.length >= 5}
                          >
                            <Target className="h-4 w-4 mr-1" />
                            Save Position
                          </Button>
                        </div>

                        {/* PTZ Position Selection */}
                        {ptzPositions.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm">Current Position</Label>
                            <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select position for line drawing" />
                              </SelectTrigger>
                              <SelectContent>
                                {ptzPositions.map((position, index) => (
                                  <SelectItem key={position.id} value={position.id}>
                                    {index + 1}: {position.name} ({position.zoom}x)
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
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
                            Test camera connection to see frame
                          </div>
                        )}
                        
                        {/* Display analytics lines for current position */}
                        {(() => {
                          const currentPositionData = cameraData.isPTZ ? selectedPositionData : staticPositionData;
                          return currentPositionData?.analyticsLines.map((line) => (
                            <svg key={line.id} className="absolute inset-0 w-full h-full pointer-events-none">
                              <polyline
                                points={line.points.map(p => `${p.x}%,${p.y}%`).join(' ')}
                                stroke={line.color}
                                strokeWidth="3"
                                fill="none"
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
                          ));
                        })()}

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

                    {/* PTZ Schedules */}
                    {cameraData.isPTZ && ptzPositions.length > 0 && (
                      <div className="space-y-3 p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2 font-medium">
                            <Clock className="h-4 w-4" />
                            PTZ Schedule
                          </Label>
                          <Button onClick={addSchedule} size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>

                        {ptzSchedules.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No schedules configured</p>
                        ) : (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {ptzSchedules.map((schedule) => (
                              <div key={schedule.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                                <Checkbox
                                  checked={schedule.enabled}
                                  onCheckedChange={(checked) => updateSchedule(schedule.id, 'enabled', checked)}
                                />
                                <Input
                                  value={schedule.name}
                                  onChange={(e) => updateSchedule(schedule.id, 'name', e.target.value)}
                                  className="w-20 h-6 text-xs"
                                />
                                <Input
                                  type="time"
                                  value={schedule.startTime}
                                  onChange={(e) => updateSchedule(schedule.id, 'startTime', e.target.value)}
                                  className="w-16 h-6 text-xs"
                                />
                                <Input
                                  type="time"
                                  value={schedule.endTime}
                                  onChange={(e) => updateSchedule(schedule.id, 'endTime', e.target.value)}
                                  className="w-16 h-6 text-xs"
                                />
                                <Select 
                                  value={schedule.positionId} 
                                  onValueChange={(value) => updateSchedule(schedule.id, 'positionId', value)}
                                >
                                  <SelectTrigger className="w-20 h-6 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ptzPositions.map((position, index) => (
                                      <SelectItem key={position.id} value={position.id}>
                                        {index + 1}: {position.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button variant="ghost" size="sm" onClick={() => deleteSchedule(schedule.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Right Side - Analytics Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Analytics Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Line Drawing Configuration */}
                    <div className="space-y-3">
                      <Label>Draw Analytics Lines</Label>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Analytics Type</Label>
                        <Select value={selectedAnalyticType} onValueChange={(value: 'border-jumping' | 'in-out-counting') => setSelectedAnalyticType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedAnalytics.includes('border-jumping') && (
                              <SelectItem value="border-jumping">Border Jumping</SelectItem>
                            )}
                            {selectedAnalytics.includes('in-out-counting') && (
                              <SelectItem value="in-out-counting">In/Out Counting</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Line Name</Label>
                        <Input
                          value={lineName}
                          onChange={(e) => setLineName(e.target.value)}
                          placeholder="Enter line name"
                        />
                      </div>

                      {selectedAnalyticType === 'in-out-counting' && (
                        <>
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
                        </>
                      )}

                      <div className="space-y-2">
                        <Label className="text-sm">Line Color</Label>
                        <div className="flex flex-wrap gap-2">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => setLineColor(color)}
                              className={`w-6 h-6 rounded border-2 ${lineColor === color ? 'border-black' : 'border-gray-300'}`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={startDrawingLine}
                        disabled={!lineName || isDrawingLine || (cameraData.isPTZ && !selectedPosition)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Start Drawing Line
                      </Button>
                    </div>

                    {/* Existing Lines */}
                    <div className="space-y-3">
                      <Label>Current Position Lines</Label>
                      
                      {(() => {
                        const currentPositionData = cameraData.isPTZ ? selectedPositionData : staticPositionData;
                        return currentPositionData && currentPositionData.analyticsLines.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {currentPositionData.analyticsLines.map((line) => (
                              <div key={line.id} className="flex items-center justify-between p-2 border rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: line.color }}
                                  />
                                  <div>
                                    <div className="font-medium">{line.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {line.type === 'border-jumping' ? 'Border Jumping' : `${line.countType} • ${line.direction}`}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteAnalyticsLine(currentPositionData.id, line.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {cameraData.isPTZ && !selectedPosition ? "Select a PTZ position to draw lines" : "No analytics lines configured"}
                          </p>
                        );
                      })()}
                    </div>

                    {/* PTZ Positions List */}
                    {cameraData.isPTZ && (
                      <div className="space-y-3">
                        <Label>Saved PTZ Positions ({ptzPositions.length}/5)</Label>
                        
                        {ptzPositions.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No positions saved yet</p>
                        ) : (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {ptzPositions.map((position, index) => (
                              <div key={position.id} className="flex items-center justify-between p-2 border rounded text-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <span className="font-medium">{position.name}</span>
                                    <p className="text-xs text-muted-foreground">
                                      Zoom: {position.zoom}x | Lines: {position.analyticsLines.length}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => deletePosition(position.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep('camera')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleAddCamera}>
                <Camera className="h-4 w-4 mr-2" />
                Add Camera
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    if (!cameraData.isPTZ && hasLineBasedAnalytics && ptzPositions.length === 0) {
      // Create a default static position for non-PTZ cameras
      const staticPosition: PTZPosition = {
        id: 'static',
        name: 'Static View',
        position: { x: 50, y: 50 },
        zoom: 1,
        analyticsLines: []
      };
      setPtzPositions([staticPosition]);
      setSelectedPosition('static');
    }
  }, [cameraData.isPTZ, hasLineBasedAnalytics, ptzPositions.length]);

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
