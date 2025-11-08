'use client'
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLogout = async () => {
    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    } else {
      setIsSubmitting(false);
      router.push('/top');
    }
  }
  return (
    <div>
      <button onClick={handleLogout} disabled={isSubmitting}>
        Logout
      </button>
    </div>
  )
}