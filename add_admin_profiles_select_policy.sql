CREATE POLICY "Allow admins to view all user profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
