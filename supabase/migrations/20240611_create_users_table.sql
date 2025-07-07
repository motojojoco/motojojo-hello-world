-- Drop the old users table if it exists
DROP TABLE IF EXISTS public.users CASCADE;

-- Create new users table matching Supabase Auth users, with role
CREATE TABLE public.users (
    id UUID PRIMARY KEY, -- Matches auth.users.id
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    city VARCHAR(100),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only see/update their own row)
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid()::uuid = id);
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid()::uuid = id);
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::uuid = id);
CREATE POLICY "Users can delete their own profile" ON public.users
    FOR DELETE USING (auth.uid()::uuid = id);

-- Trigger to sync new auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, created_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email); 