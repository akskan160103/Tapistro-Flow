import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/workflows - Get all workflows for a specific user
// request: NextRequest is the parameter called request of type NextRequest
export async function GET(request: NextRequest)  {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workflows: data })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 })
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(request: NextRequest) {
  try {
    const { name, nodes, edges, username } = await request.json()

    if (!name || !nodes || !edges || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('workflows')
      .insert([{ name, nodes, edges, username }])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workflow: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 })
  }
}

// DELETE /api/workflows - Delete all workflows for a specific user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('username', username)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'All workflows deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete workflows' }, { status: 500 })
  }
}
