import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/motion";
import { ArrowLeft, Send, Users, Music, Camera, BookOpen, ChefHat, Video, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const JoJoGang = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    age: "",
    city: "",
    areaPincode: "",
    instagramLink: "",
    attendedGathering: "",
    position: "",
    additionalInfo: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phoneNumber', 'age', 'city', 'areaPincode', 'instagramLink', 'attendedGathering', 'position'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Validate age
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 16 || age > 100) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 16 and 100.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('jojo_gang_members')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone_number: formData.phoneNumber,
          age: age,
          city: formData.city,
          area_pincode: formData.areaPincode,
          instagram_link: formData.instagramLink,
          attended_gathering: formData.attendedGathering,
          position: formData.position,
          additional_info: formData.additionalInfo,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in joining the JoJo Gang! We'll be in touch soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        age: "",
        city: "",
        areaPincode: "",
        instagramLink: "",
        attendedGathering: "",
        position: "",
        additionalInfo: ""
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const positionOptions = [
    {
      value: "content-creator",
      label: "Content Creator",
      icon: <Camera className="h-5 w-5" />
    },
    {
      value: "artist",
      label: "Artist (Singer-Songwriter, Poet, Story-teller, Instrumentalist)",
      icon: <Music className="h-5 w-5" />
    },
    {
      value: "community-leader",
      label: "Community Leader (Anchoring & Managing a Gathering)",
      icon: <Mic className="h-5 w-5" />
    },
    {
      value: "general-volunteering",
      label: "General Volunteering (Helping in making gatherings a Killer experience for all)",
      icon: <Users className="h-5 w-5" />
    },
    {
      value: "space-provider",
      label: "Giving your space for the Gathering",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      value: "film-maker",
      label: "Independent film makers",
      icon: <Video className="h-5 w-5" />
    },
    {
      value: "cook-chef",
      label: "Being a Motojojo Rasoiya (Cook/Chef - Kitchen gathering)",
      icon: <ChefHat className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-raspberry">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/membership" className="inline-flex items-center text-sandstorm hover:text-yellow transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Membership
          </Link>
          
          <FadeIn delay={200}>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-sandstorm mb-4">
                The JoJo Gang!
              </h1>
              <div className="flex justify-center space-x-4 mb-6">
                <Users className="h-6 w-6 text-raspberry" />
                <Music className="h-6 w-6 text-violet" />
                <Camera className="h-6 w-6 text-sandstorm" />
                <ChefHat className="h-6 w-6 text-raspberry" />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Introduction */}
        <FadeIn delay={300}>
          <Card className="bg-white/10 mb-8 text-white">
            <CardContent className="p-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-white mb-4">
                  Motojojo is a lively and breathing community with the motive to build a safe, independent and exploratory space of artists, musicians, film-makers, photographers, poets and the misfits all across the country.
                </p>
                <p className="text-white/70 mb-4">
                  Motojojo is all about creating platforms to support different types of art. We organize mindful and intimate gatherings in everyday spaces, focused on different kinds of independent art including music, cooking, poetry, film-making, and story-telling. In the last seven years, Motojojo has done over 550+ events across 22+ cities in India, hosting over 20,000 guests and 2000 independent/originals artists; all with the help of YOU!
                </p>
                <p className="text-white/70 mb-4">
                  We are onboarding the next set of community members who will fuel up the coming months. We are restarting gatherings after a good long break and we want to revolutionize the scene of the community-based gatherings in India by the help of YOU! We are on a lookout for each one of you who can help make a gathering possible in your city.
                </p>
                <p className="text-white/70 mb-4">
                  So whoever you are, fill-up the form because there is something for everyone here!
                </p>
                <p className="text-white/70 mb-4">
                  We look forward to connecting & working with you :)
                </p>
                <div className="bg-yellow/20 p-4 rounded-lg">
                  <p className="text-yellow font-semibold mb-2">Fill out the form  We will see you very soon!</p>
                  <p className="text-sm text-white/70 mb-1">📞 +91 88288 81117</p>
                  <p className="text-sm text-white/70 mb-1">
                    📸 <a href="https://www.instagram.com/motojojo.co/" target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">@motojojo.co</a>
                  </p>
                  <p className="text-sm text-white/70 mb-1">
                    📘 <a href="https://www.facebook.com/motojojo.co/" target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">Facebook</a>
                  </p>
                  <p className="text-sm text-white/70">
                    🖼️ <a href="https://motojojomemories.my.canva.site/" target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">Photo Gallery</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={400}>
          <Card className="bg-sandstorm/80 text-violet rounded-2xl shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-violet text-center">
                Join the JoJo Gang
              </CardTitle>
              <p className="text-center text-gray-600">
                The name, email, and photo associated with your Google account will be recorded when you upload files and submit this form
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Each section gets a yellow background for contrast */}
                <div className="bg-sandstorm/80 rounded-2xl p-4 mb-4 shadow-soft">
                  {/* Name, Email, Phone, etc. */}
                  <div>
                    <Label htmlFor="name" className="text-violet font-semibold">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="First and last name"
                      className="mt-2 bg-yellow/20 text-violet"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-violet font-semibold">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email address"
                      className="mt-2 bg-yellow/20 text-violet"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-violet font-semibold">
                      Phone number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="Enter your phone number"
                      className="mt-2 bg-yellow/20 text-violet"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="age" className="text-violet font-semibold">
                      Age *
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="16"
                      max="100"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter your age"
                      className="mt-2 bg-yellow/20 text-violet"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-violet font-semibold">
                      City (where you will be available for the gatherings) *
                    </Label>
                    <p className="text-sm text-gray-600 mt-1 mb-2">
                      Mention your area too!
                    </p>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Enter your city and area"
                      className="mt-2 bg-yellow/20 text-violet"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="areaPincode" className="text-violet font-semibold">
                      Area Pin code *
                    </Label>
                    <p className="text-sm text-gray-600 mt-1 mb-2">
                      We are going hyperlocal soon!
                    </p>
                    <Input
                      id="areaPincode"
                      value={formData.areaPincode}
                      onChange={(e) => handleInputChange('areaPincode', e.target.value)}
                      placeholder="Enter your area pincode"
                      className="mt-2 bg-yellow/20 text-violet"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagramLink" className="text-violet font-semibold">
                      Instagram Link *
                    </Label>
                    <Input
                      id="instagramLink"
                      type="url"
                      value={formData.instagramLink}
                      onChange={(e) => handleInputChange('instagramLink', e.target.value)}
                      placeholder="https://www.instagram.com/yourusername"
                      className="mt-2 bg-yellow/20 text-violet"
                      required
                    />
                  </div>
                </div>
                <div className="bg-sandstorm/80 rounded-2xl p-4 mb-4 shadow-soft">
                  {/* Attended Gathering */}
                  <div>
                    <Label className="text-violet font-semibold">
                      Have you attended a Motojojo Gathering? *
                    </Label>
                    <RadioGroup 
                      value={formData.attendedGathering} 
                      onValueChange={(value) => handleInputChange('attendedGathering', value)}
                      className="mt-2"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes-gathering" className="bg-yellow/20 text-violet" />
                          <Label htmlFor="yes-gathering">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no-gathering" className="bg-yellow/20 text-violet" />
                          <Label htmlFor="no-gathering">No</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="bg-sandstorm/80 rounded-2xl p-4 mb-4 shadow-soft">
                  {/* Position */}
                  <div>
                    <Label className="text-violet font-semibold">
                      Which position will you be interested in? *
                    </Label>
                    <RadioGroup 
                      value={formData.position} 
                      onValueChange={(value) => handleInputChange('position', value)}
                      className="mt-2"
                    >
                      <div className="space-y-3">
                        {positionOptions.map((option) => {
                          const isSelected = formData.position === option.value;
                          return (
                            <div
                              key={option.value}
                              className={`flex items-start space-x-3 p-3 border border-gray-200 rounded-lg transition-colors ${isSelected ? 'bg-violet/30' : 'bg-transparent'} hover:bg-violet/20`}
                            >
                              <RadioGroupItem value={option.value} id={option.value} className="mt-1 bg-yellow/20 text-violet" />
                              <div className="flex items-center space-x-2">
                                <span className="text-raspberry">{option.icon}</span>
                                <Label htmlFor={option.value} className="text-sm cursor-pointer">
                                  {option.label}
                                </Label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <div className="bg-sandstorm/80 rounded-2xl p-4 mb-4 shadow-soft">
                  {/* Additional Info */}
                  <div>
                    <Label htmlFor="additionalInfo" className="text-violet font-semibold">
                      Tell us more about yourself and your interests
                    </Label>
                    <Textarea
                      id="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                      placeholder="Share your background, experience, and what excites you about joining the JoJo Gang..."
                      className="mt-2 bg-yellow/20 text-violet"
                      rows={4}
                    />
                  </div>
                </div>
                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-violet text-white font-bold py-3 rounded-xl shadow transition-colors duration-150 text-base md:text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="mr-2 h-5 w-5" />
                        Join the JoJo Gang
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
};

export default JoJoGang; 