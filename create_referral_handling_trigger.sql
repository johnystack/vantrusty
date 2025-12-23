-- Create a function to handle new user profiles and referral linking
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    referrer_id uuid;
BEGIN
    -- Create a profile for the new user
    INSERT INTO public.profiles (id, full_name, username)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'username');

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

-- Create a trigger to run the function after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
