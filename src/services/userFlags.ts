import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function mustChangePassword(userId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

 
  const { data, error } = await supabase
    .from("profiles")
    .select("must_change_password")
    .eq("id", userId)
    .single();
    
  if (error || !data) return false;
  return data.must_change_password;
}
