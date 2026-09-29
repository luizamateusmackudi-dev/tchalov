import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0?target=deno";
import Stripe from "https://esm.sh/stripe@14.10.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return new Response(JSON.stringify({ error: "session_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // 1. Fetch order from Supabase by checkout_session_id
    const { data: order, error: orderError } = await supabase
      .from("order_headers")
      .select("id, status, payment_id")
      .eq("checkout_session_id", session_id)
      .maybeSingle();

    if (orderError) {
      return new Response(JSON.stringify({ error: "Failed to fetch order" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // 2. If order is already marked paid, no need to check Stripe
    if (order && (order.status === "paid" || order.status === "processing" || order.status === "shipped" || order.status === "delivered")) {
      return new Response(JSON.stringify({
        paid: true,
        order_id: order.id,
        status: order.status,
        source: "supabase",
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // 3. Verify with Stripe directly
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const isPaid = session.payment_status === "paid";

    // 4. If paid and order exists, update Supabase immediately
    if (isPaid && order) {
      const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;

      await supabase
        .from("order_headers")
        .update({
          status: "paid",
          payment_id: paymentIntentId || order.payment_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      return new Response(JSON.stringify({
        paid: true,
        order_id: order.id,
        status: "paid",
        source: "stripe",
      }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // 5. Not paid yet
    return new Response(JSON.stringify({
      paid: false,
      order_id: order?.id || null,
      status: order?.status || "unknown",
      payment_status: session.payment_status,
      source: "stripe",
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
