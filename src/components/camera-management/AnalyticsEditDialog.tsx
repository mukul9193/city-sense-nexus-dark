import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Camera as CameraType } from "@/lib/types";
import { useState, useRef } from "react";
import { 
  Brain, 
  Eye, 
  Car, 
  Shield, 
  Plus, 
  Trash2, 
  Save,
  Users,
  Target,
  Activity,
  Camera
} from "lucide-react";

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

interface AnalyticsEditDialogProps {
  camera: CameraType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnalyticsEditDialog = ({ camera, open, onOpenChange }: AnalyticsEditDialogProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedAnalytics, setSelectedAnalytics] = useState<string[]>([]);
  const [analyticsLines, setAnalyticsLines] = useState<AnalyticsLine[]>([]);
  
  // Line drawing states
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [selectedAnalyticType, setSelectedAnalyticType] = useState<'border-jumping' | 'in-out-counting'>('border-jumping');
  const [lineColor, setLineColor] = useState('#ff0000');
  const [lineName, setLineName] = useState('');
  const [lineDirection, setLineDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [countType, setCountType] = useState<'people' | 'vehicles' | 'objects'>('people');

  const analyticsOptions = [
    { id: 'face-recognition', name: 'Face Recognition', icon: Users, color: 'blue' },
    { id: 'object-detection', name: 'Object Detection', icon: Eye, color: 'green' },
    { id: 'anpr', name: 'ANPR (License Plates)', icon: Car, color: 'purple' },
    { id: 'border-jumping', name: 'Border Jumping', icon: Shield, color: 'red' },
    { id: 'in-out-counting', name: 'In/Out Counting', icon: Activity, color: 'orange' },
  ];

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  const handleAnalyticsToggle = (analyticId: string) => {
    setSelectedAnalytics(prev => 
      prev.includes(analyticId) 
        ? prev.filter(id => id !== analyticId)
        : [...prev, analyticId]
    );
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingLine) return;
    
    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCurrentLine(prev => [...prev, { x, y }]);
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

    setAnalyticsLines(prev => [...prev, newLine]);
    setCurrentLine([]);
    setIsDrawingLine(false);
    setLineName('');
  };

  const deleteAnalyticsLine = (lineId: string) => {
    setAnalyticsLines(prev => prev.filter(line => line.id !== lineId));
  };

  const handleSave = () => {
    console.log('Saving analytics configuration:', {
      camera: camera?.id,
      analytics: selectedAnalytics,
      lines: analyticsLines
    });
    onOpenChange(false);
  };

  const needsLineDrawing = selectedAnalytics.includes('border-jumping') || selectedAnalytics.includes('in-out-counting');

  if (!camera) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Configure Analytics - {camera.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Analytics Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Analytics Modules</Label>
            <div className="grid grid-cols-2 gap-3">
              {analyticsOptions.map((analytic) => {
                const Icon = analytic.icon;
                const isSelected = selectedAnalytics.includes(analytic.id);
                
                return (
                  <div
                    key={analytic.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAnalyticsToggle(analytic.id)}
                  >
                    <Checkbox checked={isSelected} />
                    <Icon className={`h-5 w-5 text-${analytic.color}-500`} />
                    <span className="font-medium">{analytic.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Camera Frame for Line Drawing */}
          {needsLineDrawing && (
            <div className="space-y-4">
              <Label className="text-base font-medium">Configure Detection Areas</Label>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Camera Frame */}
                <div className="space-y-3">
                  <Label>Camera View</Label>
                  <div 
                    className={`relative border rounded-lg overflow-hidden ${isDrawingLine ? 'cursor-crosshair' : 'cursor-default'}`}
                    onClick={handleCanvasClick}
                    style={{ aspectRatio: '16/9' }}
                  >
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                      <Camera className="h-12 w-12 opacity-50" />
                    </div>
                    
                    {/* Existing Lines */}
                    {analyticsLines.map((line) => (
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
                    ))}

                    {/* Current Drawing Line */}
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
                  
                  {isDrawingLine && (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Drawing "{lineName}" - Click multiple points to create the line
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
                </div>

                {/* Line Configuration */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Draw Analytics Lines</h4>
                    
                    <div className="space-y-2">
                      <Label>Analytics Type</Label>
                      <Select 
                        value={selectedAnalyticType} 
                        onValueChange={(value: 'border-jumping' | 'in-out-counting') => setSelectedAnalyticType(value)}
                      >
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

                  {/* Existing Lines List */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Configured Lines</h4>
                    
                    {analyticsLines.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {analyticsLines.map((line) => (
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
                              onClick={() => deleteAnalyticsLine(line.id)}
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
              </div>
            </div>
          )}

          {/* Analytics Summary */}
          {selectedAnalytics.length > 0 && (
            <div className="space-y-3">
              <Label className="text-base font-medium">Analytics Summary</Label>
              <div className="flex flex-wrap gap-2">
                {selectedAnalytics.map((analyticId) => {
                  const analytic = analyticsOptions.find(a => a.id === analyticId);
                  if (!analytic) return null;
                  
                  const Icon = analytic.icon;
                  return (
                    <Badge key={analyticId} variant="secondary" className="flex items-center gap-1">
                      <Icon className="h-3 w-3" />
                      {analytic.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Analytics Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyticsEditDialog;
