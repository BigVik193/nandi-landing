-- Create store_credentials table for managing app store API credentials
CREATE TABLE public.store_credentials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_id uuid NOT NULL REFERENCES public.developers(id) ON DELETE CASCADE,
    game_id uuid NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    store_type text NOT NULL CHECK (store_type IN ('google_play', 'app_store')),
    credential_name text NOT NULL,
    credential_data jsonb NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    last_validated_at timestamp with time zone,
    validation_status text CHECK (validation_status IN ('pending', 'valid', 'invalid', 'expired')) DEFAULT 'pending',
    validation_error text,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add RLS policy
ALTER TABLE public.store_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for developers to manage their own credentials
CREATE POLICY "Developers can manage their own store credentials" ON public.store_credentials
    FOR ALL USING (developer_id = auth.uid());

-- Add indexes for performance
CREATE INDEX idx_store_credentials_developer_id ON public.store_credentials(developer_id);
CREATE INDEX idx_store_credentials_game_id ON public.store_credentials(game_id);
CREATE INDEX idx_store_credentials_store_type ON public.store_credentials(store_type);

-- Unique partial index to ensure only one active credential per game+store_type
CREATE UNIQUE INDEX idx_store_credentials_unique_active 
ON public.store_credentials(game_id, store_type) 
WHERE is_active = true;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_store_credentials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_store_credentials_updated_at
    BEFORE UPDATE ON public.store_credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_store_credentials_updated_at();

-- Add helpful comments
COMMENT ON TABLE public.store_credentials IS 'Stores encrypted app store API credentials for developers';
COMMENT ON COLUMN public.store_credentials.credential_data IS 'JSON containing store-specific credential data (service account JSON, API keys, etc.)';
COMMENT ON COLUMN public.store_credentials.validation_status IS 'Status of last credential validation attempt';
COMMENT ON COLUMN public.store_credentials.metadata IS 'Additional metadata like service account email, key ID, etc.';