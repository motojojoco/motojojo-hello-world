-- Create event_types table
CREATE TABLE IF NOT EXISTS public.event_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    image_url TEXT, -- URL to the event type image
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    deletable BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Event types are viewable by everyone" ON public.event_types
    FOR SELECT USING (true);

CREATE POLICY "Event types are insertable by authenticated users" ON public.event_types
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Event types are updatable by authenticated users" ON public.event_types
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Event types are deletable by authenticated users" ON public.event_types
    FOR DELETE USING (auth.role() = 'authenticated');

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_types;

-- Insert default event types
INSERT INTO public.event_types (name, icon, description, sort_order, deletable) VALUES
    ('Concert', '🎵', 'Live music performances and concerts', 1, false),
    ('Theatre', '🎭', 'Drama, plays, and theatrical performances', 2, false),
    ('Comedy', '😂', 'Stand-up comedy and humorous performances', 3, false),
    ('Conference', '💼', 'Business and technology conferences', 4, false),
    ('Workshop', '🔧', 'Educational workshops and training sessions', 5, false),
    ('Exhibition', '🎨', 'Art exhibitions and creative displays', 6, false),
    ('Sports', '⚽', 'Sports events and competitions', 7, false),
    ('Festival', '🎉', 'Cultural festivals and celebrations', 8, false)
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger
CREATE TRIGGER update_event_types_updated_at 
    BEFORE UPDATE ON public.event_types 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_event_types_name ON public.event_types(name);
CREATE INDEX IF NOT EXISTS idx_event_types_sort_order ON public.event_types(sort_order); 