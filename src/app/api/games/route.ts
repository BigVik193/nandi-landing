import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// Helper function to parse revenue ranges to cents
function parseRevenueToCents(revenueRange: string): number | null {
  if (!revenueRange) return null;
  
  const ranges: Record<string, number> = {
    // Current revenue ranges (from live games)
    '0-1000': 500 * 100, // Use midpoint, convert to cents
    '1000-10000': 5500 * 100,
    '10000-50000': 30000 * 100,
    '50000-100000': 75000 * 100,
    '100000+': 150000 * 100
  };
  
  return ranges[revenueRange] || null;
}

// Helper function to parse MAU ranges
function parseMAU(mauRange: string): number | null {
  if (!mauRange) return null;
  
  const ranges: Record<string, number> = {
    '0-1000': 500,
    '1000-10000': 5500,
    '10000-100000': 55000,
    '100000-1000000': 550000,
    '1000000+': 1500000
  };
  
  return ranges[mauRange] || null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developerId = searchParams.get('developerId');

    if (!developerId) {
      return NextResponse.json(
        { error: 'Developer ID is required' },
        { status: 400 }
      );
    }

    const { data: games, error } = await supabaseAdmin
      .from('games')
      .select('*')
      .eq('developer_id', developerId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch games: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Games fetch error:', error);
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
      developerId,
      gameTitle,
      genre,
      artStyle,
      pegiRegion,
      monetizationModel,
      platforms,
      techStack,
      bundleId,
      developmentStage,
      monthlyActiveUsers,
      currentRevenue,
      gameEngineVersion
    } = body;

    if (!developerId) {
      return NextResponse.json(
        { error: 'Developer ID is required' },
        { status: 400 }
      );
    }

    if (!gameTitle) {
      return NextResponse.json(
        { error: 'Game title is required' },
        { status: 400 }
      );
    }

    // Check if developer exists
    const { data: developer } = await supabaseAdmin
      .from('developers')
      .select('id')
      .eq('id', developerId)
      .single();

    if (!developer) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    // Check if game already exists for this developer
    const { data: existingGame } = await supabaseAdmin
      .from('games')
      .select('id')
      .eq('developer_id', developerId)
      .eq('name', gameTitle)
      .maybeSingle();

    let gameId;

    if (existingGame) {
      // Update existing game
      const { data: updatedGame, error: updateError } = await supabaseAdmin
        .from('games')
        .update({
          genre,
          art_style: artStyle,
          target_region: pegiRegion,
          monetization_model: monetizationModel,
          platform: platforms?.includes('iOS') && platforms?.includes('Android') ? 'both' : 
                   platforms?.includes('iOS') ? 'ios' : 
                   platforms?.includes('Android') ? 'android' : 'both',
          tech_stack: techStack,
          store_state: 'augment', // Default to augmenting existing in-app store
          store_surfaces: 'inapp', // Default to in-game store only
          bundle_id: bundleId || null,
          development_stage: developmentStage || null,
          monthly_active_users: parseMAU(monthlyActiveUsers),
          current_revenue_cents: parseRevenueToCents(currentRevenue),
          game_engine_version: gameEngineVersion || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingGame.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update game: ' + updateError.message },
          { status: 400 }
        );
      }

      gameId = existingGame.id;
    } else {
      // Create new game
      const { data: newGame, error: createError } = await supabaseAdmin
        .from('games')
        .insert({
          developer_id: developerId,
          name: gameTitle,
          genre,
          art_style: artStyle,
          target_region: pegiRegion,
          monetization_model: monetizationModel,
          platform: platforms?.includes('iOS') && platforms?.includes('Android') ? 'both' : 
                   platforms?.includes('iOS') ? 'ios' : 
                   platforms?.includes('Android') ? 'android' : 'both',
          tech_stack: techStack,
          store_state: 'augment', // Default to augmenting existing in-app store
          store_surfaces: 'inapp', // Default to in-game store only
          bundle_id: bundleId || null,
          development_stage: developmentStage || null,
          monthly_active_users: parseMAU(monthlyActiveUsers),
          current_revenue_cents: parseRevenueToCents(currentRevenue),
          game_engine_version: gameEngineVersion || null,
          status: 'active',
          integration_status: 'pending'
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create game: ' + createError.message },
          { status: 400 }
        );
      }

      gameId = newGame.id;
    }

    return NextResponse.json({ 
      success: true,
      gameId
    });
  } catch (error) {
    console.error('Game creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}