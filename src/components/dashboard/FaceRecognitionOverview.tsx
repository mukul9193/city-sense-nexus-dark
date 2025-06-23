
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { faceRecognitionEvents, faceRecognitionStats, faceRecognitionStatusData, dailyDetectionTrends } from "@/lib/placeholder-data";
import { Eye, AlertTriangle, BarChart3, PieChart, TrendingUp, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts';
import { useState } from 'react';

const FaceRecognitionOverview = () => {
  const [showPieChart, setShowPieChart] = useState(false);

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

  const totalDetections = faceRecognitionStats.reduce((sum, item) => sum + item.detections, 0);
  const totalMatches = faceRecognitionStats.reduce((sum, item) => sum + item.matches, 0);
  const matchRate = ((totalMatches / totalDetections) * 100).toFixed(1);

  const todayDetections = dailyDetectionTrends.reduce((sum, item) => sum + item.detections, 0);
  const watchlistAlerts = faceRecognitionEvents.filter(event => event.status === 'Watchlist').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Face Recognition Intelligence</h2>
        <div className="flex items-center gap-2 text-sm">
          <BarChart3 className="h-4 w-4" />
          <span>Bar Chart</span>
          <Switch 
            checked={showPieChart}
            onCheckedChange={setShowPieChart}
          />
          <span>Pie Chart</span>
          <PieChart className="h-4 w-4" />
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{todayDetections}</div>
                <div className="text-xs text-muted-foreground">Today's Detections</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{matchRate}%</div>
                <div className="text-xs text-muted-foreground">Match Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{watchlistAlerts}</div>
                <div className="text-xs text-muted-foreground">Watchlist Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">98.5%</div>
                <div className="text-xs text-muted-foreground">System Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

        {/* Dynamic Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              {showPieChart ? 'Recognition Status Distribution' : 'Monthly Detection Statistics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              {showPieChart ? (
                <RechartsPieChart>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Pie
                    data={faceRecognitionStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {faceRecognitionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              ) : (
                <BarChart data={faceRecognitionStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="detections" fill="#3b82f6" name="Total Detections" />
                  <Bar dataKey="matches" fill="#ef4444" name="Profile Matches" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            24-Hour Detection Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyDetectionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="detections" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaceRecognitionOverview;
