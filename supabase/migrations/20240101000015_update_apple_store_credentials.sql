-- Migration to enhance Apple App Store credentials support and clean up games table
-- Remove store-specific fields from games table since they're now handled in store_credentials table

-- Remove the store-specific fields from the games table
ALTER TABLE public.games 
DROP COLUMN IF EXISTS app_store_team_id,
DROP COLUMN IF EXISTS google_play_app_id;

-- The foreign key reference is already correct - both games.id and store_credentials.game_id are uuid
-- No data type changes needed since both are already uuid

-- Indexes already exist from the previous migration, no need to recreate them

-- Add helpful comments about expected Apple App Store credential structure
COMMENT ON TABLE public.store_credentials IS 'Stores app store API credentials for developers. For Apple App Store: credential_data should contain app_name, bundle_id, p8_key_content, key_id, issuer_id. For Google Play: credential_data should contain service account JSON.';

-- Add a function to validate Apple App Store credentials structure
CREATE OR REPLACE FUNCTION validate_apple_store_credentials(credential_data jsonb)
RETURNS boolean AS $$
BEGIN
    -- Check if all required Apple App Store fields are present
    RETURN (
        credential_data ? 'app_name' AND
        credential_data ? 'bundle_id' AND  
        credential_data ? 'p8_key_content' AND
        credential_data ? 'key_id' AND
        credential_data ? 'issuer_id' AND
        credential_data ->> 'app_name' IS NOT NULL AND
        credential_data ->> 'bundle_id' IS NOT NULL AND
        credential_data ->> 'p8_key_content' IS NOT NULL AND
        credential_data ->> 'key_id' IS NOT NULL AND
        credential_data ->> 'issuer_id' IS NOT NULL
    );
END;
$$ LANGUAGE plpgsql;

-- Add a function to validate Google Play credentials structure  
CREATE OR REPLACE FUNCTION validate_google_play_credentials(credential_data jsonb)
RETURNS boolean AS $$
BEGIN
    -- Check if required Google Play service account fields are present
    RETURN (
        credential_data ? 'type' AND
        credential_data ? 'project_id' AND
        credential_data ? 'private_key_id' AND
        credential_data ? 'private_key' AND
        credential_data ? 'client_email' AND
        credential_data ? 'client_id' AND
        credential_data ->> 'type' = 'service_account'
    );
END;
$$ LANGUAGE plpgsql;

-- Add a check constraint to validate credential data structure based on store type
ALTER TABLE public.store_credentials 
ADD CONSTRAINT check_credential_data_structure 
CHECK (
    (store_type = 'app_store' AND validate_apple_store_credentials(credential_data)) OR
    (store_type = 'google_play' AND validate_google_play_credentials(credential_data)) OR
    validation_status = 'pending'  -- Allow pending credentials during onboarding
);