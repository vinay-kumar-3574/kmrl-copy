import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";
import { useAuthContext } from "@/providers/AuthProvider";
import { 
  Search, 
  Filter, 
  User, 
  MapPin, 
  Clock, 
  FileText, 
  Phone, 
  Mail,
  MoreVertical,
  Eye
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Employees = () => {
  const { sector } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { toast } = useToast();
  const { user } = useAuthContext();

  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpId, setNewEmpId] = useState("");
  const [newEmpDept, setNewEmpDept] = useState("");
  const [newEmpTitle, setNewEmpTitle] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch("/api/employees");
        setEmployees(Array.isArray(data?.employees) ? data.employees : []);
      } catch (e: any) {
        toast({ title: "Failed to load employees", description: e.message || "" });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [toast]);

  const displayEmployees = useMemo(() => {
    return employees.map((e) => ({
      id: e.id,
      name: e.name,
      role: e.title || "Employee",
      department: e.department || "General",
      status: "active",
      availability: "Available",
      email: e.email || "",
      phone: e.phone || "",
      location: e.location || "",
      recentActivity: e.recentActivity || "",
      documentsHandled: e.documentsHandled || 0,
      avatar: "/placeholder.svg",
    }));
  }, [employees]);

  const handleAddEmployee = async () => {
    if (!newEmpName || !newEmpId || !newEmpDept) {
      toast({ title: "Missing fields", description: "Name, Employee ID and Department are required." });
      return;
    }
    try {
      await apiFetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newEmpName, employeeId: newEmpId, department: newEmpDept, title: newEmpTitle || undefined, uid: user?.uid, email: user?.email || undefined }),
      });
      setAddOpen(false);
      setNewEmpName("");
      setNewEmpId("");
      setNewEmpDept("");
      setNewEmpTitle("");
      // refresh list
      const data = await apiFetch("/api/employees");
      setEmployees(Array.isArray(data?.employees) ? data.employees : []);
      toast({ title: "Employee added" });
    } catch (e: any) {
      toast({ title: "Add failed", description: e.message || "" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success">Active</Badge>;
      case "offline":
        return <Badge className="bg-muted text-muted-foreground">Offline</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "text-success";
      case "In Meeting":
        return "text-warning";
      case "Field Work":
        return "text-primary";
      case "Off Duty":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const filteredEmployees = displayEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || employee.department.toLowerCase().includes(departmentFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <>
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="dashboard-content flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Employee Directory
          </h1>
          <p className="text-muted-foreground">
            Manage and view team members across your sector with real-time status updates.
          </p>
          <div className="mt-4">
            <Button onClick={() => setAddOpen(true)}>Add Employee</Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="kmrl-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees by name, role, or department..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="budget">Budget Planning</SelectItem>
                  <SelectItem value="vendor">Vendor Relations</SelectItem>
                  <SelectItem value="technical">Technical Operations</SelectItem>
                  <SelectItem value="accounts">Accounts</SelectItem>
                  <SelectItem value="contract">Contract Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Employee Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading && <div className="text-sm text-muted-foreground">Loading employees...</div>}
          {!isLoading && filteredEmployees.length === 0 && (
            <div className="text-sm text-muted-foreground">No employees found.</div>
          )}
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="kmrl-card">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {employee.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{employee.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{employee.role}</p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/${sector}/profile`)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = `mailto:${employee.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/dashboard/${sector}/documents?employee=${employee.id}`)}>
                        <FileText className="w-4 h-4 mr-2" />
                        View Documents
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  {getStatusBadge(employee.status)}
                  <span className={`text-sm font-medium ${getAvailabilityColor(employee.availability)}`}>
                    {employee.availability}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{employee.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">Recent Activity</span>
                    <Badge variant="outline" className="text-xs">
                      {employee.documentsHandled} docs
                    </Badge>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">{employee.recentActivity}</p>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Footer */}
        <Card className="mt-8 kmrl-card">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-success mb-1">{filteredEmployees.filter(e => e.status === "active").length}</div>
                <p className="text-sm text-muted-foreground">Active Employees</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary mb-1">{filteredEmployees.filter(e => e.availability === "Available").length}</div>
                <p className="text-sm text-muted-foreground">Available Now</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning mb-1">{filteredEmployees.filter(e => e.availability === "In Meeting").length}</div>
                <p className="text-sm text-muted-foreground">In Meetings</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent mb-1">{filteredEmployees.filter(e => e.availability === "Field Work").length}</div>
                <p className="text-sm text-muted-foreground">Field Work</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>

    {/* Add Employee Dialog */}
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emp-name">Name</Label>
            <Input id="emp-name" value={newEmpName} onChange={(e) => setNewEmpName(e.target.value)} placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-id">Employee ID</Label>
            <Input id="emp-id" value={newEmpId} onChange={(e) => setNewEmpId(e.target.value)} placeholder="e.g., E001" />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={newEmpDept} onValueChange={setNewEmpDept}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Procurement">Procurement</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="emp-title">Title (optional)</Label>
            <Input id="emp-title" value={newEmpTitle} onChange={(e) => setNewEmpTitle(e.target.value)} placeholder="e.g., Senior Engineer" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEmployee}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default Employees;