import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

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
      // Create new user with Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
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

      // Create developer profile
      const { data: developer, error: developerError } = await supabaseAdmin
        .from('developers')
        .insert({
          id: authData.user.id,
          email,
          name: email.split('@')[0], // Use email prefix as initial name
          workspace_name: workspaceName || null,
          company_size: companySize || null,
          role: role || null,
          phone_number: phoneNumber || null,
          time_zone: timeZone || null,
          terms_accepted_at: acceptTerms ? new Date().toISOString() : null,
          data_processing_consent_at: acceptDataProcessing ? new Date().toISOString() : null,
          account_source: 'onboarding'
        })
        .select()
        .single();

      if (developerError) {
        // Rollback user creation if developer profile fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return NextResponse.json(
          { error: 'Failed to create developer profile: ' + developerError.message },
          { status: 400 }
        );
      }

      // Create initial game if game project name is provided
      if (gameProjectName) {
        const { error: gameError } = await supabaseAdmin
          .from('games')
          .insert({
            developer_id: authData.user.id,
            name: gameProjectName,
            platform: 'both', // Default to both platforms
            status: 'active',
            integration_status: 'pending'
          });

        if (gameError) {
          console.error('Failed to create game:', gameError);
          // Don't fail the whole process if game creation fails
        }
      }

      return NextResponse.json({ 
        success: true,
        developerId: authData.user.id,
        developer
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
    console.error('Workspace creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}