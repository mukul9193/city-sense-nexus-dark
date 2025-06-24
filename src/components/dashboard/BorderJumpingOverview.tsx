
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { borderJumpingEvents, borderJumpingStats } from "@/lib/placeholder-data";
import { MapPin, AlertTriangle, BarChart3, PieChart, TrendingUp, Shield, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { useState } from 'react';

const BorderJumpingOverview = () => {
  const [showPieChart, setShowPieChart] = useState(false);

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

  const totalIncidents = borderJumpingStats.reduce((sum, item) => sum + item.incidents, 0);
  const totalBreaches = borderJumpingStats.reduce((sum, item) => sum + item.breaches, 0);
  const breachRate = ((totalBreaches / totalIncidents) * 100).toFixed(1);

  const todayIncidents = 8;
  const averageConfidence = 84.2;
  const responseTime = 145;

  const severityData = [
    { name: 'Low', value: 45, fill: '#22c55e' },
    { name: 'Medium', value: 35, fill: '#eab308' },
    { name: 'High', value: 20, fill: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Border Jumping Intelligence</h2>
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
                <div className="text-2xl font-bold">{todayIncidents}</div>
                <div className="text-xs text-muted-foreground">Today's Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              <div>
                <div className="text-2xl font-bold">{breachRate}%</div>
                <div className="text-xs text-muted-foreground">Breach Rate</div>
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
                <div className="text-2xl font-bold">{responseTime}s</div>
                <div className="text-xs text-muted-foreground">Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Recent Border Jumping Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {borderJumpingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{event.zone}</span>
                      <Badge variant={getSeverityVariant(event.severity)} className={cn(
                        event.severity === 'Medium' && 'bg-yellow-500 text-black hover:bg-yellow-600'
                      )}>
                        {event.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>Confidence: {event.confidence}%</div>
                      <div>{event.location} • {event.timestamp}</div>
                    </div>
                    <p className="text-sm">{event.description}</p>
                  </div>
                  {event.severity === 'High' && (
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
              {showPieChart ? 'Severity Distribution' : 'Monthly Incident Statistics'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              {showPieChart ? (
                <RechartsPieChart>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              ) : (
                <BarChart data={borderJumpingStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="incidents" fill="#3b82f6" name="Total Incidents" />
                  <Bar dataKey="breaches" fill="#ef4444" name="Confirmed Breaches" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BorderJumpingOverview;
