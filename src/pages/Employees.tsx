import { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const employees = [
    {
      id: 1,
      name: "Arjun Nair",
      role: "Senior Engineer",
      department: "Infrastructure",
      status: "active",
      availability: "Available",
      email: "arjun.nair@kmrl.gov.in",
      phone: "+91 98765 43210",
      location: "Aluva Station",
      recentActivity: "Updated safety protocols - 2 hours ago",
      documentsHandled: 8,
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Priya Menon",
      role: "Financial Analyst",
      department: "Budget Planning",
      status: "active",
      availability: "In Meeting",
      email: "priya.menon@kmrl.gov.in",
      phone: "+91 98765 43211",
      location: "Head Office",
      recentActivity: "Reviewed quarterly budget - 1 hour ago",
      documentsHandled: 12,
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      role: "Procurement Manager",
      department: "Vendor Relations",
      status: "active",
      availability: "Available",
      email: "rajesh.kumar@kmrl.gov.in",
      phone: "+91 98765 43212",
      location: "Ernakulam South",
      recentActivity: "Processed vendor contracts - 30 minutes ago",
      documentsHandled: 15,
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Meera Pillai",
      role: "Systems Engineer",
      department: "Technical Operations",
      status: "offline",
      availability: "Off Duty",
      email: "meera.pillai@kmrl.gov.in",
      phone: "+91 98765 43213",
      location: "Kakkanad",
      recentActivity: "System maintenance completed - 1 day ago",
      documentsHandled: 6,
      avatar: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Suresh Babu",
      role: "Finance Officer",
      department: "Accounts",
      status: "active",
      availability: "Field Work",
      email: "suresh.babu@kmrl.gov.in",
      phone: "+91 98765 43214",
      location: "MG Road Station",
      recentActivity: "Audit documentation review - 3 hours ago",
      documentsHandled: 10,
      avatar: "/placeholder.svg"
    },
    {
      id: 6,
      name: "Anitha Raj",
      role: "Procurement Specialist",
      department: "Contract Management",
      status: "active",
      availability: "Available",
      email: "anitha.raj@kmrl.gov.in",
      phone: "+91 98765 43215",
      location: "Head Office",
      recentActivity: "Contract negotiations - 45 minutes ago",
      documentsHandled: 9,
      avatar: "/placeholder.svg"
    }
  ];

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

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || employee.department.toLowerCase().includes(departmentFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
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
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
  );
};

export default Employees;