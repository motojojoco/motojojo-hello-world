
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { experiences } from "@/data/mockData";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ExperiencesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <section className="py-16 bg-muted/5">
      <div className="container-padding">
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Curated Experiences</h2>
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
        
        {/* Experiences Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {experiences.map((experience, index) => (
            <FadeIn key={experience.id} delay={100 * index}>
              <Link to={`/experiences/${experience.id}`}>
                <Card className="w-[300px] md:w-[350px] hover-scale cursor-pointer overflow-hidden border-none shadow-soft">
                  <div className="h-44 overflow-hidden">
                    <img 
                      src={experience.image} 
                      alt={experience.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-2">{experience.name}</h3>
                    <p className="text-muted-foreground text-sm">{experience.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
