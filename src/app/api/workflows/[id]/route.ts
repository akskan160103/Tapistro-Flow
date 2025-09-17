import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT /api/workflows/[id] - Update a workflow
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, nodes, edges, username } = await request.json()
    const { id } = await params

    if (!name || !nodes || !edges || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('workflows')
      .update({ name, nodes, edges, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('username', username)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workflow: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 })
  }
}

// DELETE /api/workflows/[id] - Delete a workflow
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    // This makes sure that a user can only delete their own workflow although this is automatically enforced by filtering displayed workflows by username
    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', id)
      .eq('username', username)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Workflow deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 })
  }
}
