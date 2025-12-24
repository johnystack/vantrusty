CREATE OR REPLACE FUNCTION public.reject_withdrawal(
  withdrawal_id_to_reject bigint
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  withdrawal_record public.withdrawals;
BEGIN
  -- Get the withdrawal record
  SELECT * INTO withdrawal_record
  FROM public.withdrawals
  WHERE id = withdrawal_id_to_reject
  FOR UPDATE;

  -- Check if the withdrawal is in a pending state
  IF withdrawal_record.status <> 'pending' THEN
    RAISE EXCEPTION 'Withdrawal is not in a pending state.';
  END IF;

  -- Return the funds to the user's balance
  UPDATE public.profiles
  SET available_balance = available_balance + withdrawal_record.amount
  WHERE id = withdrawal_record.user_id;

  -- Update the withdrawal status to 'rejected'
  UPDATE public.withdrawals
  SET status = 'rejected'
  WHERE id = withdrawal_id_to_reject;
END;
$$;
