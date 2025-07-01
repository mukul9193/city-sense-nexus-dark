import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { Camera, TestTube, Settings, MapPin, Network, Eye, ArrowLeft, ArrowRight, RotateCw, Users, Target, Plus, Trash2, Clock, ZoomIn, ZoomOut, Play, Square, Navigation } from "lucide-react";
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
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top';
  countType?: 'people' | 'vehicles' | 'objects';
}

interface Schedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  enabled: boolean;
}

interface PTZPosition {
  id: string;
  name: string;
  position: { pan: number; tilt: number };
  zoom: number;
  analyticsType: string;
  analyticsLines: AnalyticsLine[];
  schedules: Schedule[];
  isLocked: boolean;
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

  // Analytics Configuration states
  const [selectedAnalyticForConfig, setSelectedAnalyticForConfig] = useState<string>('');
  const [ptzPositions, setPtzPositions] = useState<PTZPosition[]>([]);
  const [currentPTZ, setCurrentPTZ] = useState({ pan: 0, tilt: 0, zoom: 1 });
  const [positionName, setPositionName] = useState('');
  
  // Line drawing states
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [lineColor, setLineColor] = useState('#ff0000');
  const [lineName, setLineName] = useState('');
  const [lineDirection, setLineDirection] = useState<'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top'>('left-to-right');
  const [countType, setCountType] = useState<'people' | 'vehicles' | 'objects'>('people');

  // Schedule states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<Schedule>({
    id: '',
    name: '',
    startTime: '09:00',
    endTime: '17:00',
    daysOfWeek: [],
    enabled: true
  });

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
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
  const handlePTZMove = (direction: string) => {
    switch (direction) {
      case 'up':
        setCurrentPTZ(prev => ({ ...prev, tilt: Math.min(90, prev.tilt + 5) }));
        break;
      case 'down':
        setCurrentPTZ(prev => ({ ...prev, tilt: Math.max(-90, prev.tilt - 5) }));
        break;
      case 'left':
        setCurrentPTZ(prev => ({ ...prev, pan: Math.max(-180, prev.pan - 5) }));
        break;
      case 'right':
        setCurrentPTZ(prev => ({ ...prev, pan: Math.min(180, prev.pan + 5) }));
        break;
    }
  };

  const handleZoomChange = (zoom: number) => {
    setCurrentPTZ(prev => ({ ...prev, zoom: Math.max(1, Math.min(10, zoom)) }));
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
    if (!lineName) {
      alert('Please enter a line name');
      return;
    }
    setIsDrawingLine(true);
    setCurrentLine([]);
  };

  const finishLine = () => {
    if (currentLine.length < 2) {
      alert('Please draw at least 2 points');
      return;
    }

    const selectedAnalytic = analytics.find(a => a.id === selectedAnalyticForConfig);
    if (!selectedAnalytic) return;

    const newLine: AnalyticsLine = {
      id: Date.now().toString(),
      type: selectedAnalyticForConfig as 'border-jumping' | 'in-out-counting',
      name: lineName,
      points: currentLine,
      color: lineColor,
      direction: lineDirection,
      ...(selectedAnalyticForConfig === 'in-out-counting' && { countType })
    };

    // Add line to current position or create new position for static cameras
    if (cameraData.isPTZ) {
      // For PTZ, lines are added when saving position
      setCurrentLine([]);
      setIsDrawingLine(false);
      setLineName('');
    } else {
      // For static cameras, save directly
      const staticPosition: PTZPosition = {
        id: 'static-' + Date.now(),
        name: `Static ${selectedAnalytic.name}`,
        position: { pan: 0, tilt: 0 },
        zoom: 1,
        analyticsType: selectedAnalyticForConfig,
        analyticsLines: [newLine],
        schedules: [],
        isLocked: true
      };
      setPtzPositions(prev => [...prev, staticPosition]);
      setCurrentLine([]);
      setIsDrawingLine(false);
      setLineName('');
    }
  };

  const lockPTZPosition = () => {
    if (!positionName) {
      alert('Please enter a position name');
      return;
    }

    const selectedAnalytic = analytics.find(a => a.id === selectedAnalyticForConfig);
    if (!selectedAnalytic) return;

    const lines = currentLine.length >= 2 && selectedAnalytic.needsLines ? [{
      id: Date.now().toString(),
      type: selectedAnalyticForConfig as 'border-jumping' | 'in-out-counting',
      name: lineName || 'Default Line',
      points: currentLine,
      color: lineColor,
      direction: lineDirection,
      ...(selectedAnalyticForConfig === 'in-out-counting' && { countType })
    }] : [];

    const newPosition: PTZPosition = {
      id: Date.now().toString(),
      name: positionName,
      position: { pan: currentPTZ.pan, tilt: currentPTZ.tilt },
      zoom: currentPTZ.zoom,
      analyticsType: selectedAnalyticForConfig,
      analyticsLines: lines,
      schedules: [],
      isLocked: true
    };

    setPtzPositions(prev => [...prev, newPosition]);
    setPositionName('');
    setCurrentLine([]);
    setIsDrawingLine(false);
    setLineName('');
  };

  const addScheduleToPosition = (positionId: string) => {
    if (currentSchedule.daysOfWeek.length === 0) {
      alert('Please select at least one day');
      return;
    }

    const newSchedule: Schedule = {
      ...currentSchedule,
      id: Date.now().toString()
    };

    setPtzPositions(prev => prev.map(pos => 
      pos.id === positionId 
        ? { ...pos, schedules: [...pos.schedules, newSchedule] }
        : pos
    ));

    setCurrentSchedule({
      id: '',
      name: '',
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [],
      enabled: true
    });
    setIsScheduleModalOpen(false);
  };

  const deletePosition = (positionId: string) => {
    setPtzPositions(prev => prev.filter(pos => pos.id !== positionId));
  };

  const deleteSchedule = (positionId: string, scheduleId: string) => {
    setPtzPositions(prev => prev.map(pos => 
      pos.id === positionId 
        ? { ...pos, schedules: pos.schedules.filter(s => s.id !== scheduleId) }
        : pos
    ));
  };

  const getArrowPath = (points: Point[], direction: string) => {
    if (points.length < 2) return '';
    
    const lastPoint = points[points.length - 1];
    const secondLastPoint = points[points.length - 2];
    
    // Calculate arrow direction based on line direction and user selection
    let arrowAngle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x);
    
    // Adjust angle based on direction setting
    switch (direction) {
      case 'right-to-left':
        arrowAngle += Math.PI;
        break;
      case 'top-to-bottom':
        arrowAngle = Math.PI / 2;
        break;
      case 'bottom-to-top':
        arrowAngle = -Math.PI / 2;
        break;
    }
    
    const arrowSize = 8;
    const arrowX = lastPoint.x;
    const arrowY = lastPoint.y;
    
    const x1 = arrowX - arrowSize * Math.cos(arrowAngle - Math.PI / 6);
    const y1 = arrowY - arrowSize * Math.sin(arrowAngle - Math.PI / 6);
    const x2 = arrowX - arrowSize * Math.cos(arrowAngle + Math.PI / 6);
    const y2 = arrowY - arrowSize * Math.sin(arrowAngle + Math.PI / 6);
    
    return `M ${arrowX} ${arrowY} L ${x1} ${y1} M ${arrowX} ${arrowY} L ${x2} ${y2}`;
  };

  const handleAddCamera = () => {
    console.log('Adding camera:', { cameraData, selectedAnalytics, ptzPositions });
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
            <div className="grid lg:grid-cols-2 gap-6">
              {/* LEFT SIDE - Camera View & Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Camera View & Configuration
                    <Badge variant="outline">
                      {cameraData.name} ({cameraData.isPTZ ? 'PTZ' : 'Static'})
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* PTZ Controls (only if camera is PTZ) */}
                  {cameraData.isPTZ && selectedAnalyticForConfig && (
                    <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                      <Label className="font-medium">PTZ Controls</Label>
                      
                      {/* PTZ Direction Controls */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handlePTZMove('up')}>
                            ↑
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handlePTZMove('left')}>
                            ←
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handlePTZMove('right')}>
                            →
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handlePTZMove('down')}>
                            ↓
                          </Button>
                        </div>
                      </div>

                      {/* PTZ Values Display */}
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-center">
                          <Label>Pan: {currentPTZ.pan}°</Label>
                        </div>
                        <div className="text-center">
                          <Label>Tilt: {currentPTZ.tilt}°</Label>
                        </div>
                        <div className="text-center">
                          <Label>Zoom: {currentPTZ.zoom}x</Label>
                        </div>
                      </div>

                      {/* Zoom Controls */}
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleZoomChange(currentPTZ.zoom - 1)}>
                          <ZoomOut className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-12 text-center">{currentPTZ.zoom}x</span>
                        <Button variant="outline" size="sm" onClick={() => handleZoomChange(currentPTZ.zoom + 1)}>
                          <ZoomIn className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Position Name Input */}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Position name"
                          value={positionName}
                          onChange={(e) => setPositionName(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={lockPTZPosition}
                          size="sm"
                          disabled={!positionName}
                        >
                          <Target className="h-4 w-4 mr-1" />
                          Lock Position
                        </Button>
                      </div>
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
                      
                      {/* Display existing analytics lines */}
                      {ptzPositions
                        .filter(pos => pos.analyticsType === selectedAnalyticForConfig)
                        .map(position => 
                          position.analyticsLines.map((line) => (
                            <svg key={line.id} className="absolute inset-0 w-full h-full pointer-events-none">
                              <polyline
                                points={line.points.map(p => `${p.x}%,${p.y}%`).join(' ')}
                                stroke={line.color}
                                strokeWidth="3"
                                fill="none"
                              />
                              {/* Direction Arrow */}
                              <path
                                d={getArrowPath(line.points, line.direction || 'left-to-right')}
                                stroke={line.color}
                                strokeWidth="2"
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
                          ))
                        )}

                      {/* Current drawing line */}
                      {isDrawingLine && currentLine.length > 0 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <polyline
                            points={currentLine.map(p => `${p.x}%,${p.y}%`).join(' ')}
                            stroke={lineColor}
                            strokeWidth="3"
                            fill="none"
                          />
                          {currentLine.length > 1 && (
                            <path
                              d={getArrowPath(currentLine, lineDirection)}
                              stroke={lineColor}
                              strokeWidth="2"
                              fill="none"
                            />
                          )}
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

              {/* RIGHT SIDE - Analytics Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Analytics Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Analytics Type Selection */}
                  <div className="space-y-2">
                    <Label>Select Analytics to Configure</Label>
                    <Select value={selectedAnalyticForConfig} onValueChange={setSelectedAnalyticForConfig}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose analytics type" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedAnalytics.map(analyticId => {
                          const analytic = analytics.find(a => a.id === analyticId);
                          return analytic ? (
                            <SelectItem key={analyticId} value={analyticId}>
                              {analytic.name}
                            </SelectItem>
                          ) : null;
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Configuration Form for Selected Analytics */}
                  {selectedAnalyticForConfig && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <Label className="font-medium">
                        Configure {analytics.find(a => a.id === selectedAnalyticForConfig)?.name}
                      </Label>

                      {/* Line Drawing Configuration (for line-based analytics) */}
                      {analytics.find(a => a.id === selectedAnalyticForConfig)?.needsLines && (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Line Name</Label>
                            <Input
                              value={lineName}
                              onChange={(e) => setLineName(e.target.value)}
                              placeholder="Enter line name"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">Direction</Label>
                            <Select value={lineDirection} onValueChange={(value: typeof lineDirection) => setLineDirection(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left-to-right">Left to Right →</SelectItem>
                                <SelectItem value="right-to-left">Right to Left ←</SelectItem>
                                <SelectItem value="top-to-bottom">Top to Bottom ↓</SelectItem>
                                <SelectItem value="bottom-to-top">Bottom to Top ↑</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedAnalyticForConfig === 'in-out-counting' && (
                            <div className="space-y-2">
                              <Label className="text-sm">Count Type</Label>
                              <Select value={countType} onValueChange={(value: typeof countType) => setCountType(value)}>
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
                            disabled={!lineName || isDrawingLine}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Start Drawing Line
                          </Button>
                        </div>
                      )}

                      {/* Saved Positions List */}
                      <div className="space-y-3">
                        <Label>Saved Positions</Label>
                        
                        {ptzPositions.filter(pos => pos.analyticsType === selectedAnalyticForConfig).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No positions saved for this analytics</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {ptzPositions
                              .filter(pos => pos.analyticsType === selectedAnalyticForConfig)
                              .map((position, index) => (
                                <div key={position.id} className="p-3 border rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{index + 1}</Badge>
                                      <span className="font-medium">{position.name}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => deletePosition(position.id)}>
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  
                                  {cameraData.isPTZ && (
                                    <div className="text-xs text-muted-foreground mb-2">
                                      Pan: {position.position.pan}° | Tilt: {position.position.tilt}° | Zoom: {position.zoom}x
                                    </div>
                                  )}

                                  {position.analyticsLines.length > 0 && (
                                    <div className="text-xs text-muted-foreground mb-2">
                                      Lines: {position.analyticsLines.map(line => line.name).join(', ')}
                                    </div>
                                  )}

                                  {/* Schedule Management */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-sm">Schedules ({position.schedules.length})</Label>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => {
                                          setCurrentSchedule({
                                            id: position.id,
                                            name: `Schedule ${position.schedules.length + 1}`,
                                            startTime: '09:00',
                                            endTime: '17:00',
                                            daysOfWeek: [],
                                            enabled: true
                                          });
                                          setIsScheduleModalOpen(true);
                                        }}
                                      >
                                        <Clock className="h-3 w-3 mr-1" />
                                        Add Schedule
                                      </Button>
                                    </div>

                                    {position.schedules.map(schedule => (
                                      <div key={schedule.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
                                        <Checkbox
                                          checked={schedule.enabled}
                                          onCheckedChange={(checked) => {
                                            setPtzPositions(prev => prev.map(pos => 
                                              pos.id === position.id 
                                                ? {
                                                    ...pos, 
                                                    schedules: pos.schedules.map(s => 
                                                      s.id === schedule.id ? { ...s, enabled: checked as boolean } : s
                                                    )
                                                  }
                                                : pos
                                            ));
                                          }}
                                        />
                                        <span className="flex-1">{schedule.name}</span>
                                        <span>{schedule.startTime}-{schedule.endTime}</span>
                                        <span className="text-blue-600">
                                          {schedule.daysOfWeek.length === 7 ? 'Daily' : 
                                           schedule.daysOfWeek.length === 0 ? 'No days' :
                                           schedule.daysOfWeek.length <= 3 ? schedule.daysOfWeek.join(', ') : 
                                           `${schedule.daysOfWeek.length} days`}
                                        </span>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => deleteSchedule(position.id, schedule.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

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
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
                          {analytic.needsLines && <Navigation className="h-3 w-3" />}
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
        position: { pan: 0, tilt: 0 },
        zoom: 1,
        analyticsType: '',
        analyticsLines: [],
        schedules: [],
        isLocked: true
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
          Step: {currentStep === 'camera' ? 'Camera Configuration' : 'Analytics Configuration'}
        </div>
      </div>
      
      {renderStepContent()}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96 max-w-full">
            <CardHeader>
              <CardTitle>Add Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Schedule Name</Label>
                <Input
                  value={currentSchedule.name}
                  onChange={(e) => setCurrentSchedule({...currentSchedule, name: e.target.value})}
                  placeholder="Enter schedule name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={currentSchedule.startTime}
                    onChange={(e) => setCurrentSchedule({...currentSchedule, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={currentSchedule.endTime}
                    onChange={(e) => setCurrentSchedule({...currentSchedule, endTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Days of Week</Label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={currentSchedule.daysOfWeek.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCurrentSchedule({
                              ...currentSchedule,
                              daysOfWeek: [...currentSchedule.daysOfWeek, day]
                            });
                          } else {
                            setCurrentSchedule({
                              ...currentSchedule,
                              daysOfWeek: currentSchedule.daysOfWeek.filter(d => d !== day)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={day} className="text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => addScheduleToPosition(currentSchedule.id)}>
                  Add Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
