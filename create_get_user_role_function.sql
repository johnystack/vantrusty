CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS TEXT AS $$
  -- This function is created with SECURITY DEFINER to bypass RLS when checking a user's role.
  -- This is necessary to avoid infinite recursion in RLS policies on the profiles table.
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;
