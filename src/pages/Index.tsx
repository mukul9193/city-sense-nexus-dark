
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moduleSummary, cameras } from "@/lib/placeholder-data";
import { ModuleCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Video, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import RecentDetections from "@/components/dashboard/RecentDetections";

const CameraStatusCard = () => {
  const onlineCameras = cameras.filter(cam => cam.status === 'Online').length;
  const offlineCameras = cameras.filter(cam => cam.status === 'Offline').length;
  const warningCameras = cameras.filter(cam => cam.status === 'Warning').length;
  const totalCameras = cameras.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Camera Live Status</CardTitle>
        <Video className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalCameras} Total</div>
        <div className="flex gap-2 mt-2">
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            {onlineCameras} Active
          </Badge>
          <Badge variant="destructive">
            {offlineCameras} Inactive
          </Badge>
          <Badge variant="secondary" className="bg-yellow-500 text-black hover:bg-yellow-600">
            {warningCameras} Warning
          </Badge>
        </div>
        <div className="mt-3">
          <Link to="/camera-management/status">
            <Button variant="outline" size="sm" className="w-full">
              Manage Cameras <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const ModuleCard = ({ name, status, metric, icon: Icon, color, activeAlarms, liveAlarms }: ModuleCardData) => (
  <Card className="flex flex-col justify-between hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <div className="space-y-1">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <div className={cn("text-xs font-semibold", 
          status === 'Operational' && 'text-green-400',
          status === 'Warning' && 'text-yellow-400',
          status === 'Offline' && 'text-red-500'
        )}>{status}</div>
      </div>
       <Icon className={cn("h-6 w-6", color)} />
    </CardHeader>
    <CardContent>
      <div className="text-lg font-bold">{metric}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1">
          {liveAlarms > 0 ? (
            <>
              <AlertTriangle className="h-3 w-3 text-red-500 animate-pulse" />
              <span className="text-xs text-red-500">{liveAlarms} Live Alarms</span>
            </>
          ) : activeAlarms > 0 ? (
            <>
              <AlertTriangle className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-orange-500">{activeAlarms} Active</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">All Clear</span>
            </>
          )}
        </div>
        <Button variant="ghost" size="sm" className="h-auto p-1 text-xs text-muted-foreground hover:text-primary">
          View <ArrowUpRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Index = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Smart City Dashboard</h1>
        <p className="text-muted-foreground">Real-time monitoring and control center.</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Module Overview</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {moduleSummary.map(module => <ModuleCard key={module.name} {...module} />)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CameraStatusCard />
        <RecentDetections />
      </div>

    </div>
  );
};

export default Index;
