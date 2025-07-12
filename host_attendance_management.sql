-- Host & Attendance Management System
-- Run this in your Supabase SQL Editor

-- 1. Add 'host' role to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

-- Update existing users to have 'user' role if NULL
UPDATE public.users SET role = 'user' WHERE role IS NULL;

-- Add constraint for allowed roles
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'host'));

-- 2. Create hosts table for host-specific information
CREATE TABLE IF NOT EXISTS public.hosts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    host_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(100),
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 3. Create host_invitations table for managing host invitations
CREATE TABLE IF NOT EXISTS public.host_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    invited_by VARCHAR(255) NOT NULL REFERENCES public.users(id),
    invitation_token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(email, status)
);

-- 4. Create attendance_records table for tracking attendance
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id VARCHAR(255) NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    event_id VARCHAR(255) NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    host_id VARCHAR(255) NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent')),
    marked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ticket_id, event_id)
);

-- 5. Create host_events table to link hosts with events they can manage
CREATE TABLE IF NOT EXISTS public.host_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id VARCHAR(255) NOT NULL REFERENCES public.hosts(id) ON DELETE CASCADE,
    event_id VARCHAR(255) NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"mark_attendance": true, "view_bookings": true, "create_events": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(host_id, event_id)
);

-- 6. Enable Row Level Security on all new tables
ALTER TABLE public.hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_events ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for hosts table
CREATE POLICY "Hosts can view their own profile" ON public.hosts
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Hosts can update their own profile" ON public.hosts
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Admins can view all hosts" ON public.hosts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can insert hosts" ON public.hosts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update hosts" ON public.hosts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete hosts" ON public.hosts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- 8. Create RLS policies for host_invitations table
CREATE POLICY "Admins can view all invitations" ON public.host_invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can create invitations" ON public.host_invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update invitations" ON public.host_invitations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete invitations" ON public.host_invitations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- 9. Create RLS policies for attendance_records table
CREATE POLICY "Hosts can view attendance for their events" ON public.attendance_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.host_events he
            JOIN public.hosts h ON he.host_id = h.id
            WHERE he.event_id = attendance_records.event_id 
            AND h.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Hosts can create attendance records" ON public.attendance_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.host_events he
            JOIN public.hosts h ON he.host_id = h.id
            WHERE he.event_id = attendance_records.event_id 
            AND h.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Hosts can update attendance records" ON public.attendance_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.host_events he
            JOIN public.hosts h ON he.host_id = h.id
            WHERE he.event_id = attendance_records.event_id 
            AND h.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Admins can view all attendance records" ON public.attendance_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage all attendance records" ON public.attendance_records
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- 10. Create RLS policies for host_events table
CREATE POLICY "Hosts can view their event assignments" ON public.host_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.hosts h
            WHERE h.id = host_events.host_id 
            AND h.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Admins can view all host events" ON public.host_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

CREATE POLICY "Admins can manage host events" ON public.host_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid()::text AND role = 'admin'
        )
    );

-- 11. Create functions for host management

-- Function to create a host invitation
CREATE OR REPLACE FUNCTION create_host_invitation(
    invite_email VARCHAR(255),
    invited_by_user_id VARCHAR(255)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    invitation_token VARCHAR(255);
    result JSONB;
BEGIN
    -- Check if inviter is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = invited_by_user_id AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only admins can invite hosts';
    END IF;

    -- Generate unique token
    invitation_token := encode(gen_random_bytes(32), 'hex');

    -- Create invitation
    INSERT INTO public.host_invitations (
        email, 
        invited_by, 
        invitation_token, 
        expires_at
    ) VALUES (
        invite_email,
        invited_by_user_id,
        invitation_token,
        NOW() + INTERVAL '7 days'
    );

    result := jsonb_build_object(
        'success', true,
        'invitation_token', invitation_token,
        'expires_at', NOW() + INTERVAL '7 days'
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

-- Function to accept host invitation
CREATE OR REPLACE FUNCTION accept_host_invitation(
    invitation_token VARCHAR(255),
    user_id VARCHAR(255),
    host_name VARCHAR(255),
    phone VARCHAR(20) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL,
    bio TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    invitation_record RECORD;
    result JSONB;
BEGIN
    -- Find invitation
    SELECT * INTO invitation_record
    FROM public.host_invitations
    WHERE invitation_token = accept_host_invitation.invitation_token
    AND status = 'pending'
    AND expires_at > NOW();

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Invalid or expired invitation'
        );
    END IF;

    -- Check if user email matches invitation email
    IF NOT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = user_id AND email = invitation_record.email
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Email does not match invitation'
        );
    END IF;

    -- Update user role to host
    UPDATE public.users 
    SET role = 'host'
    WHERE id = user_id;

    -- Create host profile
    INSERT INTO public.hosts (
        user_id, 
        host_name, 
        phone, 
        city, 
        bio
    ) VALUES (
        user_id,
        host_name,
        phone,
        city,
        bio
    );

    -- Mark invitation as accepted
    UPDATE public.host_invitations
    SET status = 'accepted', accepted_at = NOW()
    WHERE invitation_token = accept_host_invitation.invitation_token;

    result := jsonb_build_object(
        'success', true,
        'message', 'Host invitation accepted successfully'
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

-- Function to mark attendance
CREATE OR REPLACE FUNCTION mark_attendance(
    ticket_id VARCHAR(255),
    event_id VARCHAR(255),
    status VARCHAR(20),
    notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    host_record RECORD;
    ticket_record RECORD;
    event_record RECORD;
    result JSONB;
BEGIN
    -- Get current user's host profile
    SELECT h.* INTO host_record
    FROM public.hosts h
    WHERE h.user_id = auth.uid()::text
    AND h.is_active = true;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Host profile not found or inactive'
        );
    END IF;

    -- Check if host has permission for this event
    IF NOT EXISTS (
        SELECT 1 FROM public.host_events he
        WHERE he.host_id = host_record.id
        AND he.event_id = mark_attendance.event_id
    ) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'No permission to manage this event'
        );
    END IF;

    -- Get ticket information
    SELECT t.*, b.user_id INTO ticket_record
    FROM public.tickets t
    JOIN public.bookings b ON t.booking_id = b.id
    WHERE t.id = ticket_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Ticket not found'
        );
    END IF;

    -- Get event information
    SELECT * INTO event_record
    FROM public.events
    WHERE id = event_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Event not found'
        );
    END IF;

    -- Insert or update attendance record
    INSERT INTO public.attendance_records (
        ticket_id,
        event_id,
        user_id,
        host_id,
        status,
        notes
    ) VALUES (
        ticket_id,
        event_id,
        ticket_record.user_id,
        host_record.id,
        status,
        notes
    )
    ON CONFLICT (ticket_id, event_id)
    DO UPDATE SET
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        updated_at = NOW();

    -- Update ticket attended status
    UPDATE public.tickets
    SET attended = (status = 'present'),
        attended_at = CASE WHEN status = 'present' THEN NOW() ELSE NULL END
    WHERE id = ticket_id;

    result := jsonb_build_object(
        'success', true,
        'message', 'Attendance marked successfully',
        'status', status
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

-- Function to get attendance statistics
CREATE OR REPLACE FUNCTION get_attendance_stats(
    event_id VARCHAR(255) DEFAULT NULL,
    city VARCHAR(100) DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    stats JSONB;
    user_role VARCHAR(20);
BEGIN
    -- Get user role
    SELECT role INTO user_role
    FROM public.users
    WHERE id = auth.uid()::text;

    -- Build query based on user role and filters
    IF user_role = 'admin' THEN
        -- Admins can see all stats
        SELECT jsonb_build_object(
            'total_tickets', COUNT(t.id),
            'present_count', COUNT(t.id) FILTER (WHERE t.attended = true),
            'absent_count', COUNT(t.id) FILTER (WHERE t.attended = false),
            'attendance_rate', ROUND(
                (COUNT(t.id) FILTER (WHERE t.attended = true)::DECIMAL / 
                 NULLIF(COUNT(t.id), 0)::DECIMAL) * 100, 2
            ),
            'city_breakdown', (
                SELECT jsonb_object_agg(e.city, city_stats)
                FROM (
                    SELECT 
                        e.city,
                        jsonb_build_object(
                            'total', COUNT(t.id),
                            'present', COUNT(t.id) FILTER (WHERE t.attended = true),
                            'absent', COUNT(t.id) FILTER (WHERE t.attended = false),
                            'rate', ROUND(
                                (COUNT(t.id) FILTER (WHERE t.attended = true)::DECIMAL / 
                                 NULLIF(COUNT(t.id), 0)::DECIMAL) * 100, 2
                            )
                        ) as city_stats
                    FROM public.tickets t
                    JOIN public.bookings b ON t.booking_id = b.id
                    JOIN public.events e ON b.event_id = e.id
                    WHERE (event_id IS NULL OR e.id = event_id)
                    AND (city IS NULL OR e.city = city)
                    GROUP BY e.city
                ) e
            )
        ) INTO stats
        FROM public.tickets t
        JOIN public.bookings b ON t.booking_id = b.id
        JOIN public.events e ON b.event_id = e.id
        WHERE (event_id IS NULL OR e.id = event_id)
        AND (city IS NULL OR e.city = city);
    ELSE
        -- Hosts can only see stats for their events
        SELECT jsonb_build_object(
            'total_tickets', COUNT(t.id),
            'present_count', COUNT(t.id) FILTER (WHERE t.attended = true),
            'absent_count', COUNT(t.id) FILTER (WHERE t.attended = false),
            'attendance_rate', ROUND(
                (COUNT(t.id) FILTER (WHERE t.attended = true)::DECIMAL / 
                 NULLIF(COUNT(t.id), 0)::DECIMAL) * 100, 2
            )
        ) INTO stats
        FROM public.tickets t
        JOIN public.bookings b ON t.booking_id = b.id
        JOIN public.events e ON b.event_id = e.id
        JOIN public.host_events he ON e.id = he.event_id
        JOIN public.hosts h ON he.host_id = h.id
        WHERE h.user_id = auth.uid()::text
        AND (event_id IS NULL OR e.id = event_id)
        AND (city IS NULL OR e.city = city);
    END IF;

    RETURN stats;
END;
$$;

-- 12. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hosts_user_id ON public.hosts(user_id);
CREATE INDEX IF NOT EXISTS idx_hosts_city ON public.hosts(city);
CREATE INDEX IF NOT EXISTS idx_host_invitations_email ON public.host_invitations(email);
CREATE INDEX IF NOT EXISTS idx_host_invitations_token ON public.host_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_host_invitations_status ON public.host_invitations(status);
CREATE INDEX IF NOT EXISTS idx_attendance_records_ticket_event ON public.attendance_records(ticket_id, event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_host_id ON public.attendance_records(host_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_status ON public.attendance_records(status);
CREATE INDEX IF NOT EXISTS idx_host_events_host_id ON public.host_events(host_id);
CREATE INDEX IF NOT EXISTS idx_host_events_event_id ON public.host_events(event_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 13. Create triggers for updated_at columns
CREATE TRIGGER update_hosts_updated_at 
    BEFORE UPDATE ON public.hosts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at 
    BEFORE UPDATE ON public.attendance_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at_column();

-- 14. Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.hosts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.host_invitations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.host_events;

-- 15. Create views for easier querying

-- View for host dashboard data
CREATE OR REPLACE VIEW host_dashboard_view AS
SELECT 
    h.id as host_id,
    h.host_name,
    h.city,
    u.email,
    COUNT(DISTINCT he.event_id) as total_events,
    COUNT(DISTINCT t.id) as total_tickets,
    COUNT(DISTINCT t.id) FILTER (WHERE t.attended = true) as present_tickets,
    COUNT(DISTINCT t.id) FILTER (WHERE t.attended = false) as absent_tickets
FROM public.hosts h
JOIN public.users u ON h.user_id = u.id
LEFT JOIN public.host_events he ON h.id = he.host_id
LEFT JOIN public.events e ON he.event_id = e.id
LEFT JOIN public.bookings b ON e.id = b.event_id
LEFT JOIN public.tickets t ON b.id = t.booking_id
WHERE h.is_active = true
GROUP BY h.id, h.host_name, h.city, u.email;

-- View for attendance summary
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
LEFT JOIN public.host_events he ON e.id = he.event_id
LEFT JOIN public.hosts h ON he.host_id = h.id
LEFT JOIN public.bookings b ON e.id = b.event_id
LEFT JOIN public.tickets t ON b.id = t.booking_id
GROUP BY e.id, e.title, e.city, e.date, h.host_name;

-- 16. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.hosts TO authenticated;
GRANT ALL ON public.host_invitations TO authenticated;
GRANT ALL ON public.attendance_records TO authenticated;
GRANT ALL ON public.host_events TO authenticated;
GRANT SELECT ON host_dashboard_view TO authenticated;
GRANT SELECT ON attendance_summary_view TO authenticated;

-- 17. Create sample data (optional - for testing)
-- Insert a sample host invitation
-- INSERT INTO public.host_invitations (email, invited_by, invitation_token, expires_at) 
-- VALUES ('sample@example.com', 'admin-user-id', 'sample-token', NOW() + INTERVAL '7 days');

-- 18. Add comments for documentation
COMMENT ON TABLE public.hosts IS 'Stores host profiles and information';
COMMENT ON TABLE public.host_invitations IS 'Manages host invitation system';
COMMENT ON TABLE public.attendance_records IS 'Tracks attendance for events';
COMMENT ON TABLE public.host_events IS 'Links hosts to events they can manage';
COMMENT ON FUNCTION create_host_invitation IS 'Creates a new host invitation';
COMMENT ON FUNCTION accept_host_invitation IS 'Accepts a host invitation and creates host profile';
COMMENT ON FUNCTION mark_attendance IS 'Marks attendance for a ticket';
COMMENT ON FUNCTION get_attendance_stats IS 'Returns attendance statistics';

-- Success message
SELECT 'Host & Attendance Management System setup completed successfully!' as status; 