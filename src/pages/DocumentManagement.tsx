import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  Download, 
  Share, 
  Eye, 
  Brain, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Users,
  MessageSquare,
  Tag,
  Filter,
  Search,
  FileImage,
  FileVideo,
  FileArchive,
  MoreVertical
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const DocumentManagement = () => {
  const { sector } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const [documents] = useState([
    {
      id: 1,
      name: "Safety Protocol Manual v2.3",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "Arjun Nair",
      uploadDate: "2024-01-15",
      status: "processed",
      language: "English",
      department: "Engineering",
      urgency: "high",
      aiSummary: "Updated safety protocols for station operations with new emergency procedures.",
      tags: ["safety", "emergency", "protocols"],
      comments: 3,
      shares: 7
    },
    {
      id: 2,
      name: "Quarterly Budget Report Q4",
      type: "XLSX",
      size: "1.8 MB",
      uploadedBy: "Priya Menon",
      uploadDate: "2024-01-14",
      status: "processing",
      language: "English",
      department: "Finance",
      urgency: "medium",
      aiSummary: "Processing financial data and budget allocations...",
      tags: ["budget", "quarterly", "finance"],
      comments: 1,
      shares: 4
    },
    {
      id: 3,
      name: "Vendor Contract Agreement",
      type: "DOCX",
      size: "856 KB",
      uploadedBy: "Rajesh Kumar",
      uploadDate: "2024-01-13",
      status: "processed",
      language: "English",
      department: "Procurement",
      urgency: "high",
      aiSummary: "Contract terms with new vendor for maintenance services, includes pricing and SLA details.",
      tags: ["contract", "vendor", "maintenance"],
      comments: 5,
      shares: 2
    },
    {
      id: 4,
      name: "സുരക്ഷാ നിർദ്ദേശങ്ങൾ",
      type: "PDF",
      size: "3.1 MB",
      uploadedBy: "Meera Pillai",
      uploadDate: "2024-01-12",
      status: "processed",
      language: "Malayalam",
      department: "Engineering",
      urgency: "medium",
      aiSummary: "Safety guidelines in Malayalam for local staff and emergency procedures.",
      tags: ["സുരക്ഷ", "നിർദ്ദേശങ്ങൾ", "malayalam"],
      comments: 2,
      shares: 8
    }
  ]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setUploadProgress(0);

    // Simulate file upload and AI processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast({
            title: "Upload Successful",
            description: `${files.length} document(s) uploaded and processed successfully.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "processing":
        return <Clock className="w-4 h-4 text-warning animate-spin" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="dashboard-content flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Document Management
          </h1>
          <p className="text-muted-foreground">
            Upload, process, and manage documents with AI-powered analysis and multilingual support.
          </p>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload & Process</TabsTrigger>
            <TabsTrigger value="documents">Document Library</TabsTrigger>
            <TabsTrigger value="export">Export & Share</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {/* Upload Section */}
            <Card className="kmrl-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Document Upload</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drag & Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    Drop your documents here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Supports PDF, DOCX, XLSX, images, and more. Multi-language support included.
                  </p>
                  <Button 
                    onClick={() => document.getElementById("file-input")?.click()}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    Browse Files
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                    className="hidden"
                    onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                  />
                </div>

                {/* Metadata Form */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="document-type">Document Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="policy">Policy Document</SelectItem>
                          <SelectItem value="report">Report</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="procedure">Procedure</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="urgency">Urgency Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="low">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="department">Target Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="procurement">Procurement</SelectItem>
                          <SelectItem value="all">All Departments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="language">Document Language</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="malayalam">Malayalam</SelectItem>
                          <SelectItem value="mixed">Mixed Languages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., safety, budget, urgent"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the document..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Processing Status */}
                {isProcessing && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Brain className="w-5 h-5 text-primary animate-pulse" />
                        <span className="font-medium text-primary">AI Processing in Progress...</span>
                      </div>
                      <Progress value={uploadProgress} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Extracting key points, deadlines, and generating summary...
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Search and Filters */}
            <Card className="kmrl-card">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search documents..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word Documents</SelectItem>
                      <SelectItem value="xlsx">Spreadsheets</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="processed">Processed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Documents Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="kmrl-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getFileIcon(doc.type)}
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">{doc.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {doc.type} • {doc.size}
                            </Badge>
                            <Badge className={`text-xs ${getUrgencyColor(doc.urgency)}`}>
                              {doc.urgency}
                            </Badge>
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
                            View Document
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Add Comment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className="text-muted-foreground">
                          {doc.status === "processing" ? "Processing..." : "Ready"}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {doc.language}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <strong>Uploaded by:</strong> {doc.uploadedBy}
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Department:</strong> {doc.department}
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Date:</strong> {doc.uploadDate}
                      </p>
                    </div>

                    {doc.status === "processed" && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-card-foreground">AI Summary</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{doc.aiSummary}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{doc.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share className="w-4 h-4" />
                          <span>{doc.shares}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card className="kmrl-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Share className="w-5 h-5" />
                  <span>Export & Share Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-card-foreground">Export Options</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Export as PDF Summary
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Export as Word Document
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Export as PowerPoint
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Share className="w-4 h-4 mr-2" />
                        Generate Email Snippet
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-card-foreground">Share with Departments</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Share with Engineering
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Share with Finance
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Share with Procurement
                      </Button>
                      <Button className="w-full">
                        <Share className="w-4 h-4 mr-2" />
                        Share with All Departments
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="share-message">Share Message</Label>
                  <Textarea
                    id="share-message"
                    placeholder="Add a message when sharing this document..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DocumentManagement;