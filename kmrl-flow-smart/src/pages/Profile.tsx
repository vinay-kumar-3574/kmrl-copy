import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Trophy, 
  FileText, 
  Clock, 
  Users, 
  MessageSquare,
  Settings,
  Edit3,
  Star,
  Award,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Profile = () => {
  const { sector } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userProfile = {
    name: "John Doe",
    role: "Senior Engineer",
    department: "Infrastructure Development",
    sector: sector?.charAt(0).toUpperCase() + sector?.slice(1) || "Engineering",
    email: "john.doe@kmrl.gov.in",
    phone: "+91 98765 43210",
    location: "Head Office, Kochi",
    joinDate: "March 2023",
    employeeId: "KMRL-2024-001",
    avatar: "/placeholder.svg",
    bio: "Experienced infrastructure engineer with over 8 years in metro rail systems. Specializing in safety protocols and technical operations management.",
    skills: ["Project Management", "Safety Protocols", "Technical Analysis", "Team Leadership", "Documentation"],
    achievements: [
      { title: "Safety Excellence Award", date: "2024", icon: Award },
      { title: "Best Team Leader", date: "2023", icon: Users },
      { title: "Innovation Award", date: "2023", icon: Trophy },
      { title: "Document Management Champion", date: "2024", icon: FileText }
    ]
  };

  const stats = {
    documentsProcessed: 156,
    projectsCompleted: 12,
    collaborations: 28,
    mentionsReceived: 45
  };

  const recentActivities = [
    {
      id: 1,
      type: "document",
      title: "Updated Safety Protocol Manual v2.3",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "collaboration",
      title: "Participated in Q1 Budget Review Discussion",
      time: "4 hours ago",
      status: "active"
    },
    {
      id: 3,
      type: "project",
      title: "Completed Metro Line 2 Safety Assessment",
      time: "1 day ago",
      status: "completed"
    },
    {
      id: 4,
      type: "meeting",
      title: "Team Meeting: Infrastructure Planning",
      time: "2 days ago",
      status: "completed"
    }
  ];

  const currentProjects = [
    {
      id: 1,
      name: "Metro Line 3 Construction",
      progress: 75,
      status: "On Track",
      deadline: "Dec 2024"
    },
    {
      id: 2,
      name: "Safety System Upgrade",
      progress: 45,
      status: "In Progress",
      deadline: "Nov 2024"
    },
    {
      id: 3,
      name: "Station Accessibility Enhancement",
      progress: 90,
      status: "Near Completion",
      deadline: "Oct 2024"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-4 h-4" />;
      case "collaboration": return <MessageSquare className="w-4 h-4" />;
      case "project": return <CheckCircle className="w-4 h-4" />;
      case "meeting": return <Users className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-success";
      case "active": return "text-primary";
      case "pending": return "text-warning";
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
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="kmrl-card">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {userProfile.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">{userProfile.name}</h1>
                    <p className="text-lg text-muted-foreground">{userProfile.role}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{userProfile.department}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{userProfile.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 lg:text-right space-y-4">
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <Badge className="bg-primary/10 text-primary">{userProfile.sector} Sector</Badge>
                    <Badge variant="outline">ID: {userProfile.employeeId}</Badge>
                    <Badge variant="outline">Since {userProfile.joinDate}</Badge>
                  </div>
                  
                  <div className="flex space-x-2 lg:justify-end">
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="kmrl-card">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{stats.documentsProcessed}</div>
                  <p className="text-sm text-muted-foreground">Documents Processed</p>
                </CardContent>
              </Card>
              
              <Card className="kmrl-card">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-success mb-1">{stats.projectsCompleted}</div>
                  <p className="text-sm text-muted-foreground">Projects Completed</p>
                </CardContent>
              </Card>
              
              <Card className="kmrl-card">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-accent mb-1">{stats.collaborations}</div>
                  <p className="text-sm text-muted-foreground">Active Collaborations</p>
                </CardContent>
              </Card>
              
              <Card className="kmrl-card">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-warning mb-1">{stats.mentionsReceived}</div>
                  <p className="text-sm text-muted-foreground">Mentions Received</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Bio & Contact */}
              <Card className="kmrl-card">
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {userProfile.bio}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{userProfile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {userProfile.joinDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="kmrl-card">
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-muted hover:bg-muted/80">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="kmrl-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`p-2 rounded-full bg-muted ${getStatusColor(activity.status)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">{activity.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground">{activity.time}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              activity.status === 'completed' ? 'bg-success/10 text-success' :
                              activity.status === 'active' ? 'bg-primary/10 text-primary' :
                              'bg-muted'
                            }`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="kmrl-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Current Projects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentProjects.map((project) => (
                    <div key={project.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-card-foreground">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">Deadline: {project.deadline}</p>
                        </div>
                        <Badge 
                          className={
                            project.status === "On Track" ? "bg-success/10 text-success" :
                            project.status === "Near Completion" ? "bg-primary/10 text-primary" :
                            "bg-warning/10 text-warning"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {userProfile.achievements.map((achievement, index) => (
                <Card key={index} className="kmrl-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <achievement.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground">Awarded in {achievement.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;