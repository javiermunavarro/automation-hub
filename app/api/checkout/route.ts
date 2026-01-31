import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { automationId, priceMonthly, setupFee, title } = body;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseConfigured =
      supabaseUrl && supabaseKey && supabaseUrl.startsWith("http");

    // Get current user from Supabase
    const cookieStore = cookies();
    const supabase = supabaseConfigured
      ? createServerClient(supabaseUrl, supabaseKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Route handler — ignore
            }
          },
        },
      }
    )
      : null;

    let user = null;
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    const lineItems: Array<{
      price_data: {
        currency: string;
        product_data: { name: string; description?: string };
        unit_amount: number;
        recurring?: { interval: "month" };
      };
      quantity: number;
    }> = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: title,
            description: `Monthly subscription for ${title}`,
          },
          unit_amount: Math.round(priceMonthly * 100),
          recurring: { interval: "month" },
        },
        quantity: 1,
      },
    ];

    if (setupFee > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${title} - Setup Fee`,
            description: "One-time setup and onboarding fee",
          },
          unit_amount: Math.round(setupFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${request.nextUrl.origin}/dashboard/buyer?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/marketplace/${automationId}`,
      metadata: {
        automationId,
        buyerId: user?.id || "",
      },
      customer_email: user?.email || undefined,
    });

    // Record the subscription in Supabase (pending until webhook confirms)
    if (user && supabase) {
      await supabase.from("subscriptions").insert({
        automation_id: automationId,
        buyer_id: user.id,
        status: "active",
        stripe_subscription_id: session.id,
        monthly_price: priceMonthly,
      });

      // Increment install_count
      const { data: current } = await supabase
        .from("automations")
        .select("install_count")
        .eq("id", automationId)
        .single();
      if (current) {
        await supabase
          .from("automations")
          .update({ install_count: Number(current.install_count) + 1 })
          .eq("id", automationId);
      }
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
