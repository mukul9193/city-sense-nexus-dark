
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useRef } from "react";
import { RotateCw, MapPin, Clock, Plus, Trash2, Move, Target } from "lucide-react";

interface PTZPosition {
  id: string;
  name: string;
  position: { x: number; y: number };
  zoom: number;
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
}

const PTZConfiguration = ({ frameUrl }: PTZConfigurationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ptzPositions, setPtzPositions] = useState<PTZPosition[]>([]);
  const [ptzSchedules, setPtzSchedules] = useState<PTZSchedule[]>([]);
  const [isSettingPosition, setIsSettingPosition] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');
  const [selectedZoom, setSelectedZoom] = useState('1');

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSettingPosition) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (newPositionName) {
      const newPosition: PTZPosition = {
        id: Date.now().toString(),
        name: newPositionName,
        position: { x, y },
        zoom: parseInt(selectedZoom)
      };
      setPtzPositions(prev => [...prev, newPosition]);
      setNewPositionName('');
      setIsSettingPosition(false);
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

  const deletePosition = (id: string) => {
    setPtzPositions(prev => prev.filter(position => position.id !== id));
  };

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
          {/* Frame with Position Markers */}
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
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`w-full h-auto ${isSettingPosition ? 'cursor-crosshair' : 'cursor-default'}`}
                style={{ maxHeight: '400px', aspectRatio: '16/9' }}
              />
              {frameUrl ? (
                <img 
                  src={frameUrl} 
                  alt="Camera Frame" 
                  className="w-full h-auto"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center text-white">
                  No camera frame available
                </div>
              )}
              
              {/* Position Markers */}
              {ptzPositions.map((position) => (
                <div
                  key={position.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${position.position.x}%`,
                    top: `${position.position.y}%`
                  }}
                >
                  <div className="relative group">
                    <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {position.name} ({position.zoom}x)
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {isSettingPosition && (
              <p className="text-sm text-muted-foreground">
                Click on the camera frame to set the PTZ position for "{newPositionName}"
              </p>
            )}
          </div>

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
