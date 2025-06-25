
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  faceRecognitionEvents, 
  objectDetectionEvents, 
  borderJumpingEvents, 
  anprEvents 
} from "@/lib/placeholder-data";
import { Eye, Scan, MapPin, Car } from "lucide-react";
import { cn } from "@/lib/utils";

const OverviewEvents = () => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'FRS':
        return <Eye className="h-4 w-4" />;
      case 'ObjectDetection':
        return <Scan className="h-4 w-4" />;
      case 'BorderJumping':
        return <MapPin className="h-4 w-4" />;
      case 'ANPR':
        return <Car className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
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

  const EventCard = ({ title, events, icon: Icon, color }: any) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={cn("h-5 w-5", color)} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.slice(0, 3).map((event: any) => (
            <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg border-l-2 border-l-primary/20 bg-muted/20">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityVariant(event.severity || event.status)} className={cn(
                    (event.severity === 'Medium' || event.status === 'Unknown') && 'bg-yellow-500 text-black hover:bg-yellow-600'
                  )}>
                    {event.severity || event.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{event.description || event.plateNumber}</p>
                <div className="text-xs text-muted-foreground">
                  {event.location} • {event.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <EventCard
        title="Face Recognition Events"
        events={faceRecognitionEvents}
        icon={Eye}
        color="text-blue-500"
      />
      <EventCard
        title="Object Detection Events"
        events={objectDetectionEvents}
        icon={Scan}
        color="text-green-500"
      />
      <EventCard
        title="Border Jumping Events"
        events={borderJumpingEvents}
        icon={MapPin}
        color="text-orange-500"
      />
      <EventCard
        title="ANPR Events"
        events={anprEvents}
        icon={Car}
        color="text-purple-500"
      />
    </div>
  );
};

export default OverviewEvents;
