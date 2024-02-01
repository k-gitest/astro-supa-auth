import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase";
import { formSchema, validateFormData } from '@/lib/validation';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const validationError = validateFormData({
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  });

  if (!email || !password || validationError) {
    return new Response("emailかpasswordに問題があります", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response("入力内容は無効です", { status: 500 });
  }

  return redirect("/signin");
};