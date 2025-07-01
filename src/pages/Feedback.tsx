import { useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { FadeIn } from "@/components/ui/motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, Users, Heart } from "lucide-react";

const Feedback = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 pb-20 md:pb-8">
        <div className="container-padding">
          <FadeIn>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Share Your <span className="text-gradient">Experience</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Your feedback helps us improve and create better experiences for everyone in our community.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feedback Form */}
            <FadeIn delay={200}>
              <FeedbackForm />
            </FadeIn>

            {/* Information Cards */}
            <FadeIn delay={300}>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-violet" />
                      Why Share Feedback?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Star className="h-5 w-5 text-yellow mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Help Others</h4>
                          <p className="text-sm text-muted-foreground">
                            Your experience helps other users make informed decisions about events.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Improve Our Platform</h4>
                          <p className="text-sm text-muted-foreground">
                            Your suggestions help us enhance features and user experience.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 text-red-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold">Support Artists</h4>
                          <p className="text-sm text-muted-foreground">
                            Your feedback helps artists and organizers understand what works best.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What We're Looking For</CardTitle>
                    <CardDescription>
                      Share your honest thoughts about any aspect of our platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-violet rounded-full"></div>
                        <span className="text-sm">Event booking experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-violet rounded-full"></div>
                        <span className="text-sm">Event quality and organization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-violet rounded-full"></div>
                        <span className="text-sm">Platform usability and features</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-violet rounded-full"></div>
                        <span className="text-sm">Customer service experience</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-violet rounded-full"></div>
                        <span className="text-sm">Suggestions for improvement</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Guidelines</CardTitle>
                    <CardDescription>
                      Please keep your feedback constructive and respectful
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <p className="text-muted-foreground">
                        • Be honest and specific about your experience
                      </p>
                      <p className="text-muted-foreground">
                        • Focus on constructive feedback that helps improve our services
                      </p>
                      <p className="text-muted-foreground">
                        • Respect the privacy and dignity of others
                      </p>
                      <p className="text-muted-foreground">
                        • Avoid personal attacks or inappropriate language
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Feedback; 