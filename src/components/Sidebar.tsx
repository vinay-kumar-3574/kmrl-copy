import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Upload, 
  Search, 
  MessageSquare, 
  Bell, 
  Settings, 
  FileText,
  Download,
  LogOut,
  Menu,
  X,
  Zap,
  DollarSign,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sector } = useParams();
  const [notifications] = useState(5);
  const routeSector = (sector || (location.pathname.match(/^\/dashboard\/(engineering|finance|procurement)/)?.[1])) as string | undefined;

  const sectorConfig = {
    engineering: {
      title: "Engineering",
      icon: Zap,
      color: "bg-primary",
    },
    finance: {
      title: "Finance", 
      icon: DollarSign,
      color: "bg-success",
    },
    procurement: {
      title: "Procurement",
      icon: Package,
      color: "bg-accent",
    }
  };

  const currentSector = routeSector ? sectorConfig[routeSector as keyof typeof sectorConfig] : null;

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard Overview",
      icon: Home,
      path: `/dashboard/${routeSector}`,
      badge: null,
    },
    {
      id: "employees",
      title: "Employees List",
      icon: Users,
      path: `/dashboard/${routeSector}/employees`,
      badge: null,
    },
    {
      id: "documents",
      title: "Document Management",
      icon: FileText,
      path: `/dashboard/${routeSector}/documents`,
      badge: null,
    },
    {
      id: "projects", 
      title: "Assigned Projects",
      icon: FileText,
      path: `/dashboard/${routeSector}/projects`,
      badge: null,
    },
    {
      id: "search",
      title: "Search & Filter",
      icon: Search,
      path: `/dashboard/${routeSector}/search`,
      badge: null,
    },
    {
      id: "collaboration",
      title: "Collaboration",
      icon: MessageSquare,
      path: `/dashboard/${routeSector}/collaboration`,
      badge: 3,
    },
    {
      id: "alerts",
      title: "Alerts & Notifications",
      icon: Bell,
      path: `/dashboard/${routeSector}/alerts`, 
      badge: notifications,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className={cn(
      "sidebar-nav flex flex-col h-screen kmrl-transition",
      isCollapsed ? "w-16" : "w-sidebar-width"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                currentSector?.color || "bg-primary"
              )}>
                {currentSector && <currentSector.icon className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="font-bold text-card-foreground">
                  {currentSector?.title || "KMRL CMS"}
                </h2>
                <p className="text-xs text-muted-foreground">Sector Dashboard</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hover:bg-muted"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={isActive(item.path) ? "default" : "ghost"}
            className={cn(
              "w-full justify-start h-12 kmrl-transition",
              isCollapsed ? "px-3" : "px-4",
              isActive(item.path) && "bg-primary text-primary-foreground shadow-md"
            )}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-2 px-2 py-1 text-xs bg-accent text-accent-foreground"
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Button>
        ))}
      </nav>

      <Separator />

      {/* User Section */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-12",
            isCollapsed ? "px-3" : "px-4"
          )}
          onClick={() => navigate(`/dashboard/${routeSector}/settings`)}
        >
          <Settings className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Settings</span>}
        </Button>

        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-12 text-destructive hover:text-destructive hover:bg-destructive/10",
            isCollapsed ? "px-3" : "px-4"
          )}
          onClick={() => navigate("/")}
        >
          <LogOut className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;