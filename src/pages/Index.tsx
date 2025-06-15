
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SystemUptimePieChart from "@/components/charts/SystemUptimePieChart";
import AlertsTimeSeriesChart from "@/components/charts/AlertsTimeSeriesChart";
import { moduleSummary } from "@/lib/placeholder-data";
import { ModuleCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Clock, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const StatCard = ({ title, value, icon: Icon, change }: { title: string, value: string, icon: React.ElementType, change?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && <p className="text-xs text-muted-foreground">{change}</p>}
    </CardContent>
  </Card>
);

const ModuleCard = ({ name, status, metric, icon: Icon, color }: ModuleCardData) => (
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
       <Button variant="ghost" size="sm" className="mt-2 -ml-2 h-auto p-1 text-xs text-muted-foreground hover:text-primary">
         View Module <ArrowUpRight className="h-3 w-3 ml-1" />
       </Button>
    </CardContent>
  </Card>
);

const Index = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">System Overview</h1>
        <p className="text-muted-foreground">Welcome to your Smart City Monitoring Dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="System Uptime" value="99.8%" icon={Clock} change="+0.1% from last week" />
        <StatCard title="Active Warnings" value="3" icon={ShieldAlert} change="+2 since last hour" />
        <StatCard title="Critical Alerts" value="0" icon={ShieldCheck} change="System stable" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SystemUptimePieChart />
        <AlertsTimeSeriesChart />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Module Summary</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {moduleSummary.map(module => <ModuleCard key={module.name} {...module} />)}
        </div>
      </div>

    </div>
  );
};

export default Index;
