
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cameras } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const CameraStatus = () => {
  const getStatusVariant = (status: 'Online' | 'Offline' | 'Warning') => {
    switch (status) {
      case 'Online':
        return 'default';
      case 'Offline':
        return 'destructive';
      case 'Warning':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Camera Status Summary</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Cameras</CardTitle>
          <CardDescription>Live status of all registered cameras in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Camera ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cameras.map((camera) => (
                <TableRow key={camera.id}>
                  <TableCell className="font-medium">{camera.id}</TableCell>
                  <TableCell>{camera.name}</TableCell>
                  <TableCell>{camera.location}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(camera.status)} className={cn(
                        camera.status === 'Warning' && 'bg-accentYellow text-black hover:bg-accentYellow/80'
                    )}>
                      {camera.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{camera.lastSeen}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraStatus;
