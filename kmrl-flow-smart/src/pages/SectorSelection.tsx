import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Calculator, 
  ShoppingCart,
  ArrowRight,
  Building2
} from "lucide-react";

const SectorSelection = () => {
  const navigate = useNavigate();

  const sectors = [
    {
      id: "engineering",
      title: "Engineering Sector",
      description: "Infrastructure development, safety protocols, and technical operations management",
      icon: Wrench,
      color: "text-primary",
      bgColor: "bg-primary/10",
      stats: "45 Active Projects",
      path: "/login/engineering"
    },
    {
      id: "finance",
      title: "Finance Sector", 
      description: "Budget planning, financial analysis, and audit documentation management",
      icon: Calculator,
      color: "text-success",
      bgColor: "bg-success/10",
      stats: "156 Budget Items",
      path: "/login/finance"
    },
    {
      id: "procurement",
      title: "Procurement Sector",
      description: "Vendor management, contract negotiations, and procurement process optimization",
      icon: ShoppingCart,
      color: "text-accent",
      bgColor: "bg-accent/10", 
      stats: "89 Active Contracts",
      path: "/login/procurement"
    }
  ];

  const handleSectorSelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">KMRL CMS</h1>
                <p className="text-sm text-muted-foreground">Content Management System</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Sector
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Select your department to access your personalized dashboard with AI-powered document management,
            real-time collaboration, and sector-specific tools.
          </p>
        </div>

        {/* Sector Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sectors.map((sector) => (
            <Card 
              key={sector.id} 
              className="kmrl-card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => handleSectorSelect(sector.path)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${sector.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <sector.icon className={`w-8 h-8 ${sector.color}`} />
                </div>
                <CardTitle className="text-2xl mb-2">{sector.title}</CardTitle>
                <Badge variant="secondary" className="w-fit mx-auto">
                  {sector.stats}
                </Badge>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {sector.description}
                </p>
                
                <Button 
                  className="w-full group-hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSectorSelect(sector.path);
                  }}
                >
                  Access Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Preview */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            What You'll Get Access To
          </h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { title: "AI Document Processing", desc: "Intelligent summarization and extraction" },
              { title: "Real-time Collaboration", desc: "Team discussions and document sharing" },
              { title: "Multilingual Support", desc: "English and Malayalam compatibility" },
              { title: "Smart Notifications", desc: "Role-based alerts and deadlines" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 bg-primary rounded" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SectorSelection;