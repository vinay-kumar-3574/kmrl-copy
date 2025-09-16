import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, FileText, Lock, User, Zap, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { sector } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const sectorConfig = {
    engineering: {
      title: "Engineering Sector",
      description: "Access your technical documentation and infrastructure management dashboard",
      icon: Zap,
      color: "from-primary to-primary-light",
      dashboardPath: "/dashboard/engineering"
    },
    finance: {
      title: "Finance Sector", 
      description: "Manage financial documents, budgets, and compliance reports",
      icon: FileText,
      color: "from-success to-success-light",
      dashboardPath: "/dashboard/finance"
    },
    procurement: {
      title: "Procurement Sector",
      description: "Handle vendor management, contracts, and procurement workflows",
      icon: Users,
      color: "from-accent to-accent-light",
      dashboardPath: "/dashboard/procurement"
    }
  };

  const currentSector = sector ? sectorConfig[sector as keyof typeof sectorConfig] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      toast({
        title: "Login Successful",
        description: `Welcome to ${currentSector?.title || 'KMRL CMS'}`,
      });
      
      if (currentSector) {
        navigate(currentSector.dashboardPath);
      } else {
        navigate("/dashboard");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Login Card */}
        <Card className="kmrl-card kmrl-shadow-strong">
          <CardHeader className="text-center pb-6">
            {currentSector && (
              <div className={`w-16 h-16 bg-gradient-to-br ${currentSector.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <currentSector.icon className="w-8 h-8 text-white" />
              </div>
            )}
            
            <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
              {currentSector ? currentSector.title : "KMRL CMS Login"}
            </CardTitle>
            
            <p className="text-muted-foreground">
              {currentSector ? currentSector.description : "Sign in to access your dashboard"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 kmrl-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 kmrl-input"
                    required
                  />
                </div>
              </div>

              <Alert className="border-primary/20 bg-primary/5">
                <FileText className="w-4 h-4" />
                <AlertDescription className="text-sm">
                  Demo credentials: Use any email and password to access the dashboard.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow kmrl-transition py-3"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Need help? Contact your system administrator
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-primary-foreground/70 text-sm">
            Secured by government-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;