
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { Camera, TestTube, Settings, MapPin, Network, Eye, ArrowLeft, ArrowRight, RotateCw, Users, Target, Plus, Trash2, Clock, ZoomIn, ZoomOut, Save } from "lucide-react";
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
  analyticsType: string;
  position: { pan: number; tilt: number; zoom: number };
  schedule: {
    timeSlots: Array<{ start: string; end: string; days: string[] }>;
  };
  analyticsLines: AnalyticsLine[];
  locked: boolean;
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
  const [selectedAnalyticsType, setSelectedAnalyticsType] = useState<string>('');
  const [savedPositions, setSavedPositions] = useState<PTZPosition[]>([]);
  
  // PTZ Configuration states (for current position being set)
  const [currentPTZ, setCurrentPTZ] = useState({ pan: 0, tilt: 0, zoom: 1 });
  const [isLocationLocked, setIsLocationLocked] = useState(false);
  
  // Line drawing states
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [lineColor, setLineColor] = useState('#ff0000');
  const [lineName, setLineName] = useState('');
  const [lineDirection, setLineDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [countType, setCountType] = useState<'people' | 'vehicles' | 'objects'>('people');
  
  // Schedule states
  const [scheduleSlots, setScheduleSlots] = useState<Array<{ start: string; end: string; days: string[] }>>([]);
  const [newTimeSlot, setNewTimeSlot] = useState({ start: '09:00', end: '17:00', days: [] as string[] });

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
      // Clear current configuration if deselecting current type
      if (selectedAnalyticsType === analyticsId) {
        resetCurrentConfiguration();
      }
    }
  };

  const resetCurrentConfiguration = () => {
    setSelectedAnalyticsType('');
    setIsLocationLocked(false);
    setIsDrawingLine(false);
    setCurrentLine([]);
    setLineName('');
    setScheduleSlots([]);
    setCurrentPTZ({ pan: 0, tilt: 0, zoom: 1 });
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
  const handlePTZChange = (axis: 'pan' | 'tilt' | 'zoom', value: number) => {
    if (!isLocationLocked) {
      setCurrentPTZ(prev => ({ ...prev, [axis]: value }));
    }
  };

  const lockLocation = () => {
    if (selectedAnalyticsType) {
      setIsLocationLocked(true);
    }
  };

  const unlockLocation = () => {
    setIsLocationLocked(false);
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
    if (!lineName || !isLocationLocked) return;
    setIsDrawingLine(true);
    setCurrentLine([]);
  };

  const finishLine = () => {
    if (currentLine.length < 2) return;
    setIsDrawingLine(false);
  };

  // Schedule Functions
  const addTimeSlot = () => {
    if (newTimeSlot.days.length === 0) return;
    
    // Validate time overlap
    const hasOverlap = scheduleSlots.some(slot => 
      slot.days.some(day => newTimeSlot.days.includes(day)) &&
      ((newTimeSlot.start >= slot.start && newTimeSlot.start < slot.end) ||
       (newTimeSlot.end > slot.start && newTimeSlot.end <= slot.end))
    );

    if (hasOverlap) {
      alert('Time slot overlaps with existing schedule');
      return;
    }

    if (scheduleSlots.length >= 5) {
      alert('Maximum 5 time slots allowed');
      return;
    }

    setScheduleSlots(prev => [...prev, { ...newTimeSlot }]);
    setNewTimeSlot({ start: '09:00', end: '17:00', days: [] });
  };

  const removeTimeSlot = (index: number) => {
    setScheduleSlots(prev => prev.filter((_, i) => i !== index));
  };

  const handleDayChange = (day: string, checked: boolean) => {
    setNewTimeSlot(prev => ({
      ...prev,
      days: checked 
        ? [...prev.days, day]
        : prev.days.filter(d => d !== day)
    }));
  };

  // Save Configuration
  const saveCurrentConfiguration = () => {
    const selectedAnalytic = analytics.find(a => a.id === selectedAnalyticsType);
    if (!selectedAnalytic) return;

    // Validation
    if (cameraData.isPTZ && !isLocationLocked) {
      alert('Please lock the PTZ location first');
      return;
    }

    if (selectedAnalytic.needsLines && (currentLine.length < 2 || !lineName)) {
      alert('Please draw and name the line first');
      return;
    }

    if (cameraData.isPTZ && scheduleSlots.length === 0) {
      alert('Please add at least one time slot for PTZ scheduling');
      return;
    }

    // Create new position
    const newPosition: PTZPosition = {
      id: Date.now().toString(),
      name: `${selectedAnalytic.name} - Position ${savedPositions.filter(p => p.analyticsType === selectedAnalyticsType).length + 1}`,
      analyticsType: selectedAnalyticsType,
      position: { ...currentPTZ },
      schedule: { timeSlots: [...scheduleSlots] },
      analyticsLines: selectedAnalytic.needsLines ? [{
        id: Date.now().toString(),
        type: selectedAnalyticsType as 'border-jumping' | 'in-out-counting',
        name: lineName,
        points: currentLine,
        color: lineColor,
        ...(selectedAnalyticsType === 'in-out-counting' && {
          direction: lineDirection,
          countType: countType
        })
      }] : [],
      locked: true
    };

    setSavedPositions(prev => [...prev, newPosition]);
    resetCurrentConfiguration();
    alert('Configuration saved successfully!');
  };

  const deletePosition = (id: string) => {
    setSavedPositions(prev => prev.filter(p => p.id !== id));
  };

  const handleAddCamera = () => {
    console.log('Adding camera:', { cameraData, selectedAnalytics, savedPositions });
  };

  const selectedAnalytic = analytics.find(a => a.id === selectedAnalyticsType);
  const needsLines = selectedAnalytic?.needsLines || false;
  const filteredPositions = savedPositions.filter(p => p.analyticsType === selectedAnalyticsType);

  const canSave = () => {
    if (!selectedAnalyticsType) return false;
    if (cameraData.isPTZ && !isLocationLocked) return false;
    if (needsLines && (currentLine.length < 2 || !lineName)) return false;
    if (cameraData.isPTZ && scheduleSlots.length === 0) return false;
    return true;
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
                <h3 className="font-semibold">{cameraData.name || 'Unnamed Camera'}</h3>
                <p className="text-sm text-muted-foreground">{cameraData.ip}</p>
              </div>
              <Badge variant={cameraData.isPTZ ? "default" : "secondary"}>
                {cameraData.isPTZ ? "PTZ Camera" : "Fixed Camera"}
              </Badge>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* LEFT SIDE - Camera View Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Camera View Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      
                      {/* Display current drawing line */}
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

                      {/* Display saved lines for current analytic */}
                      {filteredPositions.map(position => 
                        position.analyticsLines.map(line => (
                          <svg key={line.id} className="absolute inset-0 w-full h-full pointer-events-none">
                            <polyline
                              points={line.points.map(p => `${p.x}%,${p.y}%`).join(' ')}
                              stroke={line.color}
                              strokeWidth="3"
                              fill="none"
                              opacity="0.7"
                            />
                          </svg>
                        ))
                      )}
                    </div>
                  </div>

                  {/* PTZ Controls (only for PTZ cameras) */}
                  {cameraData.isPTZ && selectedAnalyticsType && (
                    <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <Label className="font-medium">PTZ Position Control</Label>
                        <Badge variant={isLocationLocked ? "default" : "outline"}>
                          {isLocationLocked ? "Locked" : "Unlocked"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Pan</Label>
                          <Input
                            type="number"
                            value={currentPTZ.pan}
                            onChange={(e) => handlePTZChange('pan', Number(e.target.value))}
                            min="-180"
                            max="180"
                            disabled={isLocationLocked}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Tilt</Label>
                          <Input
                            type="number"
                            value={currentPTZ.tilt}
                            onChange={(e) => handlePTZChange('tilt', Number(e.target.value))}
                            min="-90"
                            max="90"
                            disabled={isLocationLocked}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Zoom</Label>
                          <Input
                            type="number"
                            value={currentPTZ.zoom}
                            onChange={(e) => handlePTZChange('zoom', Number(e.target.value))}
                            min="1"
                            max="10"
                            step="0.1"
                            disabled={isLocationLocked}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!isLocationLocked ? (
                          <Button onClick={lockLocation} size="sm" disabled={!selectedAnalyticsType}>
                            <Target className="h-4 w-4 mr-1" />
                            Lock Location
                          </Button>
                        ) : (
                          <Button onClick={unlockLocation} size="sm" variant="outline">
                            Unlock Location
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Line Drawing Controls (only for line-based analytics) */}
                  {needsLines && (isLocationLocked || !cameraData.isPTZ) && (
                    <div className="space-y-3 p-3 bg-green-50 rounded-lg">
                      <Label className="font-medium">Line Drawing</Label>
                      
                      <div className="grid grid-cols-2 gap-4">
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
                      </div>

                      {selectedAnalyticsType === 'in-out-counting' && (
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                      )}

                      <div className="flex gap-2">
                        {!isDrawingLine ? (
                          <Button onClick={startDrawingLine} size="sm" disabled={!lineName}>
                            <Plus className="h-4 w-4 mr-1" />
                            Start Drawing
                          </Button>
                        ) : (
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
                        )}
                      </div>

                      {isDrawingLine && (
                        <p className="text-sm text-muted-foreground">
                          Click on the video to draw line points. Need at least 2 points.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Schedule Configuration (only for PTZ cameras) */}
                  {cameraData.isPTZ && selectedAnalyticsType && isLocationLocked && (
                    <div className="space-y-3 p-3 bg-yellow-50 rounded-lg">
                      <Label className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Schedule Configuration
                      </Label>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Start Time</Label>
                          <Input
                            type="time"
                            value={newTimeSlot.start}
                            onChange={(e) => setNewTimeSlot(prev => ({ ...prev, start: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">End Time</Label>
                          <Input
                            type="time"
                            value={newTimeSlot.end}
                            onChange={(e) => setNewTimeSlot(prev => ({ ...prev, end: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Days of Week</Label>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map(day => (
                            <div key={day} className="flex items-center space-x-1">
                              <Checkbox
                                id={day}
                                checked={newTimeSlot.days.includes(day)}
                                onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                              />
                              <Label htmlFor={day} className="text-xs">{day.slice(0, 3)}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={addTimeSlot} size="sm" disabled={newTimeSlot.days.length === 0}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Time Slot
                      </Button>

                      {scheduleSlots.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm">Current Schedule ({scheduleSlots.length}/5)</Label>
                          {scheduleSlots.map((slot, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
                              <span>{slot.start} - {slot.end} | {slot.days.join(', ')}</span>
                              <Button variant="ghost" size="sm" onClick={() => removeTimeSlot(index)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Save Configuration Button */}
                  <Button 
                    onClick={saveCurrentConfiguration} 
                    className="w-full"
                    disabled={!canSave()}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
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
                  {/* Analytics Type Selection Dropdown */}
                  <div className="space-y-2">
                    <Label>Select Analytics Type</Label>
                    <Select value={selectedAnalyticsType} onValueChange={setSelectedAnalyticsType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose analytics to configure" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedAnalytics.map(analyticsId => {
                          const analytic = analytics.find(a => a.id === analyticsId);
                          return analytic ? (
                            <SelectItem key={analytic.id} value={analytic.id}>
                              {analytic.name}
                            </SelectItem>
                          ) : null;
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Analytics Info */}
                  {selectedAnalytic && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">{selectedAnalytic.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedAnalytic.description}</p>
                      {selectedAnalytic.needsLines && (
                        <Badge variant="outline" className="mt-2">Requires Line Drawing</Badge>
                      )}
                    </div>
                  )}

                  {/* Saved Positions List */}
                  {selectedAnalyticsType && (
                    <div className="space-y-3">
                      <Label>Saved Positions ({filteredPositions.length})</Label>
                      
                      {filteredPositions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No positions saved for this analytics type</p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {filteredPositions.map((position, index) => (
                            <div key={position.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{position.name}</span>
                                <Button variant="ghost" size="sm" onClick={() => deletePosition(position.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              {cameraData.isPTZ && (
                                <div className="text-xs text-muted-foreground mb-2">
                                  Pan: {position.position.pan}° | Tilt: {position.position.tilt}° | Zoom: {position.position.zoom}x
                                </div>
                              )}
                              
                              {position.analyticsLines.length > 0 && (
                                <div className="text-xs text-muted-foreground mb-2">
                                  Lines: {position.analyticsLines.map(line => line.name).join(', ')}
                                </div>
                              )}
                              
                              {cameraData.isPTZ && position.schedule.timeSlots.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Schedule: {position.schedule.timeSlots.length} time slot(s)
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Analytics Selection (Bottom) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Analytics Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {analytics.map((analytic) => (
                    <div key={analytic.id} className="flex items-center space-x-2 p-2 border rounded">
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
                Back to Camera
              </Button>
              <Button onClick={handleAddCamera} disabled={selectedAnalytics.length === 0}>
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Camera</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Step: {currentStep === 'camera' ? 'Camera Configuration' : 'Analytics Configuration'}
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
