import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { FadeIn } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar, User, Phone, MapPin, FileText } from "lucide-react";
import { acceptHostInvitation } from "@/services/hostService";
import { Skeleton } from "@/components/ui/skeleton";

const HostInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    hostName: "",
    phone: "",
    city: "",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [invitationValid, setInvitationValid] = useState<boolean | null>(null);
  const [invitationToken, setInvitationToken] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setInvitationToken(token);
      // Here you could validate the token by calling an API
      setInvitationValid(true);
    } else {
      setInvitationValid(false);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.hostName.trim()) {
      toast({
        title: "Error",
        description: "Host name is required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const result = await acceptHostInvitation(
        invitationToken,
        formData.hostName,
        formData.phone || undefined,
        formData.city || undefined,
        formData.bio || undefined
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Host invitation accepted successfully! You can now sign in as a host.",
        });
        navigate("/host/login");
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to accept invitation",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (invitationValid === null) {
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

  if (invitationValid === false) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 pb-20 md:pb-16">
          <div className="container-padding max-w-md w-full">
            <FadeIn>
              <Card className="border-none shadow-soft">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Calendar className="h-12 w-12 text-red-500" />
                  </div>
                  <CardTitle className="text-2xl">Invalid Invitation</CardTitle>
                  <CardDescription>
                    This invitation link is invalid or has expired.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 mb-6">
                    Please contact the administrator for a new invitation.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={() => navigate("/")}>
                    Back to Home
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          </div>
        </main>
        <Footer />
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
                <CardTitle className="text-2xl">Accept Host Invitation</CardTitle>
                <CardDescription>
                  Complete your host profile to start managing events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="hostName" className="text-black">Host Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-black" />
                      <Input 
                        id="hostName" 
                        name="hostName"
                        type="text"
                        placeholder="Enter your host name"
                        className="pl-10 text-black"
                        value={formData.hostName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-black">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-black" />
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-10 text-black"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-black">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-black" />
                      <Input 
                        id="city" 
                        name="city"
                        type="text"
                        placeholder="Enter your city"
                        className="pl-10 text-black"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-black">Bio</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-black" />
                      <Textarea 
                        id="bio" 
                        name="bio"
                        placeholder="Tell us about yourself..."
                        className="pl-10 text-black min-h-[100px]"
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full text-black" disabled={loading}>
                    {loading ? "Accepting Invitation..." : "Accept Invitation"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-black text-center">
                  By accepting this invitation, you agree to become a host for Motojojo events.
                </p>
              </CardFooter>
            </Card>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HostInvitation; 