import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getPrivateEventsForUser } from "@/services/eventService";
import { Event } from "@/services/eventService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useToast } from "@/hooks/use-toast";

export default function InviteOnly() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view your private event invitations.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    if (isSignedIn) {
      loadPrivateEvents();
    }
  }, [isSignedIn, isLoaded, navigate, toast]);

  const loadPrivateEvents = async () => {
    try {
      setLoading(true);
      const data = await getPrivateEventsForUser();
      setEvents(data);
    } catch (error) {
      console.error("Error loading private events:", error);
      toast({
        title: "Error",
        description: "Failed to load your private events. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <PageLayout>
        <div className="container-padding">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your private events...</p>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <PageLayout>
      <div className="container-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold">Invite Only Events</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Exclusive events you've been personally invited to. These private gatherings are curated just for you.
            </p>
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Lock className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">No Private Invitations</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You don't have any private event invitations at the moment. When you receive exclusive invites, they'll appear here.
              </p>
              <Button asChild>
                <Link to="/events">Browse Public Events</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-700">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2 line-clamp-2">{event.title}</h3>
                    {event.subtitle && (
                      <p className="text-sm text-muted-foreground mb-3">{event.subtitle}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.venue}, {event.city}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">
                        ₹{event.price}
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/events/${event.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 bg-muted/30 rounded-lg p-8 text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Exclusive Access</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These private events are invitation-only experiences. Each event has been carefully curated and you've been specially selected to attend. 
              Check your email for invitation details and RSVP instructions.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}