'use client'
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
export default function Dashboard() {
  const [name , setName] = useState<string | null>(null);
  const [error , setError] = useState<string | null>(null);
  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const { data , error } = await supabase.auth.getUser();
      if (error) {
        setError(error.message);
      } else {
        setName(data.user.email ?? null);
      }
    }
    getUser();

  })
    return (
        <div>
            <p>{error}</p>
            <p>{name}</p>
            <h1>Dashboard</h1>
        </div>
    )
}