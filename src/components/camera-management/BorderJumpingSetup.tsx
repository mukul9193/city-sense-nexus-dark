import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";
import { MapPin, Trash2, Plus, Save } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface BorderLine {
  id: string;
  name: string;
  points: Point[];
  color: string;
}

interface BorderJumpingSetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frameUrl: string;
}

const BorderJumpingSetup = ({ open, onOpenChange, frameUrl }: BorderJumpingSetupProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [borderLines, setBorderLines] = useState<BorderLine[]>([]);
  const [selectedColor, setSelectedColor] = useState('#ff0000');

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

  useEffect(() => {
    if (open && canvasRef.current && frameUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Load and draw the image
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

    // Clear and redraw image
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // Draw existing lines
      borderLines.forEach(line => {
        if (line.points.length > 1) {
          ctx.strokeStyle = line.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(line.points[0].x, line.points[0].y);
          line.points.slice(1).forEach(point => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        }
      });

      // Draw current line being drawn
      if (currentLine.length > 1) {
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(currentLine[0].x, currentLine[0].y);
        currentLine.slice(1).forEach(point => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
    };
    img.src = frameUrl;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDrawing) {
      setCurrentLine(prev => [...prev, { x, y }]);
    }
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setCurrentLine([]);
  };

  const finishLine = () => {
    if (currentLine.length > 1) {
      const newLine: BorderLine = {
        id: Date.now().toString(),
        name: `Border Line ${borderLines.length + 1}`,
        points: currentLine,
        color: selectedColor
      };
      setBorderLines(prev => [...prev, newLine]);
    }
    setCurrentLine([]);
    setIsDrawing(false);
  };

  const deleteLine = (lineId: string) => {
    setBorderLines(prev => prev.filter(line => line.id !== lineId));
  };

  const handleSave = () => {
    console.log('Saving border lines:', borderLines);
    onOpenChange(false);
  };

  useEffect(() => {
    redrawLines();
  }, [borderLines, currentLine]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Border Jumping Configuration
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
            {/* Drawing Controls */}
            <div className="space-y-3">
              <h3 className="font-medium">Drawing Controls</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Line Color</label>
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

              <div className="space-y-2">
                {!isDrawing ? (
                  <Button onClick={startDrawing} className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Drawing Line
                  </Button>
                ) : (
                  <Button onClick={finishLine} variant="outline" className="w-full" size="sm">
                    Finish Line
                  </Button>
                )}
              </div>
            </div>

            {/* Existing Lines */}
            <div className="space-y-3">
              <h3 className="font-medium">Border Lines ({borderLines.length})</h3>
              
              {borderLines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No border lines defined</p>
              ) : (
                <div className="space-y-2">
                  {borderLines.map(line => (
                    <div key={line.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: line.color }}
                        />
                        <span className="text-sm">{line.name}</span>
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
              <p>1. Click "Start Drawing Line"</p>
              <p>2. Click points on the image to draw</p>
              <p>3. Click "Finish Line" when done</p>
              <p>4. Repeat for multiple lines</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={borderLines.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BorderJumpingSetup;
