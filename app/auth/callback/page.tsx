"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          console.error("Auth callback error:", error.message);
          router.replace("/login");
        } else {
          router.replace("/");
        }
      });
    } else {
      // No code — check if session already exists (implicit flow / hash tokens)
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
      });
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">正在验证...</p>
    </div>
  );
}
