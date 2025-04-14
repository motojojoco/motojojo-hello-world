
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { artists } from "@/data/mockData";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight, Music } from "lucide-react";
import { Link } from "react-router-dom";

const ArtistsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 300;
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
            <h2 className="section-title">Featured Artists</h2>
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
        
        {/* Artists Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {artists.map((artist, index) => (
            <FadeIn key={artist.id} delay={100 * index}>
              <Link to={`/artist/${artist.id}`}>
                <Card className="w-[180px] hover-scale border-none shadow-soft text-center">
                  <CardContent className="p-6 flex flex-col items-center">
                    <Avatar className="w-24 h-24 mb-4 border-2 border-violet">
                      <AvatarImage src={artist.image} alt={artist.name} />
                      <AvatarFallback className="bg-violet text-white">
                        {artist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold mb-1">{artist.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Music className="h-3 w-3 mr-1" />
                      {artist.genre}
                    </div>
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

export default ArtistsSection;
