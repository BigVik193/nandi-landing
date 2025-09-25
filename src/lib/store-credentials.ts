/**
 * Store Credentials Manager
 * Handles retrieving and managing store credentials from database
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface StoreCredential {
  id: string;
  game_id: string;
  store_type: 'google_play' | 'app_store';
  credential_name: string;
  credential_data: any;
  is_active: boolean;
  validation_status: 'pending' | 'valid' | 'invalid' | 'expired';
  validation_error?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export async function getActiveCredentials(
  gameId: string, 
  storeType: 'google_play' | 'app_store'
): Promise<StoreCredential | null> {
  const { data, error } = await supabase
    .from('store_credentials')
    .select('*')
    .eq('game_id', gameId)
    .eq('store_type', storeType)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error(`Error fetching ${storeType} credentials for game ${gameId}:`, error);
    return null;
  }

  return data;
}

export async function updateCredentialValidation(
  credentialId: string,
  status: 'pending' | 'valid' | 'invalid' | 'expired',
  error?: string
): Promise<boolean> {
  const updateData: any = {
    validation_status: status,
    last_validated_at: new Date().toISOString(),
  };

  if (error) {
    updateData.validation_error = error;
  } else {
    updateData.validation_error = null;
  }

  const { error: updateError } = await supabase
    .from('store_credentials')
    .update(updateData)
    .eq('id', credentialId);

  if (updateError) {
    console.error(`Error updating credential validation:`, updateError);
    return false;
  }

  return true;
}

export async function getGooglePlayCredentials(gameId: string): Promise<{
  serviceAccountKey: string;
  packageName: string;
  credentialId: string;
} | null> {
  const credential = await getActiveCredentials(gameId, 'google_play');
  
  if (!credential) {
    return null;
  }

  return {
    serviceAccountKey: JSON.stringify(credential.credential_data),
    packageName: credential.metadata.package_name,
    credentialId: credential.id
  };
}

export async function getAppStoreCredentials(gameId: string): Promise<{
  keyId: string;
  issuerId: string;
  privateKey: string;
  bundleId: string;
  credentialId: string;
} | null> {
  const credential = await getActiveCredentials(gameId, 'app_store');
  
  if (!credential) {
    return null;
  }

  const data = credential.credential_data;
  return {
    keyId: data.key_id,
    issuerId: data.issuer_id,
    privateKey: data.private_key,
    bundleId: credential.metadata.bundle_id,
    credentialId: credential.id
  };
}