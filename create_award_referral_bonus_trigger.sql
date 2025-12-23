-- Create a function to award referral bonus upon investment activation
CREATE OR REPLACE FUNCTION public.award_referral_bonus()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    referrer_profile public.profiles;
    referral_bonus_amount numeric;
BEGIN
    -- Check if the investment status changed to 'active'
    IF NEW.status = 'active' AND OLD.status IS DISTINCT FROM 'active' THEN
        -- Find the referrer of the user who made the investment
        SELECT * INTO referrer_profile
        FROM public.profiles
        WHERE id = (SELECT referred_by FROM public.profiles WHERE id = NEW.user_id);

        -- If a referrer exists, calculate and award the bonus
        IF referrer_profile.id IS NOT NULL THEN
            referral_bonus_amount := NEW.amount * 0.10; -- 10% of investment amount

            UPDATE public.profiles
            SET referral_bonus = referral_bonus + referral_bonus_amount
            WHERE id = referrer_profile.id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

-- Create a trigger to run the function after an investment is updated
CREATE TRIGGER on_investment_activated
AFTER UPDATE ON public.investments
FOR EACH ROW
EXECUTE FUNCTION public.award_referral_bonus();
