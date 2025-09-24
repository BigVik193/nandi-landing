import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, permissions, isActive, expiresAt } = await request.json();

    // Verify user owns the API key via game ownership
    const { data: apiKey, error: verifyError } = await supabaseAdmin
      .from('api_keys')
      .select(`
        id,
        games!inner (
          developer_id
        )
      `)
      .eq('id', resolvedParams.id)
      .eq('games.developer_id', user.id)
      .single();

    if (verifyError || !apiKey) {
      return NextResponse.json({ error: 'API key not found or unauthorized' }, { status: 404 });
    }

    // Update API key
    const { data: updatedApiKey, error: updateError } = await supabaseAdmin
      .from('api_keys')
      .update({
        name: name || undefined,
        permissions: permissions || undefined,
        is_active: isActive !== undefined ? isActive : undefined,
        expires_at: expiresAt !== undefined ? expiresAt : undefined,
        updated_at: new Date().toISOString()
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating API key:', updateError);
      return NextResponse.json({ error: 'Failed to update API key' }, { status: 500 });
    }

    return NextResponse.json({ apiKey: updatedApiKey });
  } catch (error) {
    console.error('API key PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the API key via game ownership
    const { data: apiKey, error: verifyError } = await supabaseAdmin
      .from('api_keys')
      .select(`
        id,
        games!inner (
          developer_id
        )
      `)
      .eq('id', resolvedParams.id)
      .eq('games.developer_id', user.id)
      .single();

    if (verifyError || !apiKey) {
      return NextResponse.json({ error: 'API key not found or unauthorized' }, { status: 404 });
    }

    // Delete API key
    const { error: deleteError } = await supabaseAdmin
      .from('api_keys')
      .delete()
      .eq('id', resolvedParams.id);

    if (deleteError) {
      console.error('Error deleting API key:', deleteError);
      return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API key DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get specific API key
    const { data: apiKey, error } = await supabaseAdmin
      .from('api_keys')
      .select(`
        id,
        name,
        key_prefix,
        permissions,
        is_active,
        last_used_at,
        expires_at,
        created_at,
        game_id,
        games!inner (
          developer_id
        )
      `)
      .eq('id', resolvedParams.id)
      .eq('games.developer_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching API key:', error);
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({ apiKey });
  } catch (error) {
    console.error('API key GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}