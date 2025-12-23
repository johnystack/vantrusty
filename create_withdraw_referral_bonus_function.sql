CREATE OR REPLACE FUNCTION public.withdraw_referral_bonus()
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    p_user_id uuid;
    bonus_amount numeric;
BEGIN
    SELECT auth.uid() INTO p_user_id;

    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated.';
    END IF;

    -- Get the user's current referral bonus
    SELECT referral_bonus INTO bonus_amount
    FROM public.profiles
    WHERE id = p_user_id;

    IF bonus_amount IS NULL OR bonus_amount <= 0 THEN
        RAISE EXCEPTION 'No referral bonus to withdraw.';
    END IF;

    -- Deduct bonus from profiles.referral_bonus and add to profiles.available_balance
    UPDATE public.profiles
    SET
        referral_bonus = 0,
        available_balance = available_balance + bonus_amount
    WHERE id = p_user_id;

    RETURN bonus_amount;
END;
$$;