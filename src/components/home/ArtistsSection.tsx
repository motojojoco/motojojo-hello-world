
import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
}

const ArtistsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        // For now, we'll use an empty array since we don't have an artists table yet
        // This can be implemented when you add the artists table to Supabase
        setArtists([]);
        
        // Uncomment and use this when you create an artists table
        // const { data, error } = await supabase.from('artists').select('*');
        // if (error) throw error;
        // setArtists(data || []);
      } catch (error) {
        console.error("Error fetching artists:", error);
        toast({
          title: "Error",
          description: "Failed to load artists. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();

    // Setup real-time subscription when artists table is created
    // const channel = supabase
    //   .channel('artists-changes')
    //   .on(
    //     'postgres_changes',
    //     {
    //       event: '*',
    //       schema: 'public',
    //       table: 'artists'
    //     },
    //     async (payload) => {
    //       console.log('Real-time update received:', payload);
    //       const { data } = await supabase.from('artists').select('*');
    //       setArtists(data || []);
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, [toast]);

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

  if (loading) {
    return (
      <section className="py-16 bg-muted/5">
        <div className="container-padding">
          <h2 className="section-title">Featured Artists</h2>
          <div className="flex justify-center py-16">
            <div className="animate-pulse flex space-x-4">
              <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
              <div className="space-y-4 flex-1">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (artists.length === 0) {
    return (
      <section className="py-16 bg-muted/5">
        <div className="container-padding">
          <h2 className="section-title">Featured Artists</h2>
          <div className="flex justify-center py-16">
            <p className="text-muted-foreground">No artists available at this time. Please check back later.</p>
          </div>
        </div>
      </section>
    );
  }

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
