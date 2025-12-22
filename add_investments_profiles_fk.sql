ALTER TABLE public.investments
ADD CONSTRAINT investments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
