"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      setEmail(data.user.email ?? "");
    });
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <p className="mt-2 text-gray-600">
        Sesión activa como: <strong>{email}</strong>
      </p>

      <button onClick={logout} className="mt-6 border px-4 py-2 rounded">
        Cerrar sesión
      </button>
    </div>
  );
}
