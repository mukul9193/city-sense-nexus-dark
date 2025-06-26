import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef, useEffect } from "react";
import { RotateCw, MapPin, Clock, Plus, Trash2, Move, Target, Users } from "lucide-react";

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
  // For in-out counting
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

interface PTZConfigurationProps {
  frameUrl: string;
  selectedAnalytics: string[];
  onConfigurationComplete?: () => void;
}

const PTZConfiguration = ({ frameUrl, selectedAnalytics, onConfigurationComplete }: PTZConfigurationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ptzPositions, setPtzPositions] = useState<PTZPosition[]>([]);
  const [ptzSchedules, setPtzSchedules] = useState<PTZSchedule[]>([]);
  const [isSettingPosition, setIsSettingPosition] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');
  const [selectedZoom, setSelectedZoom] = useState('1');
  
  // Line drawing states
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [selectedAnalyticType, setSelectedAnalyticType] = useState<'border-jumping' | 'in-out-counting'>('border-jumping');
  const [lineColor, setLineColor] = useState('#ff0000');
  const [lineName, setLineName] = useState('');
  
  // In-out counting specific states
  const [lineDirection, setLineDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [countType, setCountType] = useState<'people' | 'vehicles' | 'objects'>('people');

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isSettingPosition && newPositionName) {
      const newPosition: PTZPosition = {
        id: Date.now().toString(),
        name: newPositionName,
        position: { x, y },
        zoom: parseInt(selectedZoom),
        analyticsLines: []
      };
      setPtzPositions(prev => [...prev, newPosition]);
      setNewPositionName('');
      setIsSettingPosition(false);
    } else if (isDrawingLine && selectedPosition) {
      setCurrentLine(prev => [...prev, { x, y }]);
    }
  };

  const startDrawingLine = () => {
    if (!selectedPosition || !lineName) return;
    setIsDrawingLine(true);
    setCurrentLine([]);
  };

  const finishLine = () => {
    if (currentLine.length < 2 || !selectedPosition) return;

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

    setPtzPositions(prev => prev.map(pos => 
      pos.id === selectedPosition 
        ? { ...pos, analyticsLines: [...pos.analyticsLines, newLine] }
        : pos
    ));

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

  const deletePosition = (id: string) => {
    setPtzPositions(prev => prev.filter(position => position.id !== id));
  };

  const selectedPositionData = ptzPositions.find(pos => pos.id === selectedPosition);
  const availableAnalytics = selectedAnalytics.filter(a => ['border-jumping', 'in-out-counting'].includes(a));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCw className="h-5 w-5" />
            PTZ Camera Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Frame with Position Markers and Analytics Lines */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Camera View & Position Setup</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Position name"
                  value={newPositionName}
                  onChange={(e) => setNewPositionName(e.target.value)}
                  className="w-32"
                />
                <Select value={selectedZoom} onValueChange={setSelectedZoom}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                    <SelectItem value="3">3x</SelectItem>
                    <SelectItem value="4">4x</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant={isSettingPosition ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsSettingPosition(!isSettingPosition)}
                  disabled={!newPositionName}
                >
                  <Target className="h-4 w-4 mr-1" />
                  {isSettingPosition ? 'Click on frame' : 'Set Position'}
                </Button>
              </div>
            </div>
            
            <div className="relative border rounded-lg overflow-hidden">
              <div 
                className={`relative ${isSettingPosition || isDrawingLine ? 'cursor-crosshair' : 'cursor-default'}`}
                onClick={handleCanvasClick}
                style={{ aspectRatio: '16/9' }}
              >
                {frameUrl ? (
                  <img 
                    src={frameUrl} 
                    alt="Camera Frame" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="aspect-video bg-black flex items-center justify-center text-white">
                    No camera frame available
                  </div>
                )}
                
                {/* Position Markers */}
                {ptzPositions.map((position) => (
                  <div key={position.id}>
                    <div
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${position.position.x}%`,
                        top: `${position.position.y}%`
                      }}
                    >
                      <div className="relative group">
                        <div className={`w-4 h-4 border-2 border-white rounded-full shadow-lg ${selectedPosition === position.id ? 'bg-green-500' : 'bg-blue-500'}`} />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {position.name} ({position.zoom}x)
                        </div>
                      </div>
                    </div>

                    {/* Analytics Lines for this position */}
                    {selectedPosition === position.id && position.analyticsLines.map((line) => (
                      <svg key={line.id} className="absolute inset-0 w-full h-full pointer-events-none">
                        {line.type === 'in-out-counting' && line.points.length === 2 ? (
                          <g>
                            <line
                              x1={`${line.points[0].x}%`}
                              y1={`${line.points[0].y}%`}
                              x2={`${line.points[1].x}%`}
                              y2={`${line.points[1].y}%`}
                              stroke={line.color}
                              strokeWidth="3"
                            />
                            <text
                              x={`${(line.points[0].x + line.points[1].x) / 2}%`}
                              y={`${(line.points[0].y + line.points[1].y) / 2 - 2}%`}
                              fill={line.color}
                              fontSize="12"
                              textAnchor="middle"
                            >
                              {line.name}
                            </text>
                          </g>
                        ) : (
                          <g>
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
                              >
                                {line.name}
                              </text>
                            )}
                          </g>
                        )}
                      </svg>
                    ))}
                  </div>
                ))}

                {/* Current drawing line */}
                {isDrawingLine && currentLine.length > 0 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {selectedAnalyticType === 'in-out-counting' && currentLine.length === 2 ? (
                      <line
                        x1={`${currentLine[0].x}%`}
                        y1={`${currentLine[0].y}%`}
                        x2={`${currentLine[1].x}%`}
                        y2={`${currentLine[1].y}%`}
                        stroke={lineColor}
                        strokeWidth="3"
                      />
                    ) : (
                      <polyline
                        points={currentLine.map(p => `${p.x}%,${p.y}%`).join(' ')}
                        stroke={lineColor}
                        strokeWidth="3"
                        fill="none"
                      />
                    )}
                  </svg>
                )}
              </div>
            </div>
            
            {isSettingPosition && (
              <p className="text-sm text-muted-foreground">
                Click on the camera frame to set the PTZ position for "{newPositionName}"
              </p>
            )}

            {isDrawingLine && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {selectedAnalyticType === 'in-out-counting' 
                    ? `Drawing counting line "${lineName}" - Click 2 points to create line`
                    : `Drawing border line "${lineName}" - Click multiple points, then finish`
                  }
                </p>
                <Button onClick={finishLine} size="sm" disabled={currentLine.length < 2}>
                  Finish Line
                </Button>
              </div>
            )}
          </div>

          {/* Analytics Lines Configuration */}
          {availableAnalytics.length > 0 && ptzPositions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Analytics Lines for PTZ Positions</Label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select PTZ position" />
                  </SelectTrigger>
                  <SelectContent>
                    {ptzPositions.map((position) => (
                      <SelectItem key={position.id} value={position.id}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPosition && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Draw Analytics Lines</h4>
                    
                    <div className="space-y-2">
                      <Label>Analytics Type</Label>
                      <Select value={selectedAnalyticType} onValueChange={(value: 'border-jumping' | 'in-out-counting') => setSelectedAnalyticType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAnalytics.includes('border-jumping') && (
                            <SelectItem value="border-jumping">Border Jumping</SelectItem>
                          )}
                          {availableAnalytics.includes('in-out-counting') && (
                            <SelectItem value="in-out-counting">In/Out Counting</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Line Name</Label>
                      <Input
                        value={lineName}
                        onChange={(e) => setLineName(e.target.value)}
                        placeholder="Enter line name"
                      />
                    </div>

                    {selectedAnalyticType === 'in-out-counting' && (
                      <>
                        <div className="space-y-2">
                          <Label>Count Type</Label>
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
                          <Label>Direction</Label>
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
                      <Label>Line Color</Label>
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

                  <div className="space-y-3">
                    <h4 className="font-medium">Existing Lines</h4>
                    
                    {selectedPositionData && selectedPositionData.analyticsLines.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedPositionData.analyticsLines.map((line) => (
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
                              onClick={() => deleteAnalyticsLine(selectedPosition, line.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No analytics lines configured</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Saved Positions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Saved PTZ Positions ({ptzPositions.length})</Label>
            </div>
            
            {ptzPositions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No positions saved yet</p>
            ) : (
              <div className="grid gap-2">
                {ptzPositions.map((position) => (
                  <div key={position.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <div>
                        <span className="font-medium">{position.name}</span>
                        <p className="text-xs text-muted-foreground">
                          Position: {position.position.x.toFixed(1)}%, {position.position.y.toFixed(1)}% | Zoom: {position.zoom}x
                          {position.analyticsLines.length > 0 && ` | ${position.analyticsLines.length} analytics lines`}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Move className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deletePosition(position.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time-based PTZ Schedule
              </Label>
              <Button onClick={addSchedule} size="sm" disabled={ptzPositions.length === 0}>
                <Plus className="h-4 w-4 mr-1" />
                Add Schedule
              </Button>
            </div>

            {ptzSchedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {ptzPositions.length === 0 
                  ? "Create PTZ positions first to set up schedules" 
                  : "No schedules configured"}
              </p>
            ) : (
              <div className="space-y-3">
                {ptzSchedules.map((schedule) => (
                  <div key={schedule.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={schedule.enabled}
                          onCheckedChange={(checked) => updateSchedule(schedule.id, 'enabled', checked)}
                        />
                        <Input
                          value={schedule.name}
                          onChange={(e) => updateSchedule(schedule.id, 'name', e.target.value)}
                          className="w-40"
                        />
                        <Badge variant={schedule.enabled ? 'default' : 'secondary'}>
                          {schedule.enabled ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => deleteSchedule(schedule.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs">Start Time</Label>
                        <Input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) => updateSchedule(schedule.id, 'startTime', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">End Time</Label>
                        <Input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) => updateSchedule(schedule.id, 'endTime', e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">PTZ Position</Label>
                        <Select 
                          value={schedule.positionId} 
                          onValueChange={(value) => updateSchedule(schedule.id, 'positionId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            {ptzPositions.map((position) => (
                              <SelectItem key={position.id} value={position.id}>
                                {position.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PTZConfiguration;
