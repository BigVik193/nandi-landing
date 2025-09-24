import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    // Get developer
    const { data: developer, error: developerError } = await supabaseAdmin
      .from('developers')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();

    if (developerError || !developer) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    // Get developer's games
    const { data: games, error: gamesError } = await supabaseAdmin
      .from('games')
      .select('*')
      .eq('developer_id', resolvedParams.id);

    if (gamesError) {
      return NextResponse.json(
        { error: 'Failed to fetch games' },
        { status: 400 }
      );
    }

    // Determine onboarding status
    const hasAccount = true; // If we got the developer, they have an account
    
    // Project setup is complete if they have at least one game with required fields
    const hasProjectSetup = games && games.length > 0 && games.some(game => 
      game.name && 
      game.genre && 
      game.platform && 
      game.monetization_model
    );

    // SDK setup is complete if any game has integration configured
    const hasSDKSetup = games && games.some(game => 
      ['configured', 'tested', 'active'].includes(game.integration_status)
    );

    // Determine the next step
    let nextStep = null;
    let isOnboardingComplete = false;

    if (!hasProjectSetup) {
      nextStep = '/onboarding/project';
    } else if (!hasSDKSetup) {
      nextStep = '/onboarding/sdk';
    } else {
      isOnboardingComplete = true;
      nextStep = '/dashboard'; // or wherever completed users should go
    }

    return NextResponse.json({
      developer,
      onboardingStatus: {
        hasAccount,
        hasProjectSetup,
        hasSDKSetup,
        isComplete: isOnboardingComplete,
        nextStep,
        progress: {
          completed: [hasAccount, hasProjectSetup, hasSDKSetup].filter(Boolean).length,
          total: 3,
          percentage: Math.round(([hasAccount, hasProjectSetup, hasSDKSetup].filter(Boolean).length / 3) * 100)
        }
      },
      games: games || []
    });
  } catch (error) {
    console.error('Onboarding status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}