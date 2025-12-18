"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    // Si no hay sesión, fuera
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
      }
    });
  }, []);

  const handleChangePassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    change_flag();

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/auth/callback?next=/dashboard";
  };

  const change_flag = async () => {
    const { data } = await supabase.auth.getUser(); //consulto el usuario que tengo logueado
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", data.user.id);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Cambia tu contraseña</h1>

      <input
        type="password"
        className="w-full p-2 border mb-4"
        placeholder="Nueva contraseña"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button
        onClick={handleChangePassword}
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        Guardar contraseña
      </button>
    </div>
  );
}
