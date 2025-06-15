
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle, UserPlus } from "lucide-react";

const CameraFeed = ({ id }: { id: number }) => (
  <div className="bg-card-foreground/10 aspect-video flex items-center justify-center rounded-md">
    <p className="text-muted-foreground">Camera Feed {id}</p>
  </div>
);

const DetectionEvent = ({ type, name, image, time }: { type: 'Unknown' | 'Suspect' | 'Known', name: string, image: string, time: string }) => {
  const typeInfo = {
    Unknown: { icon: UserPlus, color: "text-yellow-400" },
    Suspect: { icon: AlertCircle, color: "text-red-500" },
    Known: { icon: CheckCircle, color: "text-green-400" },
  };
  const Icon = typeInfo[type].icon;

  return (
    <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted">
      <Avatar>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
           <Icon className={`h-4 w-4 ${typeInfo[type].color}`} />
           <p className="font-semibold">{type === 'Unknown' ? 'Unknown Detected' : name}</p>
        </div>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};


const FacialRecognition = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Facial Recognition</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
                <CardTitle>Live Feeds</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <CameraFeed id={1} />
              <CameraFeed id={2} />
              <CameraFeed id={3} />
              <CameraFeed id={4} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Detection Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        <DetectionEvent type="Suspect" name="Subject 10A" image="https://i.pravatar.cc/150?u=a042581f4e29026704d" time="2 mins ago" />
                        <DetectionEvent type="Known" name="John Doe" image="https://i.pravatar.cc/150?u=a042581f4e29026704e" time="5 mins ago" />
                        <DetectionEvent type="Unknown" name="Unknown" image="https://i.pravatar.cc/150?u=a042581f4e29026704f" time="8 mins ago" />
                        <DetectionEvent type="Known" name="Jane Smith" image="https://i.pravatar.cc/150?u=a042581f4e29026704a" time="12 mins ago" />
                      </div>
                  </ScrollArea>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default FacialRecognition;
