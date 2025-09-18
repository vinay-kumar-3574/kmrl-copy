import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Bell, 
  FileText, 
  Calendar,
  Filter,
  Eye,
  Archive
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const Alerts = () => {
  const { sector } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/api/alerts");
        setAlerts(data.alerts || []);
      } catch (e) {
        setAlerts([]);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className="dashboard-content">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Alerts & Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay updated with critical alerts, compliance deadlines, and important notifications.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="kmrl-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Alerts</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warnings</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`kmrl-card`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full bg-primary/10 text-primary`}>
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg text-card-foreground">
                            {alert.title}
                          </h3>
                          <Badge className="bg-primary text-primary-foreground">New</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">Recent upload</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{new Date(alert.time).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;