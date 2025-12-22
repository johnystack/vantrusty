CREATE POLICY "Allow admin to update investments"
ON public.investments
FOR UPDATE
TO authenticated
USING (get_my_claim('role') = 'admin'::text)
WITH CHECK (get_my_claim('role') = 'admin'::text);
