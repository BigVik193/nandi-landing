import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, supabaseAdmin } from '@/lib/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const error_code = searchParams.get('error_code');
  const error_description = searchParams.get('error_description');
  const next = searchParams.get('next') ?? '/onboarding/project';

  // Handle errors from Supabase (expired tokens, etc.)
  if (error_code) {
    console.error('Supabase auth error:', { error_code, error_description });
    
    if (error_code === 'otp_expired') {
      return NextResponse.redirect(`${origin}/auth/signup?error=expired_link&message=Your verification link has expired. Please request a new one.`);
    }
    
    return NextResponse.redirect(`${origin}/auth/signup?error=auth_error&message=${error_description || 'Authentication failed'}`);
  }

  // Create server client with proper cookie handling
  const supabase = await createServerSupabaseClient();

  // Handle email verification with token_hash (modern Supabase approach)
  if (token_hash && type) {
    try {
      const { error } = await supabase.auth.verifyOtp({
        type: type as EmailOtpType,
        token_hash,
      });

      if (error) {
        console.error('OTP verification error:', error);
        return NextResponse.redirect(`${origin}/auth/signup?error=verification_failed&message=${error.message}`);
      }

      // Get the user after verification
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // User verified successfully, handle profile creation
        return await handleUserProfileCreation(user, origin, next);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.redirect(`${origin}/auth/signup?error=verification_failed`);
    }
  }

  // Handle PKCE flow with authorization code
  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Session exchange error:', error);
        return NextResponse.redirect(`${origin}/auth/signup?error=verification_failed&message=${error.message}`);
      }

      // Get the user after code exchange
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return await handleUserProfileCreation(user, origin, next);
      }
    } catch (error) {
      console.error('Code exchange error:', error);
      return NextResponse.redirect(`${origin}/auth/signup?error=callback_failed`);
    }
  }

  // No valid auth parameters
  return NextResponse.redirect(`${origin}/auth/signup?error=invalid_request`);
}

async function handleUserProfileCreation(user: any, origin: string, next: string) {
  try {
    // Check if developer profile already exists
    const { data: existingDeveloper } = await supabaseAdmin
      .from('developers')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingDeveloper) {
      // Developer already exists, check their onboarding progress
      const { data: games } = await supabaseAdmin
        .from('games')
        .select('*')
        .eq('developer_id', user.id);

      // Determine next step based on onboarding status
      const hasProjectSetup = games && games.length > 0 && games.some(game => 
        game.name && game.genre && game.platform && game.monetization_model
      );

      const hasSDKSetup = games && games.some(game => 
        ['configured', 'tested', 'active'].includes(game.integration_status)
      );

      let nextStep = '/onboarding/project';

      if (hasProjectSetup && !hasSDKSetup) {
        nextStep = '/onboarding/sdk';
      } else if (hasProjectSetup && hasSDKSetup) {
        nextStep = '/dashboard';
      }

      return NextResponse.redirect(`${origin}${nextStep}`);
    }

    // Create developer profile using metadata from signup
    const metadata = user.user_metadata || {};
    
    const { error: developerError } = await supabaseAdmin
      .from('developers')
      .insert({
        id: user.id,
        email: user.email,
        name: user.email?.split('@')[0] || 'Developer',
        workspace_name: metadata.workspace_name || null,
        company_size: metadata.company_size || null,
        role: metadata.role || null,
        phone_number: metadata.phone_number || null,
        time_zone: metadata.time_zone || null,
        terms_accepted_at: metadata.terms_accepted ? new Date().toISOString() : null,
        data_processing_consent_at: metadata.data_processing_consent ? new Date().toISOString() : null,
        account_source: 'onboarding'
      });

    if (developerError) {
      console.error('Developer profile creation error:', developerError);
      return NextResponse.redirect(`${origin}/auth/signup?error=profile_creation_failed`);
    }

    // Create initial game if specified in metadata
    if (metadata.game_project_name) {
      const { error: gameError } = await supabaseAdmin
        .from('games')
        .insert({
          developer_id: user.id,
          name: metadata.game_project_name,
          platform: 'both',
          store_state: 'augment',
          store_surfaces: 'inapp',
          status: 'active',
          integration_status: 'pending'
        });

      if (gameError) {
        console.error('Initial game creation error:', gameError);
        // Don't fail the whole process if game creation fails
      }
    }

    // Redirect to next step
    return NextResponse.redirect(`${origin}${next}?verified=true`);

  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.redirect(`${origin}/auth/signup?error=profile_creation_failed`);
  }
}