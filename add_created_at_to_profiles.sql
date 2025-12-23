ALTER TABLE public.profiles
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.profiles p
SET created_at = au.created_at
FROM auth.users au
WHERE p.id = au.id
AND p.created_at IS NULL;