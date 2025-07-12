import { useState, useEffect } from "react";
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
import { Lock, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { Skeleton } from "@/components/ui/skeleton";

const HostLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, isSignedIn, isHost, isLoaded } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if already authenticated as host
  useEffect(() => {
    if (isLoaded && isSignedIn && isHost) {
      navigate("/host/dashboard");
    }
  }, [isLoaded, isSignedIn, isHost, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(credentials.email, credentials.password);
    setLoading(false);
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials or not invited as host.",
        variant: "destructive"
      });
      return;
    }
    // Wait for isHost to update
    setTimeout(() => {
      if (isHost) {
        toast({
          title: "Login Successful",
          description: "Welcome to the Motojojo host dashboard.",
        });
        navigate("/host/dashboard");
      } else {
        toast({
          title: "Access Denied",
          description: "You are not a host. Please use a host invite.",
          variant: "destructive"
        });
      }
    }, 500);
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      toast({
        title: "Google Auth Failed",
        description: error.message,
        variant: "destructive"
      });
    }
    setGoogleLoading(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Skeleton className="h-8 w-3/4 mb-6" />
          <Skeleton className="h-32 w-full mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 pb-20 md:pb-16">
        <div className="container-padding max-w-md w-full">
          <FadeIn>
            <Card className="border-none shadow-soft">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Calendar className="h-12 w-12 text-violet" />
                </div>
                <CardTitle className="text-2xl">Host Login</CardTitle>
                <CardDescription>
                  Sign in to access the Motojojo host dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-50 mb-6"
                  disabled={googleLoading}
                >
                  <FcGoogle className="w-5 h-5" />
                  {googleLoading ? 'Redirecting...' : 'Continue with Google'}
                </Button>
                <div className="w-full flex items-center gap-2 mb-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-black">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-black" />
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 text-black"
                        value={credentials.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-black">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-black" />
                      <Input 
                        id="password" 
                        name="password"
                        type="password" 
                        placeholder="Enter your password"
                        className="pl-10 text-black"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full text-black" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <p className="text-sm text-black text-center">
                  Only invited hosts can sign in here.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Admin Login
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="sm">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostLogin; 