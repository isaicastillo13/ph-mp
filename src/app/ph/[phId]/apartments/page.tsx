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

type ApartmentRow = {
    ph_id: string;
    flor_id: string;
    code: string;
    order_index: number;
};

const formSchema = z.object({
    code: z.string().min(1, { message: "El código es obligatorio." }),
    flor_id: z.string().min(1, { message: "El ID del piso es obligatorio." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApartmentPage() {}