import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { data: developer, error } = await supabaseAdmin
      .from('developers')
      .select('*')
      .eq('id', resolvedParams.id)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const {
      name,
      workspaceName,
      companySize,
      role,
      phoneNumber,
      timeZone
    } = body;

    const { data: developer, error } = await supabaseAdmin
      .from('developers')
      .update({
        name: name || undefined,
        workspace_name: workspaceName || null,
        company_size: companySize || null,
        role: role || null,
        phone_number: phoneNumber || null,
        time_zone: timeZone || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', resolvedParams.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update developer: ' + error.message },
        { status: 400 }
      );
    }

    if (!developer) {
      return NextResponse.json(
        { error: 'Developer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      developer
    });
  } catch (error) {
    console.error('Developer update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}