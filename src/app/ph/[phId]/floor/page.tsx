"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { es } from "zod/v4/locales";

// Describe las filas de mi tabla
type FloorRow = {
  ph_id: string;
  label: string;
  order_index: number;
};


// Reglas de los inputs del formulario
const generatorSchema = z.object({
  pbName: z.string().min(1, "El nombre de PB es obligatorio"),
  floorsCount: z.number().int().min(1, "Debe tener al menos 1 piso"),
  basementsCount: z.number().int().min(0, "No puede ser negativo"),
  socialAreasCount: z.number().int().min(0, "No puede ser negativo"),
});

type GeneratorValues = z.infer<typeof generatorSchema>;

export default function FloorsGeneratorPage() {
  const router = useRouter();
  // Obtiene el phid desde la url
  const params = useParams<{ phId: string }>();
  const phId = params?.phId;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [hasExistingFloors, setHasExistingFloors] = useState(false);

  useEffect(() => {

    // validar si el usuario está autenticado y si ya existen pisos  
    const run = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        window.location.href = "/login";
        return;
      }


      if (!phId) return;
      // valido si ya exixten pisos
      setCheckingExisting(true);

      const { count, error } = await supabase
        .from("floors")
        .select("id", { count: "exact", head: true })
        .eq("ph_id", phId);

        console.log("Existing floors check:", { count, error });

      if (!error && (count ?? 0) > 0) setHasExistingFloors(true);
      setCheckingExisting(false);
    };

    run();
  }, [phId]);

  const form = useForm<GeneratorValues>({
    // Signo valores por defecto a mi esquema
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      pbName: "PB",
      floorsCount: 1,
      basementsCount: 0,
      socialAreasCount: 0,
    },
    // valida mientras escribe
    mode: "onChange",
  });

  // valores en tiempo real
  const values = form.watch();

  //Construir preview (sin guardar)
  const previewRows = useMemo<FloorRow[]>(() => {
    if (!phId) return [];

    const rows: FloorRow[] = [];

    // Sótanos: S1..Sn (orden negativo)
    for (let i = 1; i <= values.basementsCount; i++) {
      rows.push({
        ph_id: phId,
        label: `S${i}`,
        order_index: -i,
      });
    }

    // PB: order 0
    rows.push({
      ph_id: phId,
      label: values.pbName.trim(),
      order_index: 0,
    });

    // Pisos: 1..N (orden 1..N)
    for (let i = 1; i <= values.floorsCount; i++) {
      rows.push({
        ph_id: phId,
        label: String(i),
        order_index: i,
      });
    }

    // Áreas sociales: AS1..ASn (al final)
    for (let i = 1; i <= values.socialAreasCount; i++) {
      rows.push({
        ph_id: phId,
        label: `AS${i}`,
        order_index: values.floorsCount + i,
      });
    }

    return rows.sort((a, b) => a.order_index - b.order_index);
  }, [
    phId,
    values.pbName,
    values.floorsCount,
    values.basementsCount,
    values.socialAreasCount,
  ]);

  const disabled = isSubmitting || checkingExisting || hasExistingFloors;

  const onSubmit: SubmitHandler<GeneratorValues> = async (data) => {
    if (!phId) {
      alert("No se encontró el PH en la URL (phId).");
      return;
    }

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      window.location.href = "/login";
      return;
    }

    setIsSubmitting(true);

    try {
      // Evitar duplicados
      const { count } = await supabase
        .from("floors")
        .select("id", { count: "exact", head: true })
        .eq("ph_id", phId);

      if ((count ?? 0) > 0) {
        alert(
          "Este PH ya tiene pisos creados. Para evitar duplicados, no se generará de nuevo."
        );
        setHasExistingFloors(true);
        return;
      }

      // ✅ Generar filas (batch insert)
      const rows: FloorRow[] = [];

      for (let i = 1; i <= data.basementsCount; i++) {
        rows.push({ ph_id: phId, label: `S${i}`, order_index: -i });
      }

      rows.push({ ph_id: phId, label: data.pbName.trim(), order_index: 0 });

      for (let i = 1; i <= data.floorsCount; i++) {
        rows.push({ ph_id: phId, label: String(i), order_index: i });
      }

      for (let i = 1; i <= data.socialAreasCount; i++) {
        rows.push({
          ph_id: phId,
          label: `AS${i}`,
          order_index: data.floorsCount + i,
        });
      }

      const { error } = await supabase
      .from("floors")
      .insert(rows);

      if (error) {
        console.error("Error insertando estructura:", error);
        form.setError("pbName", { message: error.message });
        return;
      }

      alert("Estructura creada exitosamente ✅");
      router.push(`/ph/${phId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crear estructura de pisos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Define cantidades. Si es 0, no se crea ese nivel.
        </p>
      </div>

      {hasExistingFloors && (
        <div className="rounded-lg border p-4 text-sm mb-6">
          Este PH ya tiene estructura creada. El generador está bloqueado para
          evitar duplicados.
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`ph/${phId}/apartment`)}
            >
              Volver al PH
            </Button>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* PB Name */}
          <FormField
            control={form.control}
            name="pbName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del primer nivel (PB)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="PB / Planta Baja"
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Floors */}
          <FormField
            control={form.control}
            name="floorsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de pisos</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value || 0))
                    }
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Basements */}
          <FormField
            control={form.control}
            name="basementsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de sótanos</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value || 0))
                    }
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Social areas */}
          <FormField
            control={form.control}
            name="socialAreasCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de áreas sociales</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value || 0))
                    }
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Preview */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="font-medium">Vista previa</div>
            <div className="text-sm text-muted-foreground">
              Se crearán {previewRows.length} niveles:
            </div>
            <div className="flex flex-wrap gap-2">
              {previewRows.map((r) => (
                <span
                  key={`${r.order_index}-${r.label}`}
                  className="text-xs rounded-md border px-2 py-1"
                  title={`order: ${r.order_index}`}
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={disabled} className="flex-1">
              {isSubmitting ? "Creando..." : "Crear estructura"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={disabled}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
