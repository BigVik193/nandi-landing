import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data: developer, error } = await supabaseAdmin
      .from('developers')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !developer) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ developer });
  } catch (error) {
    console.error('Developer fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      workspaceName, 
      gameProjectName,
      companySize,
      role,
      phoneNumber,
      timeZone,
      acceptTerms,
      acceptDataProcessing,
      isSignUp
    } = body;

    if (isSignUp) {
      // Sign up new user (sends verification email)
      const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
          data: {
            // Store onboarding data in user metadata for use after verification
            workspace_name: workspaceName,
            company_size: companySize,
            role: role,
            phone_number: phoneNumber,
            time_zone: timeZone,
            game_project_name: gameProjectName,
            terms_accepted: acceptTerms,
            data_processing_consent: acceptDataProcessing
          }
        }
      });

      if (authError) {
        return NextResponse.json(
          { error: authError.message },
          { status: 400 }
        );
      }

      if (!authData.user) {
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 400 }
        );
      }

      // Don't create developer profile yet - wait for email verification
      return NextResponse.json({ 
        success: true,
        message: 'Please check your email to verify your account',
        needsVerification: true,
        userId: authData.user.id
      });
    } else {
      // Sign in existing user
      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Get developer profile
      const { data: developer, error: developerError } = await supabaseAdmin
        .from('developers')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (developerError || !developer) {
        return NextResponse.json(
          { error: 'Developer profile not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true,
        developerId: authData.user.id,
        developer
      });
    }
  } catch (error) {
    console.error('Developer creation/authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}