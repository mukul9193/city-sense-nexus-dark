
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Eye, 
  Scan, 
  Car, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Filter,
  ExternalLink,
  Activity,
  Users,
  Shield,
  Camera
} from "lucide-react";
import { 
  faceRecognitionEvents, 
  objectDetectionEvents, 
  anprEvents, 
  borderJumpingEvents 
} from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { useState } from "react";

const CompactOverviewDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Mock real-time stats
  const getModuleStats = (events: any[], type: string) => {
    const todayEvents = events.length;
    const lastHourEvents = Math.floor(events.length * 0.3);
    return { today: todayEvents, lastHour: lastHourEvents };
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'High': case 'Watchlist': case 'Alert': return 'destructive';
      case 'Medium': case 'Unknown': case 'Suspicious': return 'secondary';
      case 'Low': case 'Normal': case 'Authorized': return 'default';
      default: return 'default';
    }
  };

  // Mock chart data
  const frsStatusData = [
    { name: 'Known', value: 65, fill: '#22c55e' },
    { name: 'Unknown', value: 35, fill: '#eab308' }
  ];

  const objectTypeData = [
    { name: 'Person', value: 45 },
    { name: 'Vehicle', value: 30 },
    { name: 'Bag', value: 25 }
  ];

  const anprStatusData = [
    { name: 'Registered', value: 80, fill: '#22c55e' },
    { name: 'Unknown', value: 20, fill: '#ef4444' }
  ];

  const borderTrendData = [
    { time: '14:00', detections: 2 },
    { time: '14:15', detections: 5 },
    { time: '14:30', detections: 3 },
    { time: '14:45', detections: 7 }
  ];

  const ModuleHeader = ({ icon: Icon, title, events, color }: any) => {
    const stats = getModuleStats(events, title);
    return (
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className={cn("h-5 w-5", color)} />
            {title}
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-4">
            <span>Today: <strong>{stats.today}</strong></span>
            <span>Last 1hr: <strong>{stats.lastHour}</strong></span>
          </div>
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-20 h-6 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
    );
  };

  const LiveSnapshot = ({ events, type }: any) => {
    const latestEvent = events[0];
    return (
      <div className="relative">
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
          {type === 'FRS' && latestEvent?.photoUrl ? (
            <img 
              src={latestEvent.photoUrl} 
              alt="Live Detection" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            ● LIVE
          </div>
          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {latestEvent?.timestamp || 'No Data'} | {latestEvent?.location || 'N/A'}
          </div>
        </div>
      </div>
    );
  };

  const RecentEventsTable = ({ events, type }: any) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Recent Events</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                View All
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>All {type} Events</DialogTitle>
              </DialogHeader>
              <div className="overflow-auto max-h-[60vh]">
                <div className="grid gap-2">
                  {events.map((event: any) => (
                    <div key={event.id} className="flex items-center gap-3 p-2 border rounded">
                      {type === 'FRS' && event.photoUrl && (
                        <img src={event.photoUrl} alt="" className="w-8 h-8 rounded object-cover" />
                      )}
                      <div className="flex-1 text-sm">
                        <div className="font-medium">
                          {type === 'FRS' ? event.name : (event.description || event.plateNumber || event.objectType)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {event.location} • {event.timestamp}
                        </div>
                      </div>
                      <Badge variant={getSeverityVariant(event.severity || event.status)} className="text-xs">
                        {event.severity || event.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-1">
          {events.slice(0, 3).map((event: any) => (
            <div key={event.id} className="grid grid-cols-5 gap-2 text-xs py-1 px-2 rounded bg-muted/30">
              <span className="truncate">{event.timestamp}</span>
              <span className="truncate font-medium">
                {type === 'FRS' ? event.name : (event.description || event.plateNumber || event.objectType)}
              </span>
              <span className="truncate">{event.location}</span>
              <span className="truncate">Cam-{event.id}</span>
              <Badge variant={getSeverityVariant(event.severity || event.status)} className="text-xs h-5">
                {event.severity || event.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-12rem)] p-4">
      {/* Smart Alert Summary */}
      <div className="mb-4 p-3 bg-card rounded-lg border">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>2 Unauthorized Entries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <span>1 Unknown Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>3 Unknown Faces</span>
          </div>
        </div>
      </div>

      {/* 2x2 Grid Layout */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[calc(100%-5rem)]">
        {/* Face Recognition (Top Left) */}
        <Card className="p-4 rounded-2xl shadow-lg h-full flex flex-col">
          <ModuleHeader 
            icon={Eye} 
            title="Face Recognition" 
            events={faceRecognitionEvents}
            color="text-blue-500"
          />
          <CardContent className="flex-1 p-0 space-y-4">
            <LiveSnapshot events={faceRecognitionEvents} type="FRS" />
            <RecentEventsTable events={faceRecognitionEvents} type="FRS" />
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={frsStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={35}
                    dataKey="value"
                  >
                    {frsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Object Detection (Top Right) */}
        <Card className="p-4 rounded-2xl shadow-lg h-full flex flex-col">
          <ModuleHeader 
            icon={Scan} 
            title="Object Detection" 
            events={objectDetectionEvents}
            color="text-green-500"
          />
          <CardContent className="flex-1 p-0 space-y-4">
            <LiveSnapshot events={objectDetectionEvents} type="Object" />
            <RecentEventsTable events={objectDetectionEvents} type="Object" />
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={objectTypeData}>
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Bar dataKey="value" fill="#22c55e" />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ANPR (Bottom Left) */}
        <Card className="p-4 rounded-2xl shadow-lg h-full flex flex-col">
          <ModuleHeader 
            icon={Car} 
            title="ANPR" 
            events={anprEvents}
            color="text-purple-500"
          />
          <CardContent className="flex-1 p-0 space-y-4">
            <LiveSnapshot events={anprEvents} type="ANPR" />
            <RecentEventsTable events={anprEvents} type="ANPR" />
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={anprStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={35}
                    dataKey="value"
                  >
                    {anprStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Border Jumping (Bottom Right) */}
        <Card className="p-4 rounded-2xl shadow-lg h-full flex flex-col">
          <ModuleHeader 
            icon={MapPin} 
            title="Border Jumping" 
            events={borderJumpingEvents}
            color="text-orange-500"
          />
          <CardContent className="flex-1 p-0 space-y-4">
            <LiveSnapshot events={borderJumpingEvents} type="Border" />
            <RecentEventsTable events={borderJumpingEvents} type="Border" />
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={borderTrendData}>
                  <XAxis dataKey="time" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Line type="monotone" dataKey="detections" stroke="#f97316" strokeWidth={2} />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompactOverviewDashboard;
