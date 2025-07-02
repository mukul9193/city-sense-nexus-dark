
import Index from "./pages/Index";
import AddCamera from "./pages/camera-management/AddCamera";
import CameraStatus from "./pages/camera-management/CameraStatus";
import MapView from "./pages/camera-management/MapView";

export const navItems = [
  {
    to: "/",
    page: <Index />
  },
  {
    to: "/camera-management/add",
    page: <AddCamera />
  },
  {
    to: "/camera-management/status", 
    page: <CameraStatus />
  },
  {
    to: "/camera-management/map",
    page: <MapView />
  }
];
