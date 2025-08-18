-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex color code
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by authenticated users" ON public.categories
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories are updatable by authenticated users" ON public.categories
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Categories are deletable by authenticated users" ON public.categories
    FOR DELETE USING (auth.role() = 'authenticated');

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;

-- Insert default categories
INSERT INTO public.categories (name, icon, color, description, sort_order) VALUES
    ('Music', 'Music', '#6A0DAD', 'Live music performances, concerts, and festivals', 1),
    ('Theatre', 'Theater', '#FF1F4C', 'Drama, plays, and theatrical performances', 2),
    ('Comedy', 'Laugh', '#FFC300', 'Stand-up comedy and humorous performances', 3),
    ('Tech', 'Cpu', '#4EA8DE', 'Technology conferences and workshops', 4),
    ('Food', 'Utensils', '#FF6D00', 'Food festivals and culinary events', 5),
    ('Art', 'Palette', '#8BC34A', 'Art exhibitions and creative workshops', 6),
    ('Sports', 'Trophy', '#F44336', 'Sports events and competitions', 7),
    ('Workshop', 'Hammer', '#795548', 'Educational workshops and training sessions', 8)
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 