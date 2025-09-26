-- Add apple_app_id column to store_credentials table for proper App Store Connect integration
-- This stores the numeric Apple App ID needed for creating in-app purchases

ALTER TABLE public.store_credentials 
ADD COLUMN apple_app_id text;

-- Add index for performance
CREATE INDEX idx_store_credentials_apple_app_id ON public.store_credentials(apple_app_id);

-- Add helpful comment
COMMENT ON COLUMN public.store_credentials.apple_app_id IS 'Apple App Store Connect App ID (numeric ID from Apple, not bundle_id). Only relevant for app_store type credentials.';

-- Add constraint to ensure apple_app_id is numeric when provided
ALTER TABLE public.store_credentials 
ADD CONSTRAINT check_apple_app_id_numeric 
CHECK (apple_app_id IS NULL OR apple_app_id ~ '^[0-9]+$');