-- Categories Table Setup Script
-- Run this in your Supabase SQL Editor

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

-- Verify the table was created
SELECT * FROM public.categories ORDER BY sort_order, name;

-- Create users table for Motojojo Events
-- Run this in your Supabase SQL Editor

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(255) PRIMARY KEY, -- Clerk user ID
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    preferences JSONB DEFAULT '[]'::jsonb, -- Array of category IDs
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id);

CREATE POLICY "Users can delete their own profile" ON public.users
    FOR DELETE USING (auth.uid()::text = id);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_users_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_users_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_preferences ON public.users USING GIN(preferences);

-- Insert a test user (optional - for testing)
-- INSERT INTO public.users (id, email, full_name, phone, city, preferences) 
-- VALUES ('test_user_123', 'test@example.com', 'Test User', '+1234567890', 'Mumbai', '[1, 2, 3]'::jsonb)
-- ON CONFLICT (id) DO NOTHING; 