import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Camera, Settings, ArrowLeft, Target, Plus, Trash2, Clock, ZoomIn, ZoomOut, Eye, EyeOff } from "lucide-react";
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
  visible?: boolean;
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

  const toggleLineVisibility = (positionId: string, lineId: string) => {
    setPtzPositions(prev => prev.map(pos => 
      pos.id === positionId 
        ? {
            ...pos, 
            analyticsLines: pos.analyticsLines.map(line => 
              line.id === lineId ? { ...line, visible: !line.visible } : line
            )
          }
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT SIDE - HD Camera View (Full 1280x720) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              HD Camera View (1280x720)
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

            {/* HD Camera Frame - Full 1280x720 */}
            <div className="relative border-2 rounded-lg overflow-hidden shadow-lg">
              <div 
                className={`relative ${isDrawingLine ? 'cursor-crosshair' : 'cursor-default'}`}
                onClick={handleCanvasClick}
                style={{ 
                  width: '1280px', 
                  height: '720px',
                  maxWidth: '100%',
                  aspectRatio: '1280/720'
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white text-xl font-semibold border-4 border-gray-600">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📹</div>
                    <div>HD Camera Feed</div>
                    <div className="text-sm opacity-75 mt-1">1280 × 720</div>
                  </div>
                </div>
                
                {/* Display existing analytics lines */}
                {ptzPositions
                  .filter(pos => pos.analyticsType === selectedAnalyticForConfig)
                  .map(position => 
                    position.analyticsLines
                      .filter(line => line.visible !== false)
                      .map((line) => (
                        <svg key={line.id} className="absolute inset-0 w-full h-full pointer-events-none">
                          <polyline
                            points={line.points.map(p => `${p.x}%,${p.y}%`).join(' ')}
                            stroke={line.color}
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={line.type === 'loitering' ? '10,5' : 'none'}
                          />
                          <path
                            d={getArrowPath(line.points, line.direction || 'left-to-right')}
                            stroke={line.color}
                            strokeWidth="3"
                            fill="none"
                          />
                          {line.points.length > 0 && (
                            <text
                              x={`${line.points[0].x}%`}
                              y={`${line.points[0].y - 2}%`}
                              fill={line.color}
                              fontSize="16"
                              fontWeight="bold"
                              stroke="white"
                              strokeWidth="1"
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
                      strokeWidth="4"
                      fill="none"
                    />
                    {currentLine.length > 1 && (
                      <path
                        d={getArrowPath(currentLine, lineDirection)}
                        stroke={lineColor}
                        strokeWidth="3"
                        fill="none"
                      />
                    )}
                    {currentLine.map((point, index) => (
                      <circle
                        key={index}
                        cx={`${point.x}%`}
                        cy={`${point.y}%`}
                        r="4"
                        fill={lineColor}
                        stroke="white"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                )}
              </div>
            </div>

            {isDrawingLine && (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm font-medium">Drawing "{lineName}" - Click points to create line</p>
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
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Analytics</Label>
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
              <div className="space-y-4 p-3 border rounded-lg bg-gray-50">
                <Label className="font-medium text-sm">
                  Configure {analytics.find(a => a.id === selectedAnalyticForConfig)?.name}
                </Label>

                {/* Line Drawing Configuration */}
                {analytics.find(a => a.id === selectedAnalyticForConfig)?.needsLines && (
                  <div className="space-y-3 p-3 bg-white rounded border">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Line Setup</Label>
                      <Input
                        value={lineName}
                        onChange={(e) => setLineName(e.target.value)}
                        placeholder="Line name"
                        className="text-sm h-8"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Direction</Label>
                        <Select value={lineDirection} onValueChange={(value: typeof lineDirection) => setLineDirection(value)}>
                          <SelectTrigger className="text-xs h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left-to-right">Left→Right</SelectItem>
                            <SelectItem value="right-to-left">Right→Left</SelectItem>
                            <SelectItem value="top-to-bottom">Top→Bottom</SelectItem>
                            <SelectItem value="bottom-to-top">Bottom→Top</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedAnalyticForConfig === 'in-out-counting' && (
                        <div className="space-y-1">
                          <Label className="text-xs">Count Type</Label>
                          <Select value={countType} onValueChange={(value: typeof countType) => setCountType(value)}>
                            <SelectTrigger className="text-xs h-8">
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
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Color</Label>
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

                    <Button
                      onClick={startDrawingLine}
                      disabled={!lineName || isDrawingLine}
                      className="w-full h-8 text-xs"
                      size="sm"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Start Drawing
                    </Button>
                  </div>
                )}

                {/* Saved Lines List - Better UI */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Saved Lines</Label>
                    <Badge variant="secondary" className="text-xs">
                      {ptzPositions.filter(pos => pos.analyticsType === selectedAnalyticForConfig).reduce((acc, pos) => acc + pos.analyticsLines.length, 0)}
                    </Badge>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto space-y-1 border rounded p-2 bg-white">
                    {ptzPositions
                      .filter(pos => pos.analyticsType === selectedAnalyticForConfig)
                      .map((position) => 
                        position.analyticsLines.map((line, lineIndex) => (
                          <div key={line.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs border">
                            <div 
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: line.color }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{line.name}</div>
                              <div className="text-gray-500 text-xs">
                                {line.direction?.replace('-', '→')} | {line.points.length} points
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleLineVisibility(position.id, line.id)}
                              className="h-6 w-6 p-0"
                            >
                              {line.visible !== false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setPtzPositions(prev => prev.map(pos => 
                                  pos.id === position.id 
                                    ? { ...pos, analyticsLines: pos.analyticsLines.filter(l => l.id !== line.id) }
                                    : pos
                                ));
                              }}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    
                    {ptzPositions.filter(pos => pos.analyticsType === selectedAnalyticForConfig).reduce((acc, pos) => acc + pos.analyticsLines.length, 0) === 0 && (
                      <div className="text-center text-gray-400 py-4 text-xs">
                        No lines saved yet
                      </div>
                    )}
                  </div>
                </div>

                {/* PTZ Positions and Schedules (only for PTZ cameras) */}
                {cameraData.isPTZ && ptzPositions.filter(pos => pos.analyticsType === selectedAnalyticForConfig).length > 0 && (
                  <div className="space-y-2 p-3 bg-blue-50 rounded border">
                    <Label className="text-xs font-medium">PTZ Schedules</Label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {ptzPositions
                        .filter(pos => pos.analyticsType === selectedAnalyticForConfig)
                        .map((position) => (
                          <div key={position.id} className="p-2 bg-white rounded border text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium truncate">{position.name}</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-5 text-xs px-2"
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
                                <Clock className="h-2 w-2 mr-1" />
                                Add
                              </Button>
                            </div>
                            
                            {position.schedules.map(schedule => (
                              <div key={schedule.id} className="flex items-center gap-1 p-1 bg-gray-50 rounded text-xs">
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
                                  className="h-3 w-3"
                                />
                                <span className="flex-1 truncate">{schedule.name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => deleteSchedule(position.id, schedule.id)}
                                  className="h-4 w-4 p-0 text-red-500"
                                >
                                  <Trash2 className="h-2 w-2" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
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
