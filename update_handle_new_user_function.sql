CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    referrer_id uuid;
BEGIN
    -- Create a profile for the new user, including created_at
    INSERT INTO public.profiles (id, full_name, username, created_at)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username', NEW.created_at);

    -- Check if a referrer username was provided
    IF NEW.raw_user_meta_data->>'referrer_username' IS NOT NULL THEN
        -- Find the referrer's ID
        SELECT id INTO referrer_id
        FROM public.profiles
        WHERE username = NEW.raw_user_meta_data->>'referrer_username';

        -- If referrer found, update the new user's profile
        IF referrer_id IS NOT NULL THEN
            UPDATE public.profiles
            SET referred_by = referrer_id
            WHERE id = NEW.id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;