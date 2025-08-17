-- Create event invitations table
CREATE TABLE public.event_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_email VARCHAR NOT NULL,
  invited_by UUID NOT NULL,
  status VARCHAR NOT NULL DEFAULT 'pending',
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_email)
);

-- Enable RLS
ALTER TABLE public.event_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for event invitations
CREATE POLICY "Admins can manage all event invitations"
ON public.event_invitations
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE users.id = auth.uid() AND users.role = 'admin'
));

CREATE POLICY "Users can view their own invitations"
ON public.event_invitations
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE users.id = auth.uid() AND users.email = event_invitations.user_email
));

CREATE POLICY "Users can update their own invitation status"
ON public.event_invitations
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE users.id = auth.uid() AND users.email = event_invitations.user_email
));

-- Create trigger for updated_at
CREATE TRIGGER update_event_invitations_updated_at
BEFORE UPDATE ON public.event_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();