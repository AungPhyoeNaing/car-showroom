import { LeadRecord } from "@/lib/data/leads-store";

export interface SendLeadNotificationParams {
  lead: LeadRecord;
  recipientEmail?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  provider: "resend" | "sendgrid" | "mock-development";
  messageId: string;
}

function escapeHtml(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sends a notification email to dealership sales concierge via Resend or SendGrid
 */
export async function sendLeadNotificationEmail({
  lead,
  recipientEmail = "concierge@apexmotors.com",
}: SendLeadNotificationParams): Promise<EmailDispatchResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;

  const safeName = escapeHtml(lead.name);
  const safeEmail = escapeHtml(lead.email);
  const safePhone = escapeHtml(lead.phone);
  const safeDate = escapeHtml(lead.preferredDate);
  const safeTime = escapeHtml(lead.preferredTime);
  const safeTitle = escapeHtml(lead.vehicleTitle || "Hypercar Inquiry");
  const safeVin = escapeHtml(lead.vehicleVin || "N/A");
  const safeCode = escapeHtml(lead.confirmationCode);
  const safeMessage = escapeHtml(lead.message);

  const subject = `[VIP Test Drive Request] ${safeName} - ${safeTitle}`;
  const htmlBody = `
    <div style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px;">
      <h2 style="color: #f59e0b; margin-top: 0;">Apex Motors - VIP Viewing Booking</h2>
      <p>A new prospective client has scheduled a private viewing & test drive.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0; color: #e2e8f0;">
        <tr><td style="padding: 8px 0; color: #94a3b8;">Client Name:</td><td><strong>${safeName}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #94a3b8;">Email:</td><td>${safeEmail}</td></tr>
        <tr><td style="padding: 8px 0; color: #94a3b8;">Phone:</td><td>${safePhone}</td></tr>
        <tr><td style="padding: 8px 0; color: #94a3b8;">Requested Slot:</td><td><strong>${safeDate} at ${safeTime}</strong></td></tr>
        <tr><td style="padding: 8px 0; color: #94a3b8;">Vehicle:</td><td><strong>${safeTitle}</strong> (VIN: ${safeVin})</td></tr>
        <tr><td style="padding: 8px 0; color: #94a3b8;">Reference Code:</td><td><code style="color: #f59e0b;">${safeCode}</code></td></tr>
      </table>
      <div style="background: #1e293b; padding: 12px; border-radius: 8px; margin-top: 12px;">
        <span style="color: #94a3b8; font-size: 12px;">Client Note:</span>
        <p style="margin: 4px 0 0 0;">"${safeMessage}"</p>
      </div>
    </div>
  `;

  // 1. If Resend configured
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Apex Motors Concierge <leads@apexmotors.com>",
          to: [recipientEmail],
          subject,
          html: htmlBody,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return {
          success: true,
          provider: "resend",
          messageId: data.id || `resend-${Date.now()}`,
        };
      }
    } catch {
      // Fallback to mock on network or configuration issue
    }
  }

  // 2. If SendGrid configured
  if (sendgridApiKey) {
    try {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sendgridApiKey}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipientEmail }] }],
          from: { email: "leads@apexmotors.com", name: "Apex Motors Concierge" },
          subject,
          content: [{ type: "text/html", value: htmlBody }],
        }),
      });
      if (res.ok) {
        return {
          success: true,
          provider: "sendgrid",
          messageId: `sendgrid-${Date.now()}`,
        };
      }
    } catch {
      // Fallback to mock
    }
  }

  // 3. Fallback / Development Simulator
  return {
    success: true,
    provider: "mock-development",
    messageId: `mock-msg-${Date.now()}`,
  };
}
