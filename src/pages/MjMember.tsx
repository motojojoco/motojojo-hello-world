import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/motion";
import { ArrowLeft, Send, Heart, Users, Music, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const MjMember = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    identifyAs: "",
    identifyAsOther: "",
    phoneNumber: "",
    birthday: "",
    city: "",
    areaAndPincode: "",
    socialHandles: "",
    mood: "",
    moodOther: "",
    groupRole: "",
    groupRoleOther: "",
    interests: "",
    artInspiration: "",
    beenToGathering: "",
    howFoundUs: "",
    howFoundUsOther: "",
    whyJoinCommunity: ""
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
    const requiredFields = ['name', 'phoneNumber', 'birthday', 'city', 'areaAndPincode', 'socialHandles', 'mood', 'groupRole', 'interests', 'beenToGathering', 'howFoundUs', 'whyJoinCommunity'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('motojojo_members')
        .insert([{
          name: formData.name,
          identify_as: formData.identifyAs,
          identify_as_other: formData.identifyAsOther,
          phone_number: formData.phoneNumber,
          birthday: formData.birthday,
          city: formData.city,
          area_and_pincode: formData.areaAndPincode,
          social_handles: formData.socialHandles,
          mood: formData.mood,
          mood_other: formData.moodOther,
          group_role: formData.groupRole,
          group_role_other: formData.groupRoleOther,
          interests: formData.interests,
          art_inspiration: formData.artInspiration,
          been_to_gathering: formData.beenToGathering,
          how_found_us: formData.howFoundUs,
          how_found_us_other: formData.howFoundUsOther,
          why_join_community: formData.whyJoinCommunity,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in joining the Motojojo community. We'll be in touch soon!",
      });

      // Reset form
      setFormData({
        name: "",
        identifyAs: "",
        identifyAsOther: "",
        phoneNumber: "",
        birthday: "",
        city: "",
        areaAndPincode: "",
        socialHandles: "",
        mood: "",
        moodOther: "",
        groupRole: "",
        groupRoleOther: "",
        interests: "",
        artInspiration: "",
        beenToGathering: "",
        howFoundUs: "",
        howFoundUsOther: "",
        whyJoinCommunity: ""
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
                Motojojo Member Form
              </h1>
              <div className="flex justify-center space-x-4 mb-6">
                <Heart className="h-6 w-6 text-raspberry" />
                <Users className="h-6 w-6 text-yellow" />
                <Music className="h-6 w-6 text-violet" />
                <Coffee className="h-6 w-6 text-sandstorm" />
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
                  <strong>Hello Jojos!!</strong>
                </p>
                <p className="text-white/70 mb-4">
                  We're a community-led platform bringing together artists, storytellers, musicians, poets, and the beautiful misfits of the world — one intimate gathering at a time. In the past 6 years, we've hosted over 550+ events across 22 cities, with 2000+ independent artists and 20,000+ guests — all made possible by people like you.
                </p>
                <p className="text-white/70 mb-4">
                  Now, after a long pause, we're ready to make magic again. We're looking for curious, creative, kind humans across India to help restart the fire — by hosting, volunteering, or just showing up with their whole heart.
                </p>
                <p className="text-white/70 mb-4">
                  This is not a place where we aim to sell tickets for an event. We aim to build, to connect, to inspire and to create. This community is led by it's members, you host, you curate, you lead, you ideate and you take charge. There is no difference between those who perform, those who curate and those who listen; at Motojojo, we're all just a bunch of incomplete people trying to build a safe space to be ourselves.
                </p>
                <p className="text-white/70 mb-4">
                  If you believe in warm lights, deep conversations, and art that brings people closer — you're in the right place.
                </p>
                <p className="text-white/70 mb-4">
                  Tell us a bit about yourself, and let's see where this journey takes us.
                </p>
                <div className="bg-yellow/20 p-4 rounded-lg">
                  <p className="text-yellow font-semibold mb-2">Fill out the form  We will see you very soon!</p>
                  <p className="text-sm text-white/70 mb-1">📞 +91 88288 81117</p>
                  <p className="text-sm text-white/70 mb-1">📸 @motojojo.co (our Instagram to show you a glimpse of what we do)</p>
                  <p className="text-sm text-white/70">
                    Here is a virtual gallery for you to dive deep into our world:{" "}
                    <a href="https://motojojomemories.my.canva.site/" target="_blank" rel="noopener noreferrer" className="text-violet hover:underline">
                      https://motojojomemories.my.canva.site/
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={400}>
          <Card className="bg-white/10 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-violet text-center">
                Join the Motojojo Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-violet font-semibold">
                    What should we call you? (Your name please) *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Identify As */}
                <div>
                  <Label className="text-violet font-semibold">You identify as? (optional)</Label>
                  <RadioGroup 
                    value={formData.identifyAs} 
                    onValueChange={(value) => handleInputChange('identifyAs', value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="he/him" id="he-him" />
                      <Label htmlFor="he-him">He/him</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="she/her" id="she-her" />
                      <Label htmlFor="she-her">She/her</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="they/them" id="they-them" />
                      <Label htmlFor="they-them">They/Them</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prefer-not" id="prefer-not" />
                      <Label htmlFor="prefer-not">Prefer not to say</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other:</Label>
                    </div>
                  </RadioGroup>
                  {formData.identifyAs === 'other' && (
                    <Input
                      value={formData.identifyAsOther}
                      onChange={(e) => handleInputChange('identifyAsOther', e.target.value)}
                      placeholder="Please specify"
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Phone Number */}
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
                    className="mt-2"
                    required
                  />
                </div>

                {/* Birthday */}
                <div>
                  <Label htmlFor="birthday" className="text-violet font-semibold">
                    Birthday (MM/DD) *
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleInputChange('birthday', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city" className="text-violet font-semibold">
                    City you live in (so we know which gatherings are closer to you!) *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter your city"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Area and Pincode */}
                <div>
                  <Label htmlFor="areaAndPincode" className="text-violet font-semibold">
                    Add your area and pin code too! *
                  </Label>
                  <Input
                    id="areaAndPincode"
                    value={formData.areaAndPincode}
                    onChange={(e) => handleInputChange('areaAndPincode', e.target.value)}
                    placeholder="Area and pincode"
                    className="mt-2"
                    required
                  />
                </div>

                {/* Social Handles */}
                <div>
                  <Label htmlFor="socialHandles" className="text-violet font-semibold">
                    Social Handles? (We'd love to check your vibe!) *
                  </Label>
                  <Input
                    id="socialHandles"
                    value={formData.socialHandles}
                    onChange={(e) => handleInputChange('socialHandles', e.target.value)}
                    placeholder="Instagram, Twitter, etc."
                    className="mt-2"
                    required
                  />
                </div>

                {/* Mood */}
                <div>
                  <Label className="text-violet font-semibold">
                    If you were a mood, what mood would you be right now? *
                  </Label>
                  <p className="text-sm text-white/70 mt-1 mb-3">
                    Feel free to describe your vibe in your own words in the "Other" option below.
                  </p>
                  <RadioGroup 
                    value={formData.mood} 
                    onValueChange={(value) => handleInputChange('mood', value)}
                    className="mt-2"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="rainy-evening" id="rainy-evening" />
                        <Label htmlFor="rainy-evening" className="text-sm">
                          A rainy evening with soft music (A quiet soul who enjoys soft and mindful evenings)
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="dancing-barefoot" id="dancing-barefoot" />
                        <Label htmlFor="dancing-barefoot" className="text-sm">
                          Dancing barefoot in a stranger's living room (The social gathering lover)
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="deep-conversation" id="deep-conversation" />
                        <Label htmlFor="deep-conversation" className="text-sm">
                          Deep conversation at 2 AM (One who likes intimate conversations with his close people)
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="wild-poetry" id="wild-poetry" />
                        <Label htmlFor="wild-poetry" className="text-sm">
                          Wild poetry slams and chai (A creative human who has a thing for spontaneous art challenges)
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="other-mood" id="other-mood" />
                        <Label htmlFor="other-mood" className="text-sm">Other:</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {formData.mood === 'other-mood' && (
                    <Input
                      value={formData.moodOther}
                      onChange={(e) => handleInputChange('moodOther', e.target.value)}
                      placeholder="Describe your mood"
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Group Role */}
                <div>
                  <Label className="text-violet font-semibold">
                    What role do you often find yourself playing in a group? *
                  </Label>
                  <RadioGroup 
                    value={formData.groupRole} 
                    onValueChange={(value) => handleInputChange('groupRole', value)}
                    className="mt-2"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="quiet-observer" id="quiet-observer" />
                        <Label htmlFor="quiet-observer">The quiet observer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="enthusiastic-connector" id="enthusiastic-connector" />
                        <Label htmlFor="enthusiastic-connector">The enthusiastic connector</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="snacks-playlists" id="snacks-playlists" />
                        <Label htmlFor="snacks-playlists">The one who brings snacks and playlists</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="last-to-leave" id="last-to-leave" />
                        <Label htmlFor="last-to-leave">The last one to leave</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bit-of-everything" id="bit-of-everything" />
                        <Label htmlFor="bit-of-everything">A bit of everything</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="always-misfit" id="always-misfit" />
                        <Label htmlFor="always-misfit">Always a misfit :)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-role" id="other-role" />
                        <Label htmlFor="other-role">Other:</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {formData.groupRole === 'other-role' && (
                    <Input
                      value={formData.groupRoleOther}
                      onChange={(e) => handleInputChange('groupRoleOther', e.target.value)}
                      placeholder="Describe your role"
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Interests */}
                <div>
                  <Label htmlFor="interests" className="text-violet font-semibold">
                    What do you do when you are not working? *
                  </Label>
                  <p className="text-sm text-white/70 mt-1 mb-2">
                    Tell us your interests, hobbies, passions etc
                  </p>
                  <Textarea
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    placeholder="Share your interests, hobbies, and passions..."
                    className="mt-2"
                    rows={4}
                    required
                  />
                </div>

                {/* Art Inspiration */}
                <div>
                  <Label htmlFor="artInspiration" className="text-violet font-semibold">
                    Share a piece of art, music, or a quote that deeply moved you. (It tells us a lot about what kind of art inspires you)
                  </Label>
                  <Textarea
                    id="artInspiration"
                    value={formData.artInspiration}
                    onChange={(e) => handleInputChange('artInspiration', e.target.value)}
                    placeholder="Share what inspires you..."
                    className="mt-2"
                    rows={3}
                  />
                </div>

                {/* Been to Gathering */}
                <div>
                  <Label className="text-violet font-semibold">
                    Have you ever been to a Motojojo gathering before? *
                  </Label>
                  <RadioGroup 
                    value={formData.beenToGathering} 
                    onValueChange={(value) => handleInputChange('beenToGathering', value)}
                    className="mt-2"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-yet-following" id="not-yet-following" />
                        <Label htmlFor="not-yet-following">Not yet but I have been following you</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="nope-love-concept" id="nope-love-concept" />
                        <Label htmlFor="nope-love-concept">Nope, but I love the concept</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* How Found Us */}
                <div>
                  <Label className="text-violet font-semibold">
                    How did you find us? *
                  </Label>
                  <RadioGroup 
                    value={formData.howFoundUs} 
                    onValueChange={(value) => handleInputChange('howFoundUs', value)}
                    className="mt-2"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="instagram" id="instagram" />
                        <Label htmlFor="instagram">Instagram</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="friend" id="friend" />
                        <Label htmlFor="friend">A friend</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="been-to-event" id="been-to-event" />
                        <Label htmlFor="been-to-event">I've been to an event</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="whatsapp-group" id="whatsapp-group" />
                        <Label htmlFor="whatsapp-group">Whatsapp group</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other-found" id="other-found" />
                        <Label htmlFor="other-found">Other:</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {formData.howFoundUs === 'other-found' && (
                    <Input
                      value={formData.howFoundUsOther}
                      onChange={(e) => handleInputChange('howFoundUsOther', e.target.value)}
                      placeholder="How did you find us?"
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Why Join Community */}
                <div>
                  <Label htmlFor="whyJoinCommunity" className="text-violet font-semibold">
                    Why do you want to be a part of the Motojojo community? *
                  </Label>
                  <p className="text-sm text-white/70 mt-1 mb-2">
                    What do you seek? What is your intention? This question is more for you than for us :)
                  </p>
                  <Textarea
                    id="whyJoinCommunity"
                    value={formData.whyJoinCommunity}
                    onChange={(e) => handleInputChange('whyJoinCommunity', e.target.value)}
                    placeholder="Share your intentions and what you're seeking..."
                    className="mt-2"
                    rows={4}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-violet to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-bold text-lg py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="mr-2 h-5 w-5" />
                        Submit Application
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

export default MjMember; 