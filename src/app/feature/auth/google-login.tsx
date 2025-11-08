'use client'
import { createClient } from "@/utils/supabase/client"

// ログインボタン
export default function GoogleLogin() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider  : 'google',
      options : {
        redirectTo : `${baseUrl}/api/auth/callback?next=/dashboard`,
      }
    })
    if (error) {
      console.log(error);
    }
  }
    return (
        <div>
          <button onClick={handleGoogleLogin}
          className="bg-blue-500 text-white p-2 rounded-md"
          >Google Login</button>
        </div>
    )
}