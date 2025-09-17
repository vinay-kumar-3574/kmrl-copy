import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  Upload,
  MessageSquare,
  Activity,
  UserCircle,
  HelpCircle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const EngineeringDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sector = "engineering";

  const sectorData = {
    title: "Engineering Dashboard",
    stats: [
      { title: "Active Projects", value: "12", change: "+2", icon: FileText, color: "text-primary" },
      { title: "Team Members", value: "45", change: "+5", icon: Users, color: "text-success" },
      { title: "Critical Alerts", value: "3", change: "-1", icon: AlertTriangle, color: "text-destructive" },
      { title: "Pending Reviews", value: "8", change: "0", icon: Clock, color: "text-warning" },
    ],
    recentActivities: [
      { title: "Safety Protocol Updated", time: "2 hours ago", type: "document" },
      { title: "Bridge Inspection Report", time: "4 hours ago", type: "upload" },
      { title: "Team Meeting Scheduled", time: "6 hours ago", type: "meeting" },
      { title: "Compliance Check Completed", time: "1 day ago", type: "completed" },
    ]
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-4 h-4" />;
      case "upload": return <Upload className="w-4 h-4" />;
      case "meeting": return <MessageSquare className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "document": return "text-primary";
      case "upload": return "text-accent";
      case "meeting": return "text-warning";
      case "completed": return "text-success";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="dashboard-content flex-1">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {sectorData.title}
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening in your sector today.
            </p>
          </div>
          <div className="mt-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Profile menu" className="rounded-full p-1 hover:bg-muted">
                  <UserCircle className="w-8 h-8" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(`/dashboard/${sector}/profile`)}>
                  <UserCircle className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/dashboard/${sector}/settings`)}>
                  <HelpCircle className="w-4 h-4 mr-2" /> Help
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sectorData.stats.map((stat, index) => (
            <Card key={index} className="kmrl-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          stat.change.startsWith("+") && "bg-success/10 text-success",
                          stat.change.startsWith("-") && "bg-destructive/10 text-destructive",
                          stat.change === "0" && "bg-muted"
                        )}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-lg bg-muted", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 kmrl-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 kmrl-transition">
                    <div className={cn("p-2 rounded-full bg-muted", getActivityColor(activity.type))}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-card-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="kmrl-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate(`/dashboard/${sector}/documents`)}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate(`/dashboard/${sector}/employees`)}
              >
                <Users className="w-4 h-4 mr-2" />
                View Team Status
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate(`/dashboard/${sector}/projects`)}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Projects
              </Button>
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => navigate(`/dashboard/${sector}/collaboration`)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Start Collaboration
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 kmrl-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success mb-2">94%</div>
                <p className="text-sm text-muted-foreground">Document Processing Efficiency</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">2.5 hrs</div>
                <p className="text-sm text-muted-foreground">Average Response Time</p>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent mb-2">18</div>
                <p className="text-sm text-muted-foreground">Active Collaborations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default EngineeringDashboard;


