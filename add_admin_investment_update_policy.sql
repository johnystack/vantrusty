-- Add RLS policy for admins to update investments
CREATE POLICY "Allow admins to update investment status and dates"
ON public.investments
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = auth.uid() AND public.profiles.role = 'admin'
  )
  OR auth.uid() = user_id -- Allow users to update their own in certain scenarios if needed, but primarily for admin
);