
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentDetections } from "@/lib/placeholder-data";
import { Shield, Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import FaceRecognitionOverview from "@/components/dashboard/FaceRecognitionOverview";
import ObjectDetectionOverview from "@/components/dashboard/ObjectDetectionOverview";
import BorderJumpingOverview from "@/components/dashboard/BorderJumpingOverview";
import ANPROverview from "@/components/dashboard/ANPROverview";
import SurveillanceModules from "@/components/dashboard/SurveillanceModules";
import CameraNetworkCard from "@/components/dashboard/CameraNetworkCard";
import DashboardToggle from "@/components/dashboard/DashboardToggle";
import OverviewEvents from "@/components/dashboard/OverviewEvents";

const Index = () => {
  const [isDetailedView, setIsDetailedView] = useState(true);
  
  const activeThreats = recentDetections.filter(det => det.severity === 'High').length;
  const totalDetections = recentDetections.length;
  const systemEfficiency = 94.2; // Mock efficiency percentage

  return (
    <div className="space-y-8">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Security Dashboard</h1>
        <DashboardToggle isDetailedView={isDetailedView} onToggle={setIsDetailedView} />
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Enhanced Camera Network */}
        <CameraNetworkCard />

        {/* Active Threats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{activeThreats}</div>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge variant="destructive" className="text-xs">
                High Priority
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* System Efficiency */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{systemEfficiency}%</div>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge variant="outline" className="text-xs">
                Optimal Performance
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conditional Content Based on View Mode */}
      {isDetailedView ? (
        <>
          {/* Face Recognition Overview */}
          <FaceRecognitionOverview />

          {/* Object Detection Overview */}
          <ObjectDetectionOverview />

          {/* Border Jumping Overview */}
          <BorderJumpingOverview />

          {/* ANPR Overview */}
          <ANPROverview />

          {/* Surveillance Modules */}
          <SurveillanceModules />
        </>
      ) : (
        <>
          {/* Overview Events Grid */}
          <OverviewEvents />

          {/* Surveillance Modules */}
          <SurveillanceModules />
        </>
      )}
    </div>
  );
};

export default Index;
