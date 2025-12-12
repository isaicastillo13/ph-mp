"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = "/login";
        return;
      }
      setEmail(data.user.email ?? "");
      setLoading(false);
    };

    load();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return <div className="p-6">Cargando...</div>;

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

      <div className="mt-6 rounded-xl border p-4">
        <p className="font-medium">Siguiente paso</p>
        <p className="text-sm text-gray-600 mt-1">
          Aquí vamos a cargar tu rol desde <code>ph_members</code> y renderizar
          el menú según admin/junta/residente.
        </p>
      </div>
    </div>
  );
}
