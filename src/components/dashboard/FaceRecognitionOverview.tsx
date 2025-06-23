
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { faceRecognitionEvents, faceRecognitionStats } from "@/lib/placeholder-data";
import { Eye, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FaceRecognitionOverview = () => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Watchlist':
        return 'destructive';
      case 'Unknown':
        return 'secondary';
      case 'Authorized':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Watchlist':
        return 'text-red-500';
      case 'Unknown':
        return 'text-yellow-500';
      case 'Authorized':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Face Recognition Overview</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Recent Face Recognition Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faceRecognitionEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <img 
                    src={event.photoUrl} 
                    alt={event.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{event.name}</span>
                      <Badge variant={getStatusVariant(event.status)} className={cn(
                        event.status === 'Unknown' && 'bg-yellow-500 text-black hover:bg-yellow-600'
                      )}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>Confidence: {event.confidence}%</div>
                      <div>{event.location} • {event.timestamp}</div>
                    </div>
                  </div>
                  {event.status === 'Watchlist' && (
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detection Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Detection Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={faceRecognitionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="detections" fill="#3b82f6" name="Total Detections" />
                <Bar dataKey="matches" fill="#ef4444" name="Profile Matches" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FaceRecognitionOverview;

