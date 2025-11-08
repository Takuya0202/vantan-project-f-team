import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
// ログインのcallback
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // リダイレクト先のパラメータを取得
  const next = searchParams.get('next') ?? '/dashboard'
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || origin
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || origin
  return NextResponse.redirect(`${baseUrl}/auth/auth-error`)
}