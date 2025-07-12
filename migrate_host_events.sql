-- Migration script to update events table to use direct host field instead of host_events junction table
-- Run this in your Supabase SQL Editor

-- 1. First, let's update any existing events that have host_events entries to populate the host field
UPDATE public.events 
SET host = he.host_id
FROM public.host_events he
WHERE events.id = he.event_id 
AND events.host IS NULL;

-- 2. Add a comment to document the change
COMMENT ON COLUMN public.events.host IS 'Direct reference to host ID. Replaces the need for host_events junction table for host-created events.';

-- 3. Create a function to help with future host event assignments (for admin-assigned events)
CREATE OR REPLACE FUNCTION assign_host_to_event(
    host_id UUID,
    event_id UUID,
    permissions JSONB DEFAULT '{"mark_attendance": true, "view_bookings": true, "create_events": true}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Update the event to set the host
    UPDATE public.events 
    SET host = assign_host_to_event.host_id
    WHERE id = assign_host_to_event.event_id;
    
    -- Also create an entry in host_events for permissions tracking
    INSERT INTO public.host_events (host_id, event_id, permissions)
    VALUES (assign_host_to_event.host_id, assign_host_to_event.event_id, assign_host_to_event.permissions)
    ON CONFLICT (host_id, event_id) 
    DO UPDATE SET permissions = assign_host_to_event.permissions;
    
    result := jsonb_build_object(
        'success', true,
        'message', 'Host assigned to event successfully'
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 4. Create a function to remove host from event
CREATE OR REPLACE FUNCTION remove_host_from_event(
    host_id UUID,
    event_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Remove the host from the event
    UPDATE public.events 
    SET host = NULL
    WHERE id = remove_host_from_event.event_id 
    AND host = remove_host_from_event.host_id;
    
    -- Remove from host_events table
    DELETE FROM public.host_events 
    WHERE host_id = remove_host_from_event.host_id 
    AND event_id = remove_host_from_event.event_id;
    
    result := jsonb_build_object(
        'success', true,
        'message', 'Host removed from event successfully'
    );
    
    RETURN result;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- 5. Update the host dashboard view to work with the new structure
CREATE OR REPLACE VIEW host_dashboard_view AS
SELECT 
    h.id as host_id,
    h.host_name,
    h.city,
    u.email,
    COUNT(DISTINCT e.id) as total_events,
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT t.id) FILTER (WHERE t.attended = true) as present_tickets,
    COUNT(DISTINCT t.id) FILTER (WHERE t.attended = false) as absent_tickets
FROM public.hosts h
JOIN public.users u ON h.user_id = u.id
LEFT JOIN public.events e ON h.id = e.host
LEFT JOIN public.bookings b ON e.id = b.event_id
LEFT JOIN public.tickets t ON b.id = t.booking_id
WHERE h.is_active = true
GROUP BY h.id, h.host_name, h.city, u.email;

-- 6. Update the attendance summary view to work with the new structure
CREATE OR REPLACE VIEW attendance_summary_view AS
SELECT 
    e.id as event_id,
    e.title as event_title,
    e.city as event_city,
    e.date as event_date,
    h.host_name,
    COUNT(t.id) as total_tickets,
    COUNT(t.id) FILTER (WHERE t.attended = true) as present_count,
    COUNT(t.id) FILTER (WHERE t.attended = false) as absent_count,
    ROUND(
        (COUNT(t.id) FILTER (WHERE t.attended = true)::DECIMAL / 
         NULLIF(COUNT(t.id), 0)::DECIMAL) * 100, 2
    ) as attendance_rate
FROM public.events e
LEFT JOIN public.hosts h ON e.host = h.id
LEFT JOIN public.bookings b ON e.id = b.event_id
LEFT JOIN public.tickets t ON b.id = t.booking_id
WHERE e.host IS NOT NULL
GROUP BY e.id, e.title, e.city, e.date, h.host_name;

-- 7. Add an index on the host field for better performance
CREATE INDEX IF NOT EXISTS idx_events_host ON public.events(host);

-- 8. Update RLS policies for events table to allow hosts to manage their events
CREATE POLICY "Hosts can view their own events" ON public.events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.hosts h
            WHERE h.id = events.host 
            AND h.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Hosts can update their own events" ON public.events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.hosts h
            WHERE h.id = events.host 
            AND h.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Hosts can insert their own events" ON public.events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.hosts h
            WHERE h.id = events.host 
            AND h.user_id = auth.uid()::text
        )
    );

-- Success message
SELECT 'Migration completed successfully! Events now use direct host field instead of host_events junction table.' as status; 