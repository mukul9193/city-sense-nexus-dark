
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { objectDetectionEvents, objectDetectionStats } from "@/lib/placeholder-data";
import { Search, AlertTriangle, BarChart3, PieChart, TrendingUp, Package, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useState } from 'react';

const ObjectDetectionOverview = () => {
  const [showPieChart, setShowPieChart] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Alert':
        return 'destructive';
      case 'Suspicious':
        return 'secondary';
      case 'Normal':
        return 'default';
      default:
        return 'default';
    }
  };

  const totalDetections = objectDetectionStats.reduce((sum, item) => sum + item.detections, 0);
  const totalAlerts = objectDetectionStats.reduce((sum, item) => sum + item.alerts, 0);
  const alertRate = ((totalAlerts / totalDetections) * 100).toFixed(1);

  const todayDetections = 156;
  const averageConfidence = 88.7;
  const processingSpeed = 98;

  const statusData = [
    { name: 'Normal', value: 70, fill: '#22c55e' },
    { name: 'Suspicious', value: 20, fill: '#eab308' },
    { name: 'Alert', value: 10, fill: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Object Detection Intelligence</h2>
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
              <Package className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{alertRate}%</div>
                <div className="text-xs text-muted-foreground">Alert Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{averageConfidence}%</div>
                <div className="text-xs text-muted-foreground">Avg Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{processingSpeed}ms</div>
                <div className="text-xs text-muted-foreground">Processing Speed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Recent Object Detection Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {objectDetectionEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{event.objectType}</span>
                      <Badge variant={getStatusVariant(event.status)} className={cn(
                        event.status === 'Suspicious' && 'bg-yellow-500 text-black hover:bg-yellow-600'
                      )}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>Confidence: {event.confidence}%</div>
                      <div>{event.location} • {event.timestamp}</div>
                    </div>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  {event.status === 'Alert' && (
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {showPieChart ? 'Detection Status Distribution' : 'Monthly Detection Statistics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              {showPieChart ? (
                <RechartsPieChart>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              ) : (
                <BarChart data={objectDetectionStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="detections" fill="#3b82f6" name="Total Detections" />
                  <Bar dataKey="alerts" fill="#ef4444" name="Alerts Generated" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ObjectDetectionOverview;
