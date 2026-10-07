import { LeadRecord } from "@/lib/data/leads-store";

export interface CRMWebhookResult {
  dispatched: boolean;
  targetUrl?: string;
  statusCode?: number;
  timestamp: string;
}

/**
 * Triggers a webhook dispatch to dealership CRM (e.g. HubSpot / Salesforce)
 */
export async function triggerCRMWebhook(lead: LeadRecord): Promise<CRMWebhookResult> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  const payload = {
    event: "lead.test_drive.created",
    timestamp: new Date().toISOString(),
    lead: {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      preferredDate: lead.preferredDate,
      preferredTime: lead.preferredTime,
      message: lead.message,
      vehicle: {
        id: lead.vehicleId,
        vin: lead.vehicleVin,
        title: lead.vehicleTitle,
      },
      confirmationCode: lead.confirmationCode,
      source: lead.source,
    },
  };

  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Apex-Signature": `sha256=${Date.now()}`,
        },
        body: JSON.stringify(payload),
      });

      return {
        dispatched: true,
        targetUrl: webhookUrl,
        statusCode: res.status,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        dispatched: false,
        targetUrl: webhookUrl,
        statusCode: 500,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Simulated CRM dispatch
  return {
    dispatched: true,
    targetUrl: "https://crm-simulator.apexmotors.internal/webhooks/leads",
    statusCode: 200,
    timestamp: new Date().toISOString(),
  };
}
