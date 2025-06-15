
import { Link, NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Bot } from "lucide-react";
import React from "react";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const navLinks = [
    {
      trigger: "Dashboard",
      isSingle: true,
      href: "/",
      items: [],
    },
    {
        trigger: "Surveillance",
        items: [
            { title: "Facial Recognition", href: "/surveillance/facial-recognition", description: "Real-time face detection and identification." },
            { title: "Object Detection", href: "/surveillance/object-detection", description: "Identify and log objects in feeds." },
            { title: "In/Out Count", href: "/surveillance/in-out-count", description: "Monitor entries and exits." },
            { title: "Border Jumping", href: "/surveillance/border-jumping", description: "Detect boundary breaches." },
        ],
    },
    {
        trigger: "Vehicle Intelligence",
        items: [
            { title: "ANPR", href: "#", description: "Automatic Number Plate Recognition." },
            { title: "Vehicle Tracking", href: "#", description: "Track vehicle movement." },
        ],
    },
    {
        trigger: "Camera Management",
        items: [
            { title: "Map View", href: "#", description: "Visualize cameras on a map." },
            { title: "Add Camera", href: "#", description: "Register a new camera." },
            { title: "Test Camera", href: "#", description: "Check camera feed." },
            { title: "Camera Status", href: "/camera-management/status", description: "View online/offline status." },
        ],
    },
    {
        trigger: "Image Analysis",
        items: [
            { title: "Image Difference", href: "#", description: "Compare two images for changes." },
            { title: "Motion Analysis", href: "#", description: "Analyze motion in video clips." },
        ],
    },
    {
        trigger: "Profiling & Identity",
        items: [
            { title: "Profile Management", href: "#", description: "Manage user and suspect profiles." },
            { title: "Add New Profile", href: "#", description: "Create a new identity profile." },
        ],
    },
    {
        trigger: "Model Management",
        items: [
            { title: "Train New Model", href: "#", description: "Train AI models with new data." },
            { title: "List Models", href: "#", description: "View and deploy trained models." },
        ],
    },
    {
        trigger: "User Management",
        items: [
            { title: "User List", href: "#", description: "Manage application users." },
            { title: "Permissions", href: "#", description: "Assign roles and permissions." },
        ],
    },
     {
        trigger: "Settings",
        items: [
            { title: "System Preferences", href: "#", description: "Configure system-wide settings." },
            { title: "Notifications", href: "#", description: "Manage alert notifications." },
        ],
    },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center relative">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">CitySense</span>
        </Link>
        {/* Navigation bar wrapper, NOT horizontally scrollable itself */}
        <div className="relative flex-1">
          {/* Scrollable link list only */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent whitespace-nowrap pr-4" style={{ WebkitOverflowScrolling: "touch" }}>
            <NavigationMenu>
              <NavigationMenuList className="min-w-max">
                {navLinks.map((link) =>
                  link.isSingle ? (
                    <NavigationMenuItem key={link.trigger}>
                      <NavLink to={link.href!} className={navigationMenuTriggerStyle()}>
                        {link.trigger}
                      </NavLink>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={link.trigger} className="relative">
                      <NavigationMenuTrigger>{link.trigger}</NavigationMenuTrigger>
                      {/* Menu content: absolutely positioned, not clipped by scroll, high z-index */}
                      <NavigationMenuContent
                        className="absolute left-0 top-full z-[110] min-w-[340px] w-fit md:w-[500px] lg:w-[600px] bg-popover shadow-lg border rounded-md"
                        style={{ minWidth: 340, maxWidth: 700 }}
                      >
                        <ul className="grid w-full gap-3 p-4 md:grid-cols-2">
                          {link.items.map((item) => (
                            <ListItem
                              key={item.title}
                              title={item.title}
                              href={item.href}
                            >
                              {item.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right toolbar */}
        <div className="flex items-center justify-end space-x-4 ml-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search modules or profiles..." className="pl-9" />
          </div>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
