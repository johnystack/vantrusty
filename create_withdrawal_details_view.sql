CREATE OR REPLACE VIEW public.withdrawal_details AS
SELECT
    w.id,
    w.user_id,
    w.amount,
    w.wallet_address,
    w.status,
    w.created_at,
    p.full_name,
    p.username
FROM
    public.withdrawals w
JOIN
    public.profiles p ON w.user_id = p.id;
