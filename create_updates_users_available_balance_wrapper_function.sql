CREATE OR REPLACE FUNCTION public.updates_users_available_balance(p_user_id uuid, p_amount numeric)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- This is a wrapper function to correct a likely typo in a trigger or other database object.
  -- It calls the correctly named function 'public.update_user_available_balance'.
  PERFORM public.update_user_available_balance(p_user_id, p_amount);
END;
$$;
