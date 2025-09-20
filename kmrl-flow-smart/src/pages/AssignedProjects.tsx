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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Loader2,
  FileImage,
  FileVideo,
  FileArchive,
  X
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAssignedProjects, updateProject, createSampleProjects, apiFetch, type Project } from "@/lib/api";
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDocuments, setProjectDocuments] = useState<any[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [viewProjectOpen, setViewProjectOpen] = useState(false);
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

  // Function to view project details and fetch related documents
  const handleViewProject = async (project: Project) => {
    setSelectedProject(project);
    setViewProjectOpen(true);
    setProjectDocuments([]);
    
    // If project has a related document, fetch it by ID
    if (project.relatedDocumentId) {
      setLoadingDocuments(true);
      try {
        const response = await apiFetch(`/api/documents/${project.relatedDocumentId}`);
        if (response.document) {
          setProjectDocuments([response.document]);
        }
      } catch (err) {
        console.error("Failed to fetch project document:", err);
        toast({
          title: "Warning",
          description: "Could not load project document. You may not have access to this document.",
          variant: "destructive",
        });
      } finally {
        setLoadingDocuments(false);
      }
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

  const getFileIcon = (type: string) => {
    switch ((type || "").toLowerCase()) {
      case "pdf":
        return <FileText className="w-5 h-5 text-destructive" />;
      case "docx":
      case "doc":
        return <FileText className="w-5 h-5 text-primary" />;
      case "xlsx":
      case "xls":
        return <FileText className="w-5 h-5 text-success" />;
      case "jpg":
      case "png":
      case "jpeg":
        return <FileImage className="w-5 h-5 text-accent" />;
      case "mp4":
      case "avi":
        return <FileVideo className="w-5 h-5 text-warning" />;
      default:
        return <FileArchive className="w-5 h-5 text-muted-foreground" />;
    }
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
            vinay
            
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
                      <DropdownMenuItem onClick={() => handleViewProject(project)}>
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
                    <Button size="sm" onClick={() => handleViewProject(project)}>
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

      {/* Project View Modal */}
      <Dialog open={viewProjectOpen} onOpenChange={setViewProjectOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Project Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Project Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {selectedProject.title}
                      </h2>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={getUrgencyColor(selectedProject.urgency)}>
                          <Flag className="w-3 h-3 mr-1" />
                          {selectedProject.urgency} Priority
                        </Badge>
                        <Badge className={getStatusColor(selectedProject.status)}>
                          {getStatusIcon(selectedProject.status)}
                          <span className="ml-1 capitalize">{selectedProject.status.replace("-", " ")}</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{selectedProject.description}</p>
                    </div>
                  </div>

                  {/* Project Info Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Assigned by:</span>
                        <span>{selectedProject.assignedBy}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Deadline:</span>
                        <span>{new Date(selectedProject.deadline).toLocaleDateString()}</span>
                        <span className={`ml-1 ${getDaysRemaining(selectedProject.deadline) < 0 ? 'text-destructive' : getDaysRemaining(selectedProject.deadline) < 7 ? 'text-warning' : 'text-muted-foreground'}`}>
                          ({getDaysRemaining(selectedProject.deadline) < 0 ? `${Math.abs(getDaysRemaining(selectedProject.deadline))} days overdue` : `${getDaysRemaining(selectedProject.deadline)} days left`})
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Time:</span>
                        <span>{selectedProject.spentHours}/{selectedProject.estimatedHours} hours</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Category:</span>
                        <span>{selectedProject.category}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Collaborators:</span>
                        <span>{selectedProject.collaborators.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span>{selectedProject.progress}%</span>
                    </div>
                    <Progress value={selectedProject.progress} className="h-2" />
                  </div>

                  {/* Tags */}
                  {selectedProject.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Collaborators */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground">Collaborators</h3>
                    <div className="flex -space-x-2">
                      {selectedProject.collaborators.slice(0, 5).map((collaborator, index) => (
                        <Avatar key={index} className="w-8 h-8 border-2 border-background">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {collaborator.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {selectedProject.collaborators.length > 5 && (
                        <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">+{selectedProject.collaborators.length - 5}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedProject.collaborators.join(", ")}
                    </div>
                  </div>
                </div>

                {/* Related Documents Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Related Documents
                    </h3>
                    {selectedProject.relatedDocumentId && (
                      <Badge variant="outline" className="text-xs">
                        {projectDocuments.length} document{projectDocuments.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>

                  {loadingDocuments ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mr-2" />
                      <span className="text-muted-foreground">Loading documents...</span>
                    </div>
                  ) : projectDocuments.length > 0 ? (
                    <div className="space-y-3">
                      {projectDocuments.map((doc) => (
                        <Card key={doc.id} className="border border-border">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start space-x-3 flex-1">
                                {getFileIcon(doc.mimeType?.split("/")[1] || "")}
                                <div className="flex-1">
                                  <h4 className="font-medium text-foreground mb-1">
                                    {doc.title || doc.fileName}
                                  </h4>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {doc.mimeType} • {(doc.fileSize / 1024).toFixed(1)} KB
                                    </Badge>
                                    {doc.urgency && (
                                      <Badge className={`text-xs ${getUrgencyColor(doc.urgency)}`}>
                                        {doc.urgency}
                                      </Badge>
                                    )}
                                  </div>
                                  {doc.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {doc.description}
                                    </p>
                                  )}
                                  {doc.tags && doc.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {doc.tags.map((tag: string, index: number) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => window.open(doc.url, "_blank")}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => window.open(doc.url, "_blank")}
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : selectedProject.relatedDocumentId ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No documents found for this project</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>This project has no related documents</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignedProjects;