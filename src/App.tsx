
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainLayout from "./components/layout/MainLayout";
import CameraStatus from "./pages/camera-management/CameraStatus";
import FacialRecognition from "./pages/surveillance/FacialRecognition";
import ObjectDetection from "./pages/surveillance/ObjectDetection";
import InOutCount from "./pages/surveillance/InOutCount";
import BorderJumping from "./pages/surveillance/BorderJumping";
// new imports for new module pages:
import Anpr from "./pages/vehicle-intelligence/Anpr";
import VehicleTracking from "./pages/vehicle-intelligence/VehicleTracking";
import MapView from "./pages/camera-management/MapView";
import AddCamera from "./pages/camera-management/AddCamera";
import TestCamera from "./pages/camera-management/TestCamera";
import ImageDifference from "./pages/image-analysis/ImageDifference";
import MotionAnalysis from "./pages/image-analysis/MotionAnalysis";
import ProfileManagement from "./pages/profiling/ProfileManagement";
import AddProfile from "./pages/profiling/AddProfile";
import TrainModel from "./pages/model-management/TrainModel";
import ListModels from "./pages/model-management/ListModels";
import UserList from "./pages/user-management/UserList";
import Permissions from "./pages/user-management/Permissions";
import Preferences from "./pages/settings/Preferences";
import Notifications from "./pages/settings/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/camera-management/status" element={<MainLayout><CameraStatus /></MainLayout>} />

          {/* Surveillance Routes */}
          <Route path="/surveillance/facial-recognition" element={<MainLayout><FacialRecognition /></MainLayout>} />
          <Route path="/surveillance/object-detection" element={<MainLayout><ObjectDetection /></MainLayout>} />
          <Route path="/surveillance/in-out-count" element={<MainLayout><InOutCount /></MainLayout>} />
          <Route path="/surveillance/border-jumping" element={<MainLayout><BorderJumping /></MainLayout>} />

          {/* Vehicle Intelligence */}
          <Route path="/vehicle-intelligence/anpr" element={<MainLayout><Anpr /></MainLayout>} />
          <Route path="/vehicle-intelligence/tracking" element={<MainLayout><VehicleTracking /></MainLayout>} />

          {/* Camera Management */}
          <Route path="/camera-management/map" element={<MainLayout><MapView /></MainLayout>} />
          <Route path="/camera-management/add" element={<MainLayout><AddCamera /></MainLayout>} />
          <Route path="/camera-management/test" element={<MainLayout><TestCamera /></MainLayout>} />

          {/* Image Analysis */}
          <Route path="/image-analysis/difference" element={<MainLayout><ImageDifference /></MainLayout>} />
          <Route path="/image-analysis/motion" element={<MainLayout><MotionAnalysis /></MainLayout>} />

          {/* Profiling & Identity */}
          <Route path="/profiling/management" element={<MainLayout><ProfileManagement /></MainLayout>} />
          <Route path="/profiling/add" element={<MainLayout><AddProfile /></MainLayout>} />

          {/* Model Management */}
          <Route path="/model-management/train" element={<MainLayout><TrainModel /></MainLayout>} />
          <Route path="/model-management/list" element={<MainLayout><ListModels /></MainLayout>} />

          {/* User Management */}
          <Route path="/user-management/list" element={<MainLayout><UserList /></MainLayout>} />
          <Route path="/user-management/permissions" element={<MainLayout><Permissions /></MainLayout>} />

          {/* Settings */}
          <Route path="/settings/preferences" element={<MainLayout><Preferences /></MainLayout>} />
          <Route path="/settings/notifications" element={<MainLayout><Notifications /></MainLayout>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
