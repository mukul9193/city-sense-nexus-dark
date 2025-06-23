
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { moduleSummary } from "@/lib/placeholder-data";
import { ModuleCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, AlertTriangle, ShieldCheck } from "lucide-react";

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

const SurveillanceModules = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Surveillance Modules</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {moduleSummary.map(module => <ModuleCard key={module.name} {...module} />)}
      </div>
    </div>
  );
};

export default SurveillanceModules;

