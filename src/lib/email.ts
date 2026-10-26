// Server-only: sends a notification email via Resend whenever a new enquiry
// comes in. Silently skips (with a console warning) if RESEND_API_KEY or a
// recipient address isn't configured yet, so the enquiry itself never fails
// because email isn't set up.
type EnquiryEmailInput = {
  full_name: string;
  email: string;
  service: string;
  budget: string;
  timeline: string;
  description: string;
  whatsapp?: string | null;
  business_name?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(enquiry: EnquiryEmailInput): string {
  const rows: Array<[string, string | null | undefined]> = [
    ["Name", enquiry.full_name],
    ["Business", enquiry.business_name],
    ["Email", enquiry.email],
    ["WhatsApp", enquiry.whatsapp],
    ["Service", enquiry.service],
    ["Budget", enquiry.budget],
    ["Timeline", enquiry.timeline],
  ];

  const rowsHtml = rows
    .filter(([, value]) => !!value)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;font-weight:600;white-space:nowrap;vertical-align:top;width:120px;">${label}</td>
          <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;vertical-align:top;">${escapeHtml(String(value))}</td>
        </tr>`,
    )
    .join("");

  const descriptionHtml = escapeHtml(enquiry.description).replace(/\n/g, "<br>");

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="background-color:#111827;padding:20px 24px;">
                <span style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:0.2px;">Novyra Digital</span>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 24px 8px 24px;">
                <h1 style="margin:0 0 4px 0;font-size:18px;color:#111827;">New enquiry received</h1>
                <p style="margin:0;font-size:14px;color:#6b7280;">${escapeHtml(enquiry.service)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 8px 0 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  ${rowsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px 4px 24px;">
                <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#6b7280;">Message</p>
                <p style="margin:0;font-size:14px;line-height:1.6;color:#111827;white-space:pre-wrap;">${descriptionHtml}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <a href="mailto:${encodeURIComponent(enquiry.email)}" style="display:inline-block;background-color:#111827;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:8px;">Reply to ${escapeHtml(enquiry.full_name)}</a>
              </td>
            </tr>
          </table>
          <p style="max-width:560px;margin:16px auto 0 auto;font-size:12px;color:#9ca3af;">This enquiry also saved to your admin dashboard and Firestore.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildText(enquiry: EnquiryEmailInput): string {
  const lines = [
    `New enquiry: ${enquiry.full_name}`,
    "",
    `Name: ${enquiry.full_name}`,
    enquiry.business_name ? `Business: ${enquiry.business_name}` : null,
    `Email: ${enquiry.email}`,
    enquiry.whatsapp ? `WhatsApp: ${enquiry.whatsapp}` : null,
    `Service: ${enquiry.service}`,
    `Budget: ${enquiry.budget}`,
    `Timeline: ${enquiry.timeline}`,
    "",
    "Message:",
    enquiry.description,
  ].filter((l): l is string => l !== null);
  return lines.join("\n");
}

export async function sendEnquiryEmail(to: string | null | undefined, enquiry: EnquiryEmailInput) {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — skipping enquiry email notification.");
    return;
  }
  if (!to) {
    console.warn(
      "No contact_email configured in site_settings — skipping enquiry email notification.",
    );
    return;
  }
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const from = process.env["RESEND_FROM_EMAIL"] || "Novyra Digital <onboarding@resend.dev>";
    await resend.emails.send({
      from,
      to,
      replyTo: enquiry.email,
      subject: `New enquiry: ${enquiry.full_name} (${enquiry.service})`,
      text: buildText(enquiry),
      html: buildHtml(enquiry),
    });
  } catch (err) {
    console.error("Resend enquiry email failed", err);
  }
}
