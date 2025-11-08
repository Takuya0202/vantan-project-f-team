'use client'
import { createClient } from "@/utils/supabase/client"
import { Google } from "@mui/icons-material";
import { useState } from "react";

// ログインボタン
export default function GoogleLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
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
    } else {
      setIsSubmitting(false);
    }
  }
    return (
        <div>
          <button onClick={handleGoogleLogin}
          className="py-[10px] px-7 flex items-center border border-black rounded-sm w-[260px]"
          disabled={isSubmitting}
          >
            <Google sx={{color: '#8F8F8F' , marginRight : "28px"}}/>
            <span className="text-[#8F8F8F]">Sign in with Google</span>
          </button>
        </div>
    )
}