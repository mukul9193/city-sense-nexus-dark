
import { HomeIcon, Settings, Video, Map, Plus, BarChart3, Eye, Users, Shield, Car, AlertTriangle } from "lucide-react";
import Index from "./pages/Index.tsx";
import CameraStatus from "./pages/camera-management/CameraStatus.tsx";
import MapView from "./pages/camera-management/MapView.tsx";
import AddCamera from "./pages/camera-management/AddCamera.tsx";
import CameraConfiguration from "./pages/camera-management/CameraConfiguration.tsx";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Camera Status",
    to: "/camera-status",
    icon: <Video className="h-4 w-4" />,
    page: <CameraStatus />,
  },
  {
    title: "Camera Configuration",
    to: "/camera-configuration", 
    icon: <Settings className="h-4 w-4" />,
    page: <CameraConfiguration />,
  },
  {
    title: "Map View",
    to: "/map-view",
    icon: <Map className="h-4 w-4" />,
    page: <MapView />,
  },
  {
    title: "Add Camera",
    to: "/add-camera",
    icon: <Plus className="h-4 w-4" />,
    page: <AddCamera />,
  },
];
