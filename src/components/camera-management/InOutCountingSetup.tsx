import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { Users, Trash2, Plus, Save, ArrowUpDown } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface CountingLine {
  id: string;
  name: string;
  startPoint: Point;
  endPoint: Point;
  direction: 'horizontal' | 'vertical';
  countType: 'people' | 'vehicles' | 'objects';
  color: string;
}

interface InOutCountingSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frameUrl: string;
}

const InOutCountingSetup = ({ open, onOpenChange, frameUrl }: InOutCountingSetupProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [countingLines, setCountingLines] = useState<CountingLine[]>([]);
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  const [lineName, setLineName] = useState('');
  const [lineDirection, setLineDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [countType, setCountType] = useState<'people' | 'vehicles' | 'objects'>('people');

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  useEffect(() => {
    if (open && canvasRef.current && frameUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          redrawLines();
        };
        img.src = frameUrl;
      }
    }
  }, [open, frameUrl]);

  const redrawLines = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Draw existing lines
      countingLines.forEach(line => {
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(line.startPoint.x, line.startPoint.y);
        ctx.lineTo(line.endPoint.x, line.endPoint.y);
        ctx.stroke();

        // Draw direction arrow
        const midX = (line.startPoint.x + line.endPoint.x) / 2;
        const midY = (line.startPoint.y + line.endPoint.y) / 2;
        const angle = Math.atan2(line.endPoint.y - line.startPoint.y, line.endPoint.x - line.startPoint.x);
        
        ctx.save();
        ctx.translate(midX, midY);
        ctx.rotate(angle);
        ctx.fillStyle = line.color;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Draw label
        ctx.fillStyle = line.color;
        ctx.font = '12px Arial';
        ctx.fillText(line.name, midX + 10, midY - 10);
      });
    };
    img.src = frameUrl;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!isDrawing) {
      setStartPoint({ x, y });
      setIsDrawing(true);
    } else {
      if (startPoint) {
        const newLine: CountingLine = {
          id: Date.now().toString(),
          name: lineName || `Line ${countingLines.length + 1}`,
          startPoint,
          endPoint: { x, y },
          direction: lineDirection,
          countType,
          color: selectedColor
        };
        setCountingLines(prev => [...prev, newLine]);
        setStartPoint(null);
        setIsDrawing(false);
        setLineName('');
      }
    }
  };

  const deleteLine = (lineId: string) => {
    setCountingLines(prev => prev.filter(line => line.id !== lineId));
  };

  const handleSave = () => {
    console.log('Saving counting lines:', countingLines);
    onOpenChange(false);
  };

  useEffect(() => {
    redrawLines();
  }, [countingLines]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            In/Out Counting Configuration
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 lg:grid-cols-4">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="relative border rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="w-full h-auto cursor-crosshair"
                style={{ maxHeight: '500px' }}
              />
              {!frameUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                  No camera frame available. Test camera connection first.
                </div>
              )}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Line Configuration */}
            <div className="space-y-3">
              <h3 className="font-medium">Line Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="lineName">Line Name</Label>
                <Input
                  id="lineName"
                  value={lineName}
                  onChange={(e) => setLineName(e.target.value)}
                  placeholder="Enter line name"
                />
              </div>

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

              <div className="space-y-2">
                <Label>Line Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded border-2 ${selectedColor === color ? 'border-black' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <Badge variant="secondary" className="mb-2">
                  {isDrawing ? 'Drawing Mode' : 'Click to Start'}
                </Badge>
                <p>Click two points to draw a counting line</p>
              </div>
            </div>

            {/* Existing Lines */}
            <div className="space-y-3">
              <h3 className="font-medium">Counting Lines ({countingLines.length})</h3>
              
              {countingLines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No counting lines defined</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {countingLines.map(line => (
                    <div key={line.id} className="flex items-center justify-between p-2 border rounded text-xs">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: line.color }}
                        />
                        <div>
                          <div className="font-medium">{line.name}</div>
                          <div className="text-muted-foreground">
                            {line.countType} • {line.direction}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLine(line.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Instructions:</strong></p>
              <p>1. Set line name and type</p>
              <p>2. Click first point on frame</p>
              <p>3. Click second point to complete</p>
              <p>4. Line will count crossings</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={countingLines.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InOutCountingSetup;
