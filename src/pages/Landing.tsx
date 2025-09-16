import { ArrowRight, FileText, Users, Zap, Shield, Globe, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-kmrl.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const sectors = [
    {
      id: "engineering",
      title: "Engineering Sector",
      description: "Manage technical documents, safety protocols, and infrastructure data with AI-powered analysis.",
      icon: Zap,
      color: "from-primary to-primary-light",
      path: "/login/engineering"
    },
    {
      id: "finance",
      title: "Finance Sector", 
      description: "Streamline financial documents, budgets, and compliance reports with intelligent processing.",
      icon: FileText,
      color: "from-success to-success-light",
      path: "/login/finance"
    },
    {
      id: "procurement",
      title: "Procurement Sector",
      description: "Optimize vendor management, contracts, and procurement workflows with automated insights.",
      icon: Users,
      color: "from-accent to-accent-light", 
      path: "/login/procurement"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Processing",
      description: "Intelligent document analysis and summarization in multiple languages"
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Government-grade security with role-based access control"
    },
    {
      icon: Globe,
      title: "Multilingual Support", 
      description: "Process documents in English and Malayalam with semantic search"
    },
    {
      icon: FileText,
      title: "Smart Collaboration",
      description: "Real-time collaboration with automated routing and notifications"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-foreground">KMRL CMS</h1>
                <p className="text-sm text-muted-foreground">Smart Document Management</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="KMRL CMS Platform" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero/80"></div>
        </div>
        
        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Transform Document Management for
              <span className="block text-accent-light">Kochi Metro Rail</span>
            </h1>
            <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              AI-driven CMS platform solving document overload with intelligent processing, 
              multilingual support, and seamless collaboration across Engineering, Finance, and Procurement sectors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent-light text-accent-foreground font-semibold px-8 py-4"
                onClick={() => document.getElementById('sectors')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-4"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Solving Critical Challenges
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform addresses document overload, operational inefficiencies, 
              and communication gaps across KMRL departments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="kmrl-card text-center p-6">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sector Selection */}
      <section id="sectors" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Choose Your Sector
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access your specialized dashboard with tailored features for your department's unique workflows.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sectors.map((sector) => (
              <Card 
                key={sector.id}
                className="sector-card group"
                onClick={() => navigate(sector.path)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${sector.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 kmrl-transition`}>
                    <sector.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-4">
                    {sector.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {sector.description}
                  </p>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    Access Dashboard
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">KMRL CMS Platform</p>
                <p className="text-sm text-muted-foreground">Kochi Metro Rail Limited</p>
              </div>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 Kochi Metro Rail Limited. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;