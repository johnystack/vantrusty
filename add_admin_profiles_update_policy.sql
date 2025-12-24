-- This policy allows users with the 'admin' role to update any row in the 'profiles' table.
-- It uses the get_user_role() helper function to avoid infinite recursion errors.
CREATE POLICY "Allow admins to update user profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'admin'
)
WITH CHECK (
  public.get_user_role(auth.uid()) = 'admin'
);
