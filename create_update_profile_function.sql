CREATE OR REPLACE FUNCTION public.update_profile(
  full_name_arg text,
  username_arg text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check for username uniqueness, excluding the current user's own username if it's unchanged
  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE username = username_arg
    AND id <> auth.uid()
  ) THEN
    RAISE EXCEPTION 'Username "%" is already taken.', username_arg;
  END IF;

  UPDATE public.profiles
  SET
    full_name = full_name_arg,
    username = username_arg,
    updated_at = NOW()
  WHERE id = auth.uid();
END;
$$;