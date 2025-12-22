"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Esquema del formulario
const phSchema = z.object({
  firstFloorIsGround: z.enum(["si", "no", "system"]),
  firstFloorName: z.string().min(1, "El nombre es obligatorio"),
  hasBasement: z.enum(["si", "no", "system"]),
  floorsCount: z.number().min(1, "Debe tener al menos 1 piso"),
  hasSocialArea: z.enum(["si", "no", "system"]),
  socialAreaCount: z.number().min(0, "No puede ser negativo"),
  label: z.string().min(1, "El label es obligatorio"),
});

export default function NewFloorPage() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) window.location.href = "/login";
    });
  }, []);

  const form = useForm<z.infer<typeof phSchema>>({
    resolver: zodResolver(phSchema),
    defaultValues: {
      firstFloorIsGround: "si",
      firstFloorName: "",
      hasBasement: "no",
      floorsCount: 1,
      hasSocialArea: "no",
      socialAreaCount: 0,
      label: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof phSchema>) => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      window.location.href = "/login";
      return;
    }
    const { error } = await supabase.from("floors").insert({
      ...data,
      user_id: authData.user.id,
    });
    if (error) {
      form.setError("label", { message: error.message });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="firstFloorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del primer piso</FormLabel>
                <FormControl>
                  <Input placeholder="Planta Baja, etc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="floorsCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sotano o Parking</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Cantidad de Pisos"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="socialAreaCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area Social</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Cantidad de Area Social"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pisos del Ph</FormLabel>
                <FormControl>
                  <Input placeholder="Cantidad de Pisos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Crear</Button>
        </form>
      </Form>
    </div>
  );
}
