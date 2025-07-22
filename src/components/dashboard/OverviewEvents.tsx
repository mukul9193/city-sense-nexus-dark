
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  faceRecognitionEvents, 
  objectDetectionEvents, 
  borderJumpingEvents, 
  anprEvents 
} from "@/lib/placeholder-data";
import { Eye, Scan, MapPin, Car, User, Clock, AlertTriangle, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const OverviewEvents = () => {
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleViewAll = (title: string, events: any[], type: string) => {
    setSelectedEventType(type);
    setDialogOpen(true);
  };

  const getAllEvents = (type: string) => {
    switch (type) {
      case 'FRS':
        return faceRecognitionEvents;
      case 'ObjectDetection':
        return objectDetectionEvents;
      case 'BorderJumping':
        return borderJumpingEvents;
      case 'ANPR':
        return anprEvents;
      default:
        return [];
    }
  };

  const EventCard = ({ title, events, icon: Icon, color, type }: any) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={cn("h-5 w-5", color)} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.slice(0, 2).map((event: any) => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
              {/* Event Image/Photo */}
              {(type === 'FRS' && event.photoUrl) && (
                <div className="flex-shrink-0">
                  <img 
                    src={event.photoUrl} 
                    alt={event.name || 'Detection'}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                  />
                </div>
              )}
              
              {/* Event snapshot for other types */}
              {type !== 'FRS' && (
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={getSeverityVariant(event.severity || event.status)} className={cn(
                    (event.severity === 'Medium' || event.status === 'Unknown') && 'bg-yellow-500 text-black hover:bg-yellow-600'
                  )}>
                    {event.severity || event.status}
                  </Badge>
                  
                  {/* Detection confidence for FRS */}
                  {type === 'FRS' && event.confidence && (
                    <Badge variant="outline" className="text-xs">
                      {event.confidence}% match
                    </Badge>
                  )}
                </div>

                {/* Event Details */}
                <div className="space-y-1">
                  {/* Name or description */}
                  <p className="text-sm font-medium">
                    {type === 'FRS' ? event.name : (event.description || event.plateNumber)}
                  </p>
                  
                  {/* Additional details based on event type */}
                  {type === 'FRS' && event.status === 'Watchlist' && (
                    <div className="flex items-center gap-1 text-xs text-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Security Alert - Watchlist Match</span>
                    </div>
                  )}
                  
                  {type === 'ANPR' && event.vehicleType && (
                    <p className="text-xs text-muted-foreground">
                      Vehicle: {event.vehicleType}
                    </p>
                  )}

                  {/* Location and timestamp in one line */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{event.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {events.length > 2 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => handleViewAll(title, events, type)}
                >
                  <Maximize className="h-3 w-3 mr-1" />
                  View All {events.length} Events
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", color)} />
                    {title} - All Events
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 md:grid-cols-2 max-h-[60vh] overflow-y-auto">
                  {events.map((event: any) => (
                    <div key={event.id} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/20">
                      {/* Event Image/Photo */}
                      {(type === 'FRS' && event.photoUrl) && (
                        <div className="flex-shrink-0">
                          <img 
                            src={event.photoUrl} 
                            alt={event.name || 'Detection'}
                            className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-sm"
                          />
                        </div>
                      )}
                      
                      {/* Event snapshot for other types */}
                      {type !== 'FRS' && (
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-10 w-10 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getSeverityVariant(event.severity || event.status)} className={cn(
                            (event.severity === 'Medium' || event.status === 'Unknown') && 'bg-yellow-500 text-black hover:bg-yellow-600'
                          )}>
                            {event.severity || event.status}
                          </Badge>
                          
                          {type === 'FRS' && event.confidence && (
                            <Badge variant="outline" className="text-xs">
                              {event.confidence}% match
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="font-medium">
                            {type === 'FRS' ? event.name : (event.description || event.plateNumber)}
                          </p>
                          
                          {type === 'FRS' && event.status === 'Watchlist' && (
                            <div className="flex items-center gap-1 text-sm text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Security Alert - Watchlist Match</span>
                            </div>
                          )}
                          
                          {type === 'ANPR' && event.vehicleType && (
                            <p className="text-sm text-muted-foreground">
                              Vehicle: {event.vehicleType}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{event.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
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
        type="FRS"
      />
      <EventCard
        title="Object Detection Events"
        events={objectDetectionEvents}
        icon={Scan}
        color="text-green-500"
        type="ObjectDetection"
      />
      <EventCard
        title="Border Jumping Events"
        events={borderJumpingEvents}
        icon={MapPin}
        color="text-orange-500"
        type="BorderJumping"
      />
      <EventCard
        title="ANPR Events"
        events={anprEvents}
        icon={Car}
        color="text-purple-500"
        type="ANPR"
      />
    </div>
  );
};

export default OverviewEvents;
