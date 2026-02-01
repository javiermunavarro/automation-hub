import { createServerSupabaseClient } from "@/lib/supabase/server";
import { automations as mockAutomations } from "@/lib/mock-data";
import { Automation } from "@/lib/types";
import HomeContent from "@/components/HomeContent";

async function getFeatured(): Promise<Automation[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("automations")
      .select("*")
      .eq("is_approved", true)
      .order("install_count", { ascending: false })
      .limit(4);

    if (error || !data || data.length === 0) {
      return mockAutomations.slice(0, 4);
    }
    return data as Automation[];
  } catch {
    return mockAutomations.slice(0, 4);
  }
}

export default async function HomePage() {
  const featured = await getFeatured();

  return <HomeContent featured={featured} />;
}
