
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { navItems } from "./nav-items";
import MainLayout from "./components/layout/MainLayout";
import ConfigureAnalytics from "./pages/camera-management/ConfigureAnalytics";
import EditCamera from "./pages/camera-management/EditCamera";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
            {navItems.map(({ to, page }) => (
              <Route key={to} path={to} element={page} />
            ))}
            <Route path="/camera-management/configure" element={<ConfigureAnalytics />} />
            <Route path="/camera-management/edit" element={<EditCamera />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
