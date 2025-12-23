CREATE OR REPLACE FUNCTION public.update_user_available_balance(p_user_id uuid, p_amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET available_balance = available_balance + p_amount
  WHERE id = p_user_id;
END;
$$;