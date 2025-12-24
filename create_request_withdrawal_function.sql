CREATE OR REPLACE FUNCTION public.request_withdrawal(
  amount_to_withdraw numeric,
  address text
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_balance numeric;
BEGIN
  -- Get the user's current available balance and lock the row for update
  SELECT available_balance INTO current_balance
  FROM public.profiles
  WHERE id = current_user_id
  FOR UPDATE;

  -- Check if the user has enough balance
  IF current_balance < amount_to_withdraw THEN
    RAISE EXCEPTION 'Insufficient balance to make withdrawal.';
  END IF;

  -- Deduct the amount from the user's balance
  UPDATE public.profiles
  SET available_balance = available_balance - amount_to_withdraw
  WHERE id = current_user_id;

  -- Insert the withdrawal request
  INSERT INTO public.withdrawals(user_id, amount, wallet_address, status)
  VALUES (current_user_id, amount_to_withdraw, address, 'pending');
END;
$$;
