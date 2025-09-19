import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import SectorSelection from "./pages/SectorSelection";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import DocumentManagement from "./pages/DocumentManagement";
import AssignedProjects from "./pages/AssignedProjects";
import SearchFilter from "./pages/SearchFilter";
import Collaboration from "./pages/Collaboration";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import EngineeringDashboard from "./pages/dashboards/EngineeringDashboard";
import FinanceDashboard from "./pages/dashboards/FinanceDashboard";
import ProcurementDashboard from "./pages/dashboards/ProcurementDashboard";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/choose-sector" element={<SectorSelection />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/:sector" element={<Login />} />
          {/* Explicit sector dashboards */}
          <Route path="/dashboard/engineering" element={<EngineeringDashboard />} />
          <Route path="/dashboard/finance" element={<FinanceDashboard />} />
          <Route path="/dashboard/procurement" element={<ProcurementDashboard />} />
          {/* Fallback generic sector route (optional) */}
          <Route path="/dashboard/:sector" element={<Dashboard />} />
          <Route path="/dashboard/:sector/employees" element={<Employees />} />
          <Route path="/dashboard/:sector/documents" element={<DocumentManagement />} />
          <Route path="/dashboard/:sector/projects" element={<AssignedProjects />} />
          <Route path="/dashboard/:sector/search" element={<SearchFilter />} />
          <Route path="/dashboard/:sector/collaboration" element={<Collaboration />} />
          <Route path="/dashboard/:sector/alerts" element={<Alerts />} />
          <Route path="/dashboard/:sector/settings" element={<Settings />} />
          <Route path="/dashboard/:sector/profile" element={<Profile />} />
          <Route path="/dashboard/:sector/*" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
