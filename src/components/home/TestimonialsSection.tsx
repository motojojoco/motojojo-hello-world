
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TestimonialsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      avatar: "/lovable-uploads/606628e6-3bd4-4130-81c6-49f2cafca33e.png",
      role: "Music Enthusiast",
      content: "The concerts I've attended through this platform have been amazing! The booking process is seamless and the events are always well-organized.",
      rating: 5
    },
    {
      id: 2,
      name: "Raj Kumar",
      avatar: "",
      role: "Regular Attendee",
      content: "I love how easy it is to discover new events in my city. The filters help me find exactly what I'm looking for. Great selection of experiences!",
      rating: 4
    },
    {
      id: 3,
      name: "Arjun Mehta",
      avatar: "",
      role: "Food Explorer",
      content: "The food events and workshops are exceptional. I've learned so much and met amazing people. Highly recommend checking out their culinary experiences.",
      rating: 5
    },
    {
      id: 4,
      name: "Meera Patel",
      avatar: "",
      role: "Art Lover",
      content: "As someone passionate about art, I've found the gallery exhibitions and art workshops to be carefully curated and incredibly enriching.",
      rating: 5
    }
  ];

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

  return (
    <section className="py-16 bg-muted/30">
      <div className="container-padding">
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">What Our Community Says</h2>
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
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
