
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentDetections } from "@/lib/placeholder-data";
import { AlertTriangle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FaceRecognitionOverview from "@/components/dashboard/FaceRecognitionOverview";
import SurveillanceModules from "@/components/dashboard/SurveillanceModules";
import CameraNetworkCard from "@/components/dashboard/CameraNetworkCard";

const Index = () => {
  const highPriorityAlerts = recentDetections.filter(det => det.severity === 'High').length;
  const todayDetections = recentDetections.length; // Using current data as sample

  return (
    <div className="space-y-8">
      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Enhanced Camera Network */}
        <CameraNetworkCard />

        {/* High Priority Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{highPriorityAlerts}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Require immediate attention
            </div>
          </CardContent>
        </Card>

        {/* Today's Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayDetections}</div>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge variant="outline" className="text-xs">
                Detection Events
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Face Recognition Overview */}
      <FaceRecognitionOverview />

      {/* Surveillance Modules */}
      <SurveillanceModules />
    </div>
  );
};

export default Index;
