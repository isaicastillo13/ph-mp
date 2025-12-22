"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { create } from "node:domain";
import { Button } from "@/components/ui/button";
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
  order_index: z.string().min(1, "La dirección es obligatoria"),
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
    }   , []);

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
                    <FormField
                        control={from.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input placeholder="Label del piso" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={from.control}
                        name="order_index"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Order Index</FormLabel>
                                <FormControl>
                                    <Input placeholder="Índice de orden del piso" {...field} />
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