-- Policies for investment_proofs storage bucket
-- Allow users to upload their own investment proofs
CREATE POLICY "Allow users to upload investment proofs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'investment_proofs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policies for investments table
-- Enable RLS for the investments table
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own investments
CREATE POLICY "Allow users to select their own investments"
ON public.investments
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

-- Allow users to create their own investments
CREATE POLICY "Allow users to create their own investments"
ON public.investments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);
