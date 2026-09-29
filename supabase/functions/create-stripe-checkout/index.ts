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
    const { items, currency = "USD", successUrl, cancelUrl } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Items array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const productIds = items.map((item: { product_id: string | number }) => String(item.product_id));
    const quantities = items.map((item: { quantity: number }) => Math.max(1, Math.round(item.quantity || 1)));

    const { data: products, error: productsError } = await supabase
      .from("product_items")
      .select("id, name, price, status")
      .in("id", productIds)
      .eq("status", "active");

    if (productsError) {
      return new Response(JSON.stringify({ error: "Failed to verify products" }), {
        status: 500,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ error: "No valid products found" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    const line_items = productIds.map((pid: string, idx: number) => {
      const product = products.find((p) => String(p.id) === pid);
      if (!product) {
        throw new Error(`Product ${pid} not found or inactive`);
      }
      return {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: product.name,
            description: "Telechargement numerique — MP3 + WAV",
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: quantities[idx],
      };
    });

    const baseSuccessUrl = successUrl || (Deno.env.get("SITE_URL") + "/checkout/success");
    const baseCancelUrl = cancelUrl || (Deno.env.get("SITE_URL") + "/checkout/cancel");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: baseSuccessUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: baseCancelUrl,
      automatic_tax: { enabled: false },
      billing_address_collection: "required",
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
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