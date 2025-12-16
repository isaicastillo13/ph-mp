import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mustChangePassword } from "@/services/userFlags";

export async function GET(request: Request) {
  // Variables
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/dashboard";
  const loginPath = "/login";
  const changePasswordPath = "/change-password";

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(new URL(loginPath, url));
  }

  const needsChange = await mustChangePassword(user.id);

  if (needsChange) {
    return NextResponse.redirect(new URL(changePasswordPath, url));
  }

  return NextResponse.redirect(new URL(next, url));
}
