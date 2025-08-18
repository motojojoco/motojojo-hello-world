-- Create banners table
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    link_text VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Banners are viewable by everyone" ON public.banners
    FOR SELECT USING (true);

CREATE POLICY "Banners are insertable by authenticated users" ON public.banners
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Banners are updatable by authenticated users" ON public.banners
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Banners are deletable by authenticated users" ON public.banners
    FOR DELETE USING (auth.role() = 'authenticated');

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;

-- Insert default banners
INSERT INTO public.banners (title, subtitle, image_url, link_url, link_text, sort_order) VALUES
    ('Sunburn Festival 2025', 'Asia''s Biggest Electronic Dance Music Festival', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2938&auto=format&fit=crop', '/events', 'Explore Events', 1),
    ('Prithvi Theatre Festival', 'Celebrating 45 Years of Theatre Excellence', 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=2940&auto=format&fit=crop', '/events', 'View Shows', 2),
    ('Comic Con India', 'India''s Greatest Pop Culture Experience', 'https://images.unsplash.com/photo-1608889825105-eebdb9aa6b8d?q=80&w=2880&auto=format&fit=crop', '/events', 'Get Tickets', 3)
ON CONFLICT DO NOTHING;

-- Create updated_at trigger
CREATE TRIGGER update_banners_updated_at 
    BEFORE UPDATE ON public.banners 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_banners_sort_order ON public.banners(sort_order);
CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active); 