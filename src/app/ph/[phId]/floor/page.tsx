"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { create } from "node:domain";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// esuema del formulario
const phSchema = z.object({
  label: z.string().min(1, "El label es obligatorio"),
  order_index: z.string(),
});

export default function NewFloorPage() {
  // valido que el usuario está autenticado
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = "/login";
        return;
      }
    });
  }, []);

  const from = useForm({
    resolver: zodResolver(phSchema),
  });

  const onSubmit = async (data: z.infer<typeof phSchema>) => {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      window.location.href = "/login";
      return;
    }

    console.log("|-----Creating Floor with data:-----|", authData.user?.id);
    const { data: floor, error } = await supabase.from("floors").insert({
      label: data.label,
      order_index: parseInt(data.order_index, 10),
    });

    if (error) {
      alert("Error al crear el Floor: " + error.message);
      return;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Form {...from}>
        <form onSubmit={from.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-3">
            <Checkbox id="terms" defaultChecked/>
            <FormLabel htmlFor="terms">El primer piso del Ph es PB</FormLabel>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="terms2"/>
            <FormLabel htmlFor="terms">Area Social</FormLabel>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="terms3"/>
            <FormLabel htmlFor="terms">Sotano</FormLabel>
          </div>
          <FormField
            control={from.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pisos del Ph</FormLabel>
                <FormControl>
                  <Input placeholder="Ingrese la cantidad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Crear Piso</Button>
        </form>
      </Form>
    </div>
  );
}
