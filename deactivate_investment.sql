UPDATE public.investments
SET status = 'pending'
WHERE id = [investment_id] AND status = 'active';