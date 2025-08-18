import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { bulkInviteUsers, getEventInvitations } from "@/services/eventInvitationService";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, UserPlus } from "lucide-react";

interface EventInvitationFormProps {
  eventId: string;
  eventTitle: string;
  onInvitationsSent?: () => void;
}

export const EventInvitationForm: React.FC<EventInvitationFormProps> = ({
  eventId,
  eventTitle,
  onInvitationsSent
}) => {
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingInvitations, setExistingInvitations] = useState<any[]>([]);
  const { toast } = useToast();

  const loadInvitations = async () => {
    const invitations = await getEventInvitations(eventId);
    setExistingInvitations(invitations);
  };

  React.useEffect(() => {
    loadInvitations();
  }, [eventId]);

  const handleSendInvitations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) return;

    setLoading(true);
    try {
      const emailList = emails
        .split('\n')
        .map(email => email.trim())
        .filter(email => email && email.includes('@'));

      if (emailList.length === 0) {
        toast({
          title: "Invalid emails",
          description: "Please enter valid email addresses",
          variant: "destructive"
        });
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send invitations",
          variant: "destructive"
        });
        return;
      }

      const { success, failed } = await bulkInviteUsers(eventId, emailList, user.id);

      if (success.length > 0) {
        toast({
          title: "Invitations sent",
          description: `Successfully sent ${success.length} invitations`
        });
        setEmails('');
        loadInvitations();
        onInvitationsSent?.();
      }

      if (failed.length > 0) {
        toast({
          title: "Some invitations failed",
          description: `Failed to send ${failed.length} invitations`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Invite Users to {eventTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSendInvitations} className="space-y-4">
          <div>
            <Label htmlFor="emails">Email Addresses</Label>
            <Textarea
              id="emails"
              placeholder="Enter email addresses (one per line)..."
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Enter one email address per line
            </p>
          </div>
          
          <Button type="submit" disabled={loading || !emails.trim()}>
            {loading ? "Sending..." : "Send Invitations"}
          </Button>
        </form>

        {existingInvitations.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Existing Invitations</h4>
            <div className="space-y-2">
              {existingInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <div>
                    <span className="font-medium">{invitation.user_email}</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        invitation.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : invitation.status === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invitation.status}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(invitation.invited_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};