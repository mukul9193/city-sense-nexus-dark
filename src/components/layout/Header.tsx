
import { Button } from "@/components/ui/button";
import { Camera, Users, Shield, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: Shield },
    { name: "Camera Status", path: "/camera-management/status", icon: Camera },
    { name: "Map View", path: "/camera-management/map", icon: Camera },
    { name: "Add Camera", path: "/camera-management/add", icon: Camera },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <span className="font-bold text-xl">SecureVision AI</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
