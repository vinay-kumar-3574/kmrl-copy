import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  FileText, 
  MessageSquare,
  MoreVertical,
  Eye,
  Edit,
  Share2,
  Download,
  Flag,
  Users,
  Loader2
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAssignedProjects, updateProject, createSampleProjects, type Project } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AssignedProjects = () => {
  const { sector } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch assigned projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAssignedProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch assigned projects:", err);
        setError(err instanceof Error ? err.message : "Failed to load projects");
        toast({
          title: "Error",
          description: "Failed to load assigned projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [toast]);

  // Function to update project status or progress
  const handleProjectUpdate = async (projectId: string, updates: Partial<Pick<Project, "status" | "progress" | "spentHours">>) => {
    try {
      await updateProject(projectId, updates);
      
      // Update local state
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates }
          : project
      ));
      
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (err) {
      console.error("Failed to update project:", err);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to create sample projects for testing
  const handleCreateSampleProjects = async () => {
    try {
      setLoading(true);
      await createSampleProjects();
      
      // Refresh the projects list
      const data = await getAssignedProjects();
      setProjects(data);
      
      toast({
        title: "Success",
        description: "Sample projects created successfully",
      });
    } catch (err) {
      console.error("Failed to create sample projects:", err);
      toast({
        title: "Error",
        description: "Failed to create sample projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-destructive/10 text-destructive";
      case "medium":
        return "bg-warning/10 text-warning";
      case "low":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success";
      case "in-progress":
        return "bg-primary/10 text-primary";
      case "review":
        return "bg-accent/10 text-accent";
      case "planning":
        return "bg-warning/10 text-warning";
      case "overdue":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "overdue":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesUrgency = urgencyFilter === "all" || project.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const projectStats = {
    total: projects.length,
    completed: projects.filter(p => p.status === "completed").length,
    inProgress: projects.filter(p => p.status === "in-progress").length,
    overdue: projects.filter(p => p.status === "overdue").length
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="dashboard-content flex-1">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Assigned Projects
          </h1>
          <p className="text-muted-foreground">
            Manage your assigned projects with deadlines, progress tracking, and collaboration tools.
          </p>
            </div>
            {projects.length === 0 && !loading && (
              <Button onClick={handleCreateSampleProjects} variant="outline">
                Create Sample Projects
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="kmrl-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{projectStats.total}</div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </CardContent>
          </Card>
          
          <Card className="kmrl-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{projectStats.inProgress}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          
          <Card className="kmrl-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-success mb-1">{projectStats.completed}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="kmrl-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-destructive mb-1">{projectStats.overdue}</div>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="kmrl-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects by title, description, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="kmrl-card">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Loading Projects</h3>
              <p className="text-muted-foreground">Please wait while we fetch your assigned projects...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="kmrl-card">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Projects</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="kmrl-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge className={getUrgencyColor(project.urgency)}>
                        <Flag className="w-3 h-3 mr-1" />
                        {project.urgency} Priority
                      </Badge>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1 capitalize">{project.status.replace("-", " ")}</span>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{project.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Assigned by {project.assignedBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                        <span className={`ml-1 ${getDaysRemaining(project.deadline) < 0 ? 'text-destructive' : getDaysRemaining(project.deadline) < 7 ? 'text-warning' : 'text-muted-foreground'}`}>
                          ({getDaysRemaining(project.deadline) < 0 ? `${Math.abs(getDaysRemaining(project.deadline))} days overdue` : `${getDaysRemaining(project.deadline)} days left`})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{project.documents} documents</span>
                        {project.relatedDocumentId && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            From Document
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{project.spentHours}/{project.estimatedHours} hours</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {project.relatedDocumentId && (
                        <DropdownMenuItem onClick={() => window.open(`/documents`, '_blank')}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Related Document
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      {project.status !== "completed" && (
                        <DropdownMenuItem 
                          onClick={() => handleProjectUpdate(project.id, { status: "completed", progress: 100 })}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      {project.status !== "in-progress" && project.status !== "completed" && (
                        <DropdownMenuItem 
                          onClick={() => handleProjectUpdate(project.id, { status: "in-progress" })}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Start Project
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Project
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Collaborators & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-muted-foreground">Collaborators:</span>
                    <div className="flex -space-x-2">
                      {project.collaborators.slice(0, 3).map((collaborator, index) => (
                        <Avatar key={index} className="w-6 h-6 border-2 border-background">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {collaborator.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.collaborators.length > 3 && (
                        <div className="w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">+{project.collaborators.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Discuss
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Documents
                    </Button>
                    <Button size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        {filteredProjects.length === 0 && (
          <Card className="kmrl-card">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Found</h3>
                  <p className="text-muted-foreground">
                    {projects.length === 0 
                      ? "You don't have any assigned projects yet." 
                      : "No projects match your current filters. Try adjusting your search criteria."
                    }
                  </p>
            </CardContent>
          </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AssignedProjects;