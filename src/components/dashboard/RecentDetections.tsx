
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recentDetections } from "@/lib/placeholder-data";
import { Eye, AlertTriangle, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const RecentDetections = () => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'FRS':
        return <Eye className="h-4 w-4" />;
      case 'BorderJumping':
        return <AlertTriangle className="h-4 w-4" />;
      case 'VehicleIdentify':
        return <Car className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'FRS':
        return 'Facial Recognition';
      case 'BorderJumping':
        return 'Border Jumping';
      case 'VehicleIdentify':
        return 'Vehicle ID';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Detection Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDetections.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className={cn("mt-1", 
                event.severity === 'High' && 'text-red-500',
                event.severity === 'Medium' && 'text-yellow-500',
                event.severity === 'Low' && 'text-blue-500'
              )}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityVariant(event.severity)} className={cn(
                    event.severity === 'Medium' && 'bg-yellow-500 text-black hover:bg-yellow-600'
                  )}>
                    {getEventTypeLabel(event.type)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {event.severity}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{event.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{event.location}</span>
                  <span>•</span>
                  <span>{event.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDetections;
