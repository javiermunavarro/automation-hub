"use server";

import { createServerSupabaseClient } from "./server";
import { redirect } from "next/navigation";

export async function signIn(formData: { email: string; password: string }) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });
  if (error) {
    return { error: error.message };
  }
  redirect("/dashboard/buyer");
}

export async function signUp(formData: {
  email: string;
  password: string;
  fullName: string;
  role: string;
}) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        role: formData.role,
      },
    },
  });
  if (error) {
    return { error: error.message };
  }
  redirect("/auth/login?registered=true");
}

export async function signOut() {
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getSession() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
