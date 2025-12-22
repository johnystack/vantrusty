-- Enable RLS for the cryptocurrencies table
ALTER TABLE public.cryptocurrencies ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to select all cryptocurrencies
CREATE POLICY "Allow admins to select all cryptocurrencies"
ON public.cryptocurrencies
FOR SELECT
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Policy to allow admins to insert new cryptocurrencies
CREATE POLICY "Allow admins to insert new cryptocurrencies"
ON public.cryptocurrencies
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Policy to allow admins to update cryptocurrencies
CREATE POLICY "Allow admins to update cryptocurrencies"
ON public.cryptocurrencies
FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Policy to allow admins to delete cryptocurrencies
CREATE POLICY "Allow admins to delete cryptocurrencies"
ON public.cryptocurrencies
FOR DELETE
TO authenticated
USING (
  (SELECT role FROM public._profiles WHERE id = auth.uid()) = 'admin'
);