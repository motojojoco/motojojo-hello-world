
import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/motion";
import { ChevronLeft, ChevronRight, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string | null;
  profile: string;
}

const ArtistsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('artists')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setArtists(data || []);
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
    
    // Real-time updates
    const channel = supabase
      .channel('artists-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'artists'
        },
        async () => {
          fetchArtists();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
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
          <h2 className="section-title text-white">Featured Artists</h2>
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
          <h2 className="section-title text-white">Featured Artists</h2>
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
            <h2 className="section-title text-white">Featured Artists</h2>
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
        {/* Artists Carousel with yellow padding */}
        <div className="bg-sandstorm rounded-3xl px-8 py-8">
          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          >
            {artists.map((artist, index) => (
              <FadeIn key={artist.id} delay={100 * index}>
                <Card className="w-[300px] md:w-[350px] hover-scale cursor-pointer overflow-hidden border-none shadow-soft">
                  <div className="flex flex-col items-center p-6">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-violet"
                    />
                    <h3 className="text-xl font-bold mb-2 text-center">{artist.name}</h3>
                    <p className="text-sm text-center mb-2">{artist.bio}</p>
                    <div className="flex flex-col items-center gap-1">
                      {artist.tags && artist.tags.map((tag, i) => (
                        <span key={i} className="text-xs text-violet bg-violet/10 rounded-full px-3 py-1 mb-1">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
