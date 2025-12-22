CREATE OR REPLACE FUNCTION get_my_claim(claim TEXT) RETURNS TEXT AS $$
  SELECT coalesce(current_setting('request.jwt.claims', true)::jsonb ->> claim, null);
$$ LANGUAGE SQL STABLE;
