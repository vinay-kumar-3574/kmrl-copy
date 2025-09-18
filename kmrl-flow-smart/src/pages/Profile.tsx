import { useEffect, useMemo, useState } from "react";
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
import { useAuthContext } from "@/providers/AuthProvider";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const { sector } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activity, setActivity] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch("/api/users/me");
        setProfile(res?.user || {});
      } catch {}
    };
    load();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [a, p, ac] = await Promise.all([
          apiFetch("/api/users/me/activity"),
          apiFetch("/api/users/me/projects"),
          apiFetch("/api/users/me/achievements"),
        ]);
        setActivity(Array.isArray(a?.activity) ? a.activity : []);
        setProjects(Array.isArray(p?.projects) ? p.projects : []);
        setAchievements(Array.isArray(ac?.achievements) ? ac.achievements : []);
      } catch {}
    })();
  }, []);

  const userProfile = useMemo(() => ({
    name: profile?.name || user?.displayName || user?.email || "User",
    role: profile?.title || "Employee",
    department: profile?.department || "General",
    sector: profile?.sector || (sector ? sector.charAt(0).toUpperCase() + sector.slice(1) : "General"),
    email: user?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    joinDate: profile?.joinedAt ? new Date(profile.joinedAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : "",
    employeeId: profile?.employeeId || (user?.uid ? `KMRL-${user.uid.slice(0,6)}` : ""),
    avatar: profile?.avatar || "/placeholder.svg",
    bio: profile?.bio || "",
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    achievements: [],
  }), [profile, user, sector]);

  const stats = {
    documentsProcessed: 156,
    projectsCompleted: 12,
    collaborations: 28,
    mentionsReceived: 45
  };

  const recentActivities = activity.map((it) => ({
    id: it.id,
    type: it.type || "document",
    title: it.title || it.summary || "",
    time: it.createdAt ? new Date(it.createdAt).toLocaleString() : "",
    status: it.status || "completed",
  }));

  const currentProjects = projects.map((p) => ({
    id: p.id,
    name: p.name || p.title || "",
    progress: typeof p.progress === "number" ? p.progress : 0,
    status: p.status || "On Track",
    deadline: p.deadline || (p.endDate ? new Date(p.endDate).toLocaleDateString() : ""),
  }));

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
                    <Badge variant="outline">Employee ID: {userProfile.employeeId}</Badge>
                    <Badge variant="outline">Since {userProfile.joinDate || '—'}</Badge>
                  </div>
                  
                <div className="flex space-x-2 lg:justify-end">
                  <Button variant="outline" size="sm" onClick={() => { window.location.href = "/settings"; }}>
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
              {achievements.map((achievement, index) => (
                <Card key={index} className="kmrl-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{achievement.title || achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.date ? new Date(achievement.date).toLocaleDateString() : ""}</p>
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