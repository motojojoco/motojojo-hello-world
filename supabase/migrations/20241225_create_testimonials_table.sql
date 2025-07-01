-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(100) NOT NULL, -- 'audience', 'artist', 'organizer'
    avatar_url TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Testimonials are viewable by everyone" ON public.testimonials
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Testimonials are insertable by everyone" ON public.testimonials
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Testimonials are updatable by authenticated users" ON public.testimonials
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Testimonials are deletable by authenticated users" ON public.testimonials
    FOR DELETE USING (auth.role() = 'authenticated');

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;

-- Insert default testimonials
INSERT INTO public.testimonials (name, email, role, content, rating, is_approved, is_featured) VALUES
    ('Priya Sharma', 'priya@example.com', 'audience', 'The concerts I''ve attended through this platform have been amazing! The booking process is seamless and the events are always well-organized.', 5, true, true),
    ('Raj Kumar', 'raj@example.com', 'audience', 'I love how easy it is to discover new events in my city. The filters help me find exactly what I''m looking for. Great selection of experiences!', 4, true, true),
    ('Arjun Mehta', 'arjun@example.com', 'audience', 'The food events and workshops are exceptional. I''ve learned so much and met amazing people. Highly recommend checking out their culinary experiences.', 5, true, true),
    ('Meera Patel', 'meera@example.com', 'audience', 'As someone passionate about art, I''ve found the gallery exhibitions and art workshops to be carefully curated and incredibly enriching.', 5, true, true),
    ('Arijit Singh', 'arijit@example.com', 'artist', 'As an artist, I''ve found this platform to be incredibly supportive. The team is professional and the audience engagement is fantastic.', 5, true, true),
    ('Zakir Hussain', 'zakir@example.com', 'artist', 'The platform has helped me connect with music lovers across India. The technical support and audience reach are exceptional.', 5, true, true)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON public.testimonials 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON public.testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_is_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_role ON public.testimonials(role);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON public.testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_testimonials_event_id ON public.testimonials(event_id); 