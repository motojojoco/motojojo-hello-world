-- Add is_private column to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT false;

-- Update the policy to allow only event owners to see private events
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;

-- New policy that checks for private events
CREATE POLICY "Public events are viewable by everyone, private only by owners" 
ON public.events
FOR SELECT 
USING (
  is_private = false OR 
  (is_private = true AND created_by = auth.uid()::text)
);

-- Add index for better performance with private events
CREATE INDEX IF NOT EXISTS idx_events_is_private ON public.events(is_private);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
