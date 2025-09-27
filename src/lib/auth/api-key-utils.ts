import { supabaseAdmin } from '@/lib/supabase/server';
import { createHash } from 'crypto';

/**
 * Utility functions for handling API keys and extracting game information
 */

export interface ApiKeyInfo {
  gameId: string;
  isValid: boolean;
  apiKeyRecord?: any;
  error?: string;
}

/**
 * Validates an API key against the database and returns the associated game ID
 */
export async function validateApiKey(apiKey: string): Promise<ApiKeyInfo> {
  if (!apiKey) {
    return {
      gameId: '',
      isValid: false,
      error: 'API key is required'
    };
  }

  // Remove 'Bearer ' prefix if present
  const cleanKey = apiKey.replace(/^Bearer\s+/i, '');

  // Check if it starts with 'nandi_'
  if (!cleanKey.startsWith('nandi_')) {
    return {
      gameId: '',
      isValid: false,
      error: 'Invalid API key format. Must start with "nandi_"'
    };
  }

  try {
    // Hash the API key to compare with stored hash
    const keyHash = createHash('sha256').update(cleanKey).digest('hex');

    // Look up the API key in the database
    const { data: apiKeyRecord, error } = await supabaseAdmin
      .from('api_keys')
      .select(`
        id,
        game_id,
        name,
        key_prefix,
        permissions,
        is_active,
        expires_at,
        games (
          id,
          name,
          status
        )
      `)
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Database error validating API key:', error);
      return {
        gameId: '',
        isValid: false,
        error: 'Database error during API key validation'
      };
    }

    if (!apiKeyRecord) {
      return {
        gameId: '',
        isValid: false,
        error: 'Invalid API key'
      };
    }

    // Check if the API key has expired
    if (apiKeyRecord.expires_at && new Date(apiKeyRecord.expires_at) < new Date()) {
      return {
        gameId: '',
        isValid: false,
        error: 'API key has expired'
      };
    }

    // Check if the associated game is active
    const game = Array.isArray(apiKeyRecord.games) ? apiKeyRecord.games[0] : apiKeyRecord.games;
    if (game?.status !== 'active') {
      return {
        gameId: '',
        isValid: false,
        error: 'Associated game is not active'
      };
    }

    // Update last_used_at timestamp
    await supabaseAdmin
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', apiKeyRecord.id);

    return {
      gameId: apiKeyRecord.game_id,
      isValid: true,
      apiKeyRecord
    };

  } catch (error) {
    console.error('Error validating API key:', error);
    return {
      gameId: '',
      isValid: false,
      error: 'Internal error during API key validation'
    };
  }
}

/**
 * Validates and extracts authentication info from request headers
 */
export async function getAuthInfo(request: Request): Promise<ApiKeyInfo> {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return {
      gameId: '',
      isValid: false,
      error: 'Authorization header is required'
    };
  }

  return await validateApiKey(authHeader);
}

/**
 * Helper function to create unauthorized response
 */
export function createUnauthorizedResponse(error: string) {
  return new Response(
    JSON.stringify({ success: false, error }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}