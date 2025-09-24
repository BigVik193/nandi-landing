import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { data: game, error } = await supabaseAdmin
      .from('games')
      .select(`
        *,
        virtual_items (*)
      `)
      .eq('id', resolvedParams.id)
      .single();

    if (error || !game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error('Game fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    
    const { data: game, error } = await supabaseAdmin
      .from('games')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update game: ' + error.message },
        { status: 400 }
      );
    }

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      game
    });
  } catch (error) {
    console.error('Game update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { error } = await supabaseAdmin
      .from('games')
      .update({ status: 'archived' })
      .eq('id', resolvedParams.id);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to archive game: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Game archived successfully'
    });
  } catch (error) {
    console.error('Game archive error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}