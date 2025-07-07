import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if credentials match
    if (credentials.username === "jojomoto" && credentials.password === "jojo@123") {
      toast({
        title: "Login Successful",
        description: "Welcome to the Motojojo admin dashboard.",
      });
      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 pb-20 md:pb-16">
        <div className="container-padding max-w-md w-full">
          <FadeIn>
            <Card className="border-none shadow-soft">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>
                  Sign in to access the Motojojo admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="username" 
                        name="username"
                        placeholder="Enter your username"
                        className="pl-10"
                        value={credentials.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        name="password"
                        type="password" 
                        placeholder="Enter your password"
                        className="pl-10"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                  For demo purposes, use: jojomoto / jojo@123
                </p>
              </CardFooter>
            </Card>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
      <div className="mt-8 flex flex-col items-center">
        <Link to="/response">
          <Button className="bg-violet text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-violet-700 transition-colors">
            Responses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Admin;
