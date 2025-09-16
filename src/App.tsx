import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import DocumentManagement from "./pages/DocumentManagement";
import SearchFilter from "./pages/SearchFilter";
import Collaboration from "./pages/Collaboration";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/:sector" element={<Login />} />
          <Route path="/dashboard/:sector" element={<Dashboard />} />
          <Route path="/dashboard/:sector/employees" element={<Employees />} />
          <Route path="/dashboard/:sector/documents" element={<DocumentManagement />} />
          <Route path="/dashboard/:sector/upload" element={<DocumentManagement />} />
          <Route path="/dashboard/:sector/search" element={<SearchFilter />} />
          <Route path="/dashboard/:sector/collaboration" element={<Collaboration />} />
          <Route path="/dashboard/:sector/alerts" element={<Alerts />} />
          <Route path="/dashboard/:sector/*" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
