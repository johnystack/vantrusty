-- Create a new ENUM type for user status
CREATE TYPE user_status AS ENUM ('active', 'suspended');

-- Add the status column to the profiles table
-- All existing users will default to 'active'
ALTER TABLE public.profiles
ADD COLUMN status user_status DEFAULT 'active';
