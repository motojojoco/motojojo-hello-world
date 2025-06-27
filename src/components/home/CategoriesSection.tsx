import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCategoriesRealtime } from "@/hooks/use-categories";
import { FadeIn } from "@/components/ui/motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Music, 
  Theater, 
  Laugh, 
  Cpu, 
  Utensils, 
  Palette, 
  Trophy, 
  Hammer 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Map of category icons
const categoryIcons: Record<string, React.ReactNode> = {
  "Music": <Music className="h-6 w-6" />,
  "Theatre": <Theater className="h-6 w-6" />,
  "Comedy": <Laugh className="h-6 w-6" />,
  "Tech": <Cpu className="h-6 w-6" />,
  "Food": <Utensils className="h-6 w-6" />,
  "Art": <Palette className="h-6 w-6" />,
  "Sports": <Trophy className="h-6 w-6" />,
  "Workshop": <Hammer className="h-6 w-6" />
};

const CategoriesSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { categories, isLoading, error } = useCategoriesRealtime();

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

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container-padding">
          <FadeIn>
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-48" />
              <div className="hidden md:flex space-x-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </FadeIn>
          
          <div className="flex gap-4 overflow-x-auto pb-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <FadeIn key={index} delay={100 * index}>
                <Skeleton className="w-[140px] h-[120px] rounded-lg" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16">
        <div className="container-padding">
          <FadeIn>
            <div className="text-center">
              <h2 className="section-title">Browse Categories</h2>
              <p className="text-muted-foreground mt-4">
                Unable to load categories. Please try again later.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container-padding">
        <FadeIn>
          <div className="flex justify-between items-center mb-8">
            <h2 className="section-title">Browse Categories</h2>
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
        
        {/* Categories Carousel */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {categories.map((category, index) => (
            <FadeIn key={category.id} delay={100 * index}>
              <Link to={`/category/${category.id}`}>
                <Card 
                  className="w-[140px] hover-scale overflow-hidden border-none shadow-soft"
                  style={{ background: `${category.color}20` }}
                >
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <div 
                      className="rounded-full p-3 mb-3"
                      style={{ background: `${category.color}40`, color: category.color }}
                    >
                      {categoryIcons[category.name]}
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
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

export default CategoriesSection;
