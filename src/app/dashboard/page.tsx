"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setEmail(data.user.email ?? "");
    };

    run();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={logout}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      <p className="mt-4 text-gray-600">
        Sesión activa como: <span className="font-medium">{email}</span>
      </p>
    </div>
  );
}
