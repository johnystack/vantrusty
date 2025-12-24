-- This policy is updated to use the get_user_role() helper function.
-- This avoids the infinite recursion error caused by using a subquery on the same table in the policy.
CREATE OR REPLACE POLICY "Allow admins to view all user profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'admin'
);
