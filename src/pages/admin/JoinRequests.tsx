import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getPendingJoinRequests, updateInvitationStatus } from "@/services/eventInvitationService";
import { format } from "date-fns";

type PendingRequest = {
  id: string;
  event_id: string;
  event_title: string;
  event_date: string;
  event_city: string;
  user_email: string;
  requested_at: string;
};

export default function JoinRequests() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingJoinRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error loading join requests:", error);
      toast({
        title: "Error",
        description: "Failed to load join requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: "accepted" | "declined") => {
    try {
      const { error } = await updateInvitationStatus(requestId, status);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Request ${status} successfully.`,
      });
      
      // Refresh the list
      await loadRequests();
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast({
        title: "Error",
        description: `Failed to ${status} request. Please try again.`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Join Requests</h1>
        <Button onClick={() => navigate(-1)} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No pending join requests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{request.event_title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{request.event_city}</span>
                      <span>•</span>
                      <span>{format(new Date(request.event_date), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{request.user_email}</p>
                    <p className="text-sm text-muted-foreground">
                      Requested on {format(new Date(request.requested_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, "declined")}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(request.id, "accepted")}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
