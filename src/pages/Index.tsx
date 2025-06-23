
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cameras } from "@/lib/placeholder-data";
import { Video, Brain, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import FaceRecognitionOverview from "@/components/dashboard/FaceRecognitionOverview";
import SurveillanceModules from "@/components/dashboard/SurveillanceModules";

const Index = () => {
  const activeCameras = cameras.filter(cam => cam.status === 'Online').length;
  const inactiveCameras = cameras.filter(cam => cam.status === 'Offline' || cam.status === 'Warning').length;

  return (
    <div className="space-y-8">
      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Camera Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camera Status</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cameras.length} Total</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                {activeCameras} Active
              </Badge>
              <Badge variant="destructive">
                {inactiveCameras} Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Models in Use */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models in Use</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Active</div>
            <div className="text-sm text-muted-foreground mt-1">
              BERT v2 • YOLOv8 • ResNet50
            </div>
          </CardContent>
        </Card>

        {/* Total Profiles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,890</div>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge variant="outline" className="text-xs">
                +127 This Week
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

