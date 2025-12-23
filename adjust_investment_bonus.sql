CREATE OR REPLACE FUNCTION adjust_investment_bonus(
    p_investment_id INTEGER,
    p_bonus_adjustment NUMERIC
)
RETURNS VOID AS $$
BEGIN
    -- Check if the user is an admin before allowing the operation
    -- This is a placeholder for your actual role check logic.
    -- You might have a function like `is_admin()` or check against a roles table.
    -- For now, we'll assume the function is called from a context where admin rights are verified.
    
    UPDATE public.investments
    SET bonus = bonus + p_bonus_adjustment
    WHERE id = p_investment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: You might need to grant execute permissions on this function
-- to your authenticated or admin role, e.g.:
-- GRANT EXECUTE ON FUNCTION adjust_investment_bonus(INTEGER, NUMERIC) TO authenticated;

COMMENT ON FUNCTION adjust_investment_bonus(INTEGER, NUMERIC) IS 'Allows an admin to add or deduct a bonus amount from a specific investment.';
