
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

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
