
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Camera, Settings, ArrowLeft, Target, Plus, Trash2, Clock, ZoomIn, ZoomOut, Navigation } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface Point {
  x: number;
  y: number;
}

interface AnalyticsLine {
  id: string;
  type: 'border-jumping' | 'in-out-counting' | 'loitering';
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

const ConfigureAnalytics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cameraData, selectedAnalytics } = location.state || {};

  // States
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

  // Schedule states (only for PTZ cameras)
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
    { id: 'frs', name: 'Face Recognition System (FRS)', needsLines: false },
    { id: 'object-detection', name: 'Object Detection', needsLines: false },
    { id: 'anpr', name: 'ANPR (License Plate Recognition)', needsLines: false },
    { id: 'border-jumping', name: 'Border Jumping Detection', needsLines: true },
    { id: 'in-out-counting', name: 'In/Out Counting', needsLines: true },
    { id: 'crowd-analysis', name: 'Crowd Analysis', needsLines: false },
    { id: 'loitering', name: 'Loitering Detection', needsLines: true }
  ];

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (!cameraData || !selectedAnalytics) {
      navigate('/camera-management/add');
    }
  }, [cameraData, selectedAnalytics, navigate]);

  // PTZ Control Functions (only for PTZ cameras)
  const handlePTZMove = (direction: string) => {
    if (!cameraData?.isPTZ) return;
    
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
    if (!cameraData?.isPTZ) return;
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
      type: selectedAnalyticForConfig as 'border-jumping' | 'in-out-counting' | 'loitering',
      name: lineName,
      points: currentLine,
      color: lineColor,
      direction: lineDirection,
      ...(selectedAnalyticForConfig === 'in-out-counting' && { countType })
    };

    if (cameraData?.isPTZ) {
      // For PTZ, lines are saved with position
      setCurrentLine([]);
      setIsDrawingLine(false);
      setLineName('');
    } else {
      // For static cameras, save directly without scheduling
      const staticPosition: PTZPosition = {
        id: 'static-' + Date.now(),
        name: `Static ${selectedAnalytic.name}`,
        position: { pan: 0, tilt: 0 },
        zoom: 1,
        analyticsType: selectedAnalyticForConfig,
        analyticsLines: [newLine],
        schedules: [], // No schedules for static cameras
        isLocked: true
      };
      setPtzPositions(prev => [...prev, staticPosition]);
      setCurrentLine([]);
      setIsDrawingLine(false);
      setLineName('');
    }
  };

  const lockPTZPosition = () => {
    if (!cameraData?.isPTZ) return;
    if (!positionName) {
      alert('Please enter a position name');
      return;
    }

    const selectedAnalytic = analytics.find(a => a.id === selectedAnalyticForConfig);
    if (!selectedAnalytic) return;

    const lines = currentLine.length >= 2 && selectedAnalytic.needsLines ? [{
      id: Date.now().toString(),
      type: selectedAnalyticForConfig as 'border-jumping' | 'in-out-counting' | 'loitering',
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
    if (!cameraData?.isPTZ) return; // Only for PTZ cameras
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
    
    let arrowAngle = Math.atan2(lastPoint.y - secondLastPoint.y, lastPoint.x - secondLastPoint.x);
    
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

  const handleSaveConfiguration = () => {
    console.log('Saving camera configuration:', { cameraData, selectedAnalytics, ptzPositions });
    // Navigate back or to success page
    navigate('/camera-management');
  };

  if (!cameraData || !selectedAnalytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configure Analytics</h1>
        <Badge variant="outline">
          {cameraData.name} ({cameraData.isPTZ ? 'PTZ' : 'Static'})
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT SIDE - HD Camera View */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              HD Camera View
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* PTZ Controls (only for PTZ cameras) */}
            {cameraData.isPTZ && selectedAnalyticForConfig && (
              <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
                <Label className="font-medium">PTZ Controls</Label>
                
                <div className="flex flex-col items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlePTZMove('up')}>↑</Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePTZMove('left')}>←</Button>
                    <Button variant="outline" size="sm" onClick={() => handlePTZMove('right')}>→</Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handlePTZMove('down')}>↓</Button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm text-center">
                  <div>Pan: {currentPTZ.pan}°</div>
                  <div>Tilt: {currentPTZ.tilt}°</div>
                  <div>Zoom: {currentPTZ.zoom}x</div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleZoomChange(currentPTZ.zoom - 1)}>
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-sm w-12 text-center">{currentPTZ.zoom}x</span>
                  <Button variant="outline" size="sm" onClick={() => handleZoomChange(currentPTZ.zoom + 1)}>
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Position name"
                    value={positionName}
                    onChange={(e) => setPositionName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={lockPTZPosition} size="sm" disabled={!positionName}>
                    <Target className="h-4 w-4 mr-1" />
                    Lock Position
                  </Button>
                </div>
              </div>
            )}

            {/* HD Camera Frame */}
            <div className="relative border rounded-lg overflow-hidden">
              <div 
                className={`relative ${isDrawingLine ? 'cursor-crosshair' : 'cursor-default'}`}
                onClick={handleCanvasClick}
                style={{ aspectRatio: '16/9', minHeight: '400px' }}
              >
                <div className="w-full h-full bg-black flex items-center justify-center text-white text-lg">
                  HD Camera Feed ({cameraData.resolution})
                </div>
                
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

            {isDrawingLine && (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <p className="text-sm">Drawing "{lineName}" - Click points to create line</p>
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
            <div className="space-y-2">
              <Label>Select Analytics to Configure</Label>
              <Select value={selectedAnalyticForConfig} onValueChange={setSelectedAnalyticForConfig}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose analytics type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedAnalytics.map((analyticId: string) => {
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

                            {/* Schedule Management (only for PTZ cameras) */}
                            {cameraData.isPTZ && (
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
                            )}
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

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => navigate('/camera-management/add')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Camera Setup
        </Button>
        <Button onClick={handleSaveConfiguration}>
          <Camera className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      {/* Schedule Modal (only for PTZ cameras) */}
      {cameraData.isPTZ && isScheduleModalOpen && (
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
    </div>
  );
};

export default ConfigureAnalytics;
