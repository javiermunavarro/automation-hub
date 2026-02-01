import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, let the request through
  // (pages will use mock data or redirect client-side)
  if (
    !supabaseUrl ||
    !supabaseKey ||
    !supabaseUrl.startsWith("http")
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // AUTH GUARD TEMPORARILY DISABLED FOR DESIGN PREVIEW
    // if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    //   const url = request.nextUrl.clone();
    //   url.pathname = "/auth/login";
    //   return NextResponse.redirect(url);
    // }
  } catch {
    // If Supabase fails, let the page handle auth client-side
    return NextResponse.next();
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
