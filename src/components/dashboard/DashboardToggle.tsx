
import { Toggle } from "@/components/ui/toggle";
import { LayoutGrid, List } from "lucide-react";

interface DashboardToggleProps {
  isDetailedView: boolean;
  onToggle: (detailed: boolean) => void;
}

const DashboardToggle = ({ isDetailedView, onToggle }: DashboardToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">View:</span>
      <div className="flex items-center border rounded-lg p-1">
        <Toggle
          pressed={!isDetailedView}
          onPressedChange={() => onToggle(false)}
          variant="outline"
          size="sm"
          className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <List className="h-4 w-4 mr-1" />
          Overview
        </Toggle>
        <Toggle
          pressed={isDetailedView}
          onPressedChange={() => onToggle(true)}
          variant="outline"
          size="sm"
          className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
          Detailed
        </Toggle>
      </div>
    </div>
  );
};

export default DashboardToggle;
