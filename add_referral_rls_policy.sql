CREATE POLICY "Allow users to view profiles they referred"
ON public.profiles
FOR SELECT
TO authenticated
USING (referred_by = auth.uid());
