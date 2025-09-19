import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getEmployees, shareDocumentWithDepartment, type Employee, type DocumentShareRequest } from "@/lib/api";
import { Users, Search, Building2 } from "lucide-react";

interface DepartmentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
}

const departments = [
  "Engineering",
  "Finance", 
  "Procurement",
  "Operations",
  "HR",
  "Legal",
  "Marketing",
  "IT"
];

export const DepartmentShareModal = ({ isOpen, onClose, documentId, documentTitle }: DepartmentShareModalProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const { toast } = useToast();

  // Fetch employees when department changes
  useEffect(() => {
    if (selectedDepartment) {
      setLoadingEmployees(true);
      getEmployees(selectedDepartment)
        .then(data => {
          setEmployees(data);
          setSelectedEmployees([]); // Reset selection when department changes
        })
        .catch(err => {
          console.error("Failed to fetch employees:", err);
          toast({
            title: "Error",
            description: "Failed to load employees for the selected department.",
            variant: "destructive",
          });
        })
        .finally(() => {
          setLoadingEmployees(false);
        });
    } else {
      setEmployees([]);
      setSelectedEmployees([]);
    }
  }, [selectedDepartment, toast]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeToggle = (employeeId: string) => {
    setSelectedEmployees(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleShare = async () => {
    if (!selectedDepartment || selectedEmployees.length === 0) {
      toast({
        title: "Error",
        description: "Please select a department and at least one employee.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const shareData: DocumentShareRequest = {
        department: selectedDepartment,
        employeeIds: selectedEmployees,
        message: message.trim() || undefined,
      };

      const result = await shareDocumentWithDepartment(documentId, shareData);
      
      toast({
        title: "Success",
        description: `Document shared with ${result.sharedWith.length} employee(s) in ${selectedDepartment} department.`,
      });

      // Reset form and close modal
      setSelectedDepartment("");
      setSelectedEmployees([]);
      setMessage("");
      setSearchTerm("");
      onClose();
    } catch (err) {
      console.error("Failed to share document:", err);
      toast({
        title: "Error",
        description: "Failed to share document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDepartment("");
    setSelectedEmployees([]);
    setMessage("");
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Share Document with Department
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 overflow-y-auto">
          {/* Document Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Document</h4>
            <p className="font-medium">{documentTitle}</p>
          </div>

          {/* Department Selection */}
          <div className="space-y-2">
            <Label htmlFor="department">Select Department</Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a department..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

              {/* Employee Selection */}
              {selectedDepartment && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Select Employees</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {selectedEmployees.length} selected
                      </Badge>
                      {filteredEmployees.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const allSelected = filteredEmployees.every(emp => selectedEmployees.includes(emp.id));
                            if (allSelected) {
                              setSelectedEmployees([]);
                            } else {
                              setSelectedEmployees(filteredEmployees.map(emp => emp.id));
                            }
                          }}
                          className="text-xs"
                        >
                          {filteredEmployees.every(emp => selectedEmployees.includes(emp.id)) ? "Deselect All" : "Select All"}
                        </Button>
                      )}
                    </div>
                  </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Employee List */}
              <div className="border rounded-md">
                <ScrollArea className="h-80">
                  {loadingEmployees ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Loading employees...
                    </div>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      {employees.length === 0 
                        ? "No employees found in this department."
                        : "No employees match your search."
                      }
                    </div>
                  ) : (
                    <div className="p-2 space-y-2">
                      {filteredEmployees.map(employee => (
                        <div
                          key={employee.id}
                          className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                          onClick={() => handleEmployeeToggle(employee.id)}
                        >
                          <Checkbox
                            checked={selectedEmployees.includes(employee.id)}
                            onChange={() => handleEmployeeToggle(employee.id)}
                          />
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {employee.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{employee.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {employee.title} • {employee.employeeId}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a message for the recipients..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Selected Employees Summary */}
          {selectedEmployees.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Employees</Label>
              <div className="flex flex-wrap gap-2">
                {selectedEmployees.map(empId => {
                  const employee = employees.find(emp => emp.id === empId);
                  return employee ? (
                    <Badge key={empId} variant="outline" className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {employee.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleShare} 
            disabled={loading || !selectedDepartment || selectedEmployees.length === 0}
          >
            {loading ? "Sharing..." : `Share with ${selectedEmployees.length} Employee(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
