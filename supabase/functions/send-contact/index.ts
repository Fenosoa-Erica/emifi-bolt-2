import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { name, phone, email, subject, message } = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured.");
    }

    const contact = email || phone || "Non fourni";
    const htmlBody = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #0369a1, #0ea5e9); padding: 28px 32px; border-radius: 12px; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Nouveau message – EMIFI</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px;">Via le formulaire de contact du site officiel</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 120px;">Nom</td>
              <td style="padding: 12px 0; color: #0f172a; font-size: 14px;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">Contact</td>
              <td style="padding: 12px 0; color: #0f172a; font-size: 14px;">${contact}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 12px 0; color: #64748b; font-size: 13px; font-weight: 600;">Objet</td>
              <td style="padding: 12px 0; color: #0f172a; font-size: 14px; font-weight: 600;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px;">
            <p style="color: #64748b; font-size: 13px; font-weight: 600; margin-bottom: 8px;">Message</p>
            <div style="background: #f8fafc; border-radius: 8px; padding: 16px; color: #334155; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${message}</div>
          </div>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">EMIFI – Emit Mikalo Fiderana · EMIT, Université de Fianarantsoa</p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "EMIFI Contact <onboarding@resend.dev>",
        to: ["emitmikalo@gmail.com"],
        reply_to: email || undefined,
        subject: `[EMIFI] ${subject}`,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Resend error: ${response.status}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
