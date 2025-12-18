"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const phSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  adress: z.string().min(1, "La dirección es obligatoria"),
});

export default function NewPHPage() {
  const from = useForm({
    resolver: zodResolver(phSchema),
  });

  const onSubmit = async (data: z.infer<typeof phSchema>) => {
    const { error } = await supabase
      .from("ph")
      .insert([{ name: data.name, adress: data.adress }]);

    if (error) {
      alert("Error al crear la PH: " + error.message);
    } else {
      alert("PH creada con éxito");
      from.reset();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Crear Nueva PH</h1>
      <form onSubmit={from.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Nombre:</label>
          <input
            type="text"
            {...from.register("name")}
            className="w-full border px-3 py-2 rounded"
          />
          {from.formState.errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {from.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">Dirección:</label>
          <input
            type="text"
            {...from.register("adress")}
            className="w-full border px-3 py-2 rounded"
          />
          {from.formState.errors.adress && (
            <p className="text-red-500 text-sm mt-1">
              {from.formState.errors.adress.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Crear PH
        </button>
      </form>
    </div>
  );
}
