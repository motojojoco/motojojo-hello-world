import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "@/services/testimonialService";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

const TestimonialsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 400;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container-padding">
          <FadeIn>
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-64" />
              <div className="hidden md:flex space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </FadeIn>
          
          <div className="flex gap-6 overflow-x-auto pb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <FadeIn key={index} delay={100 * index}>
                <Skeleton className="w-[300px] md:w-[400px] h-[200px] rounded-lg" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // No testimonials state
  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container-padding">
          <FadeIn>
            <div className="text-center">
              <h2 className="section-title">What Our Community Says</h2>
              <p className="text-muted-foreground mt-4 mb-6">
                Be the first to share your experience with our platform!
              </p>
              <Button asChild>
                <Link to="/feedback">
                  Share Your Feedback
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'audience':
        return 'Event Attendee';
      case 'artist':
        return 'Artist/Performer';
      case 'organizer':
        return 'Event Organizer';
      default:
        return role;
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-padding">
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">What Our Community Says</h2>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link to="/feedback">
                  Share Your Feedback
                </Link>
              </Button>
              {testimonials.length > 1 && (
                <div className="hidden md:flex space-x-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => scroll("left")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => scroll("right")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
        
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.id} delay={100 * index}>
              <Card className="w-[300px] md:w-[400px] hover-scale overflow-hidden border-none shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar_url || ""} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{getRoleDisplay(testimonial.role)}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow text-yellow" />
                    ))}
                    {Array.from({ length: 5 - testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-muted" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
