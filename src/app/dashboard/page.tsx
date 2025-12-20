"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

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

  const newPh = () => {
    window.location.href = "/ph/new";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button
          onClick={logout}
          className="mt-6 border px-4 py-2 rounded bg-red-500 text-white hover:cursor-pointer"
          variant={"destructive"}
        >
          Cerrar sesión
        </Button>
      </div>

      <p className="mt-2 text-gray-600">
        Sesión activa como: <strong>{email}</strong>
      </p>

      <Button
        onClick={newPh}
        className="mt-6 border px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer"
      >
        Crear Nuevo PH
      </Button>
    </div>
  );
}
