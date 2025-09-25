import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const developerId = params.id;

    // Get all games for the developer
    const { data: games, error } = await supabaseAdmin
      .from('games')
      .select('id, name, bundle_id, platform')
      .eq('developer_id', developerId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching developer games:', error);
      return NextResponse.json(
        { error: 'Failed to fetch games' },
        { status: 500 }
      );
    }

    if (!games || games.length === 0) {
      return NextResponse.json(
        { error: 'No games found for this developer' },
        { status: 404 }
      );
    }

    return NextResponse.json({ games });
  } catch (error) {
    console.error('Error fetching developer games:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}