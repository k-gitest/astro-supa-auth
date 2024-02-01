import { defineMiddleware } from "astro:middleware";
import { supabase } from "@/lib/supabase";

const registerPage = '/register(|/)'
const signinPage = '/signin(|/)'
const registerApi = '/api/auth/register'
const signinApi = '/api/auth/signin'
const protectedRoutes = '/dashboard(|/)';

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {

  if (url.pathname.match(signinPage)) {
    locals.path = signinApi

    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (accessToken && refreshToken) {
      return redirect("/dashboard");
    }
  }
  if (url.pathname.match(registerPage)) {
    locals.path = registerApi

    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (accessToken && refreshToken) {
      return redirect("/dashboard");
    }
  }
  if (url.pathname.match(protectedRoutes)) {
    const accessToken = cookies.get("sb-access-token");
    const refreshToken = cookies.get("sb-refresh-token");

    if (!accessToken || !refreshToken) {
      return redirect("/signin");
    }

    const { data, error } = await supabase.auth.setSession({
      refresh_token: refreshToken.value,
      access_token: accessToken.value,
    });

    if (error) {
      cookies.delete("sb-access-token", {
        path: "/",
      });
      cookies.delete("sb-refresh-token", {
        path: "/",
      });

      return redirect("/signin");
    }

    locals.email = data?.user?.email;

  }
  return await next()

});