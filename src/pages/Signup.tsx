import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, User, Lock, BadgeCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StoredUser = {
  username: string;
  password: string;
};

function loadUsers(): Record<string, StoredUser> {
  try {
    const raw = localStorage.getItem("kmrlUsers");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistUsers(users: Record<string, StoredUser>) {
  localStorage.setItem("kmrlUsers", JSON.stringify(users));
}

function generateEmployeeId(existing: Record<string, StoredUser>): string {
  let id = "";
  do {
    id = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
  } while (existing[id]);
  return id;
}

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const users = loadUsers();
      const employeeId = generateEmployeeId(users);
      users[employeeId] = { username: form.username.trim(), password: form.password };
      persistUsers(users);

      alert(`Signup successful!\n\nYour Employee ID is ${employeeId}.\nUse this ID with your password to log in.`);

      navigate("/login");
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="kmrl-card kmrl-shadow-strong">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BadgeCheck className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
              Create your account
            </CardTitle>
            <p className="text-muted-foreground">Sign up with a username and password</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-card-foreground font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={(e) => handleChange("username", e.target.value)}
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
                    placeholder="Create a password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pl-10 kmrl-input"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <Alert className="border-primary/20 bg-primary/5">
                <AlertDescription className="text-sm">
                  After signup, you'll get a 10-digit Employee ID. Use it with your password to log in.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow kmrl-transition py-3"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Already have an account? <button className="underline" onClick={() => navigate("/login")}>Sign In</button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;


