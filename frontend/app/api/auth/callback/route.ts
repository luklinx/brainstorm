import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle Supabase auth callback
    const { access_token, refresh_token } = body
    
    if (!access_token) {
      return NextResponse.json(
        { error: 'Missing access token' },
        { status: 400 }
      )
    }

    // Create response with credentials
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    )

    // Set secure cookies for auth tokens
    response.cookies.set('supabase-auth-token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    if (refresh_token) {
      response.cookies.set('supabase-refresh-token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
      })
    }

    return response
  } catch (error: any) {
    console.error('Auth callback error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
