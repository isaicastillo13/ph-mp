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
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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


          <FormField
            control={from.control}
            name="order_index"
            render={({ field }) => (
              <Select>
                <FormLabel>El Primer piso es planta baja?</FormLabel>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Si</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={from.control}
            name="order_index"
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
            control={from.control}
            name="order_index"
            render={({ field }) => (
              <Select>
                <FormLabel>Tiene Sotano o Piso de Parking?</FormLabel>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Si</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={from.control}
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero de Pisos</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cantidad de Pisos"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={from.control}
            name="order_index"
            render={({ field }) => (
              <Select>
                <FormLabel>Tiene Area Social?</FormLabel>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Si</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <FormField
            control={from.control}
            name="order_index"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero de area Social</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cantidad de Area Social"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={from.control}
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
          <Button type="submit">Crear Piso</Button>
        </form>
      </Form>
    </div>
  );
}
