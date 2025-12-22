-- Add a 'role' column to the 'profiles' table
ALTER TABLE public.profiles
ADD COLUMN role text DEFAULT 'user' NOT NULL;

-- Create a policy to allow users to read their own role
CREATE POLICY "Allow users to read their own role"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);
