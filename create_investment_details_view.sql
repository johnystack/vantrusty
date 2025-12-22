CREATE OR REPLACE VIEW public.investment_details AS
SELECT
    i.id,
    i.user_id,
    i.amount,
    i.status,
    i.created_at,
    i.start_date,
    i.end_date,
    i.crypto_type,
    i.proof_of_payment_url,
    p.full_name,
    u.email,
    ip.name AS plan_name,
    ip.duration_days AS plan_duration_days
FROM
    public.investments i
JOIN
    public.profiles p ON i.user_id = p.id
JOIN
    auth.users u ON i.user_id = u.id
JOIN
    public.investment_plans ip ON i.plan_id = ip.id;
