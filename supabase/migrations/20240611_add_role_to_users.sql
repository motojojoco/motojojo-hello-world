-- Add 'role' column to users table for admin/user distinction
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user';

-- Optionally, update existing users to have 'user' role (if any are NULL)
UPDATE public.users SET role = 'user' WHERE role IS NULL;

-- (Optional) You may want to add a check constraint for allowed roles
-- ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

-- No policy changes needed if access is still based on id, but you can add admin-specific policies if required. 