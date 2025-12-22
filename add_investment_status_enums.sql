-- Before running this, ensure you have a backup of your data.
-- Adding new enum values is generally safe, but caution is advised.

ALTER TYPE public.investment_status ADD VALUE 'withdrawn' AFTER 'matured';
ALTER TYPE public.investment_status ADD VALUE 'reinvested' AFTER 'withdrawn';
