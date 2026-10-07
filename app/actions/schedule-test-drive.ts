"use server";

import { headers } from "next/headers";
import { ScheduleTestDriveSchema, ScheduleTestDriveInput } from "@/lib/validations/test-drive";
import { saveLead, generateConfirmationCode } from "@/lib/data/leads-store";
import { sendLeadNotificationEmail } from "@/lib/email/email-service";
import { triggerCRMWebhook } from "@/lib/crm/crm-webhook";
import { checkRateLimit } from "@/lib/security/rate-limiter";

export interface ScheduleTestDriveActionResult {
  success: boolean;
  message?: string;
  confirmationCode?: string;
  errors?: Record<string, string>;
}

export async function scheduleTestDriveAction(
  input: ScheduleTestDriveInput
): Promise<ScheduleTestDriveActionResult> {
  // 0. Rate limiting enforcement
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
    const rateCheck = checkRateLimit(`action-test-drive-${clientIp}`, 5, 10 * 60 * 1000);
    if (!rateCheck.success) {
      return {
        success: false,
        errors: {
          form: "Rate limit exceeded. Please wait a few minutes before submitting another booking.",
        },
      };
    }
  } catch {
    // Graceful fallback for non-HTTP contexts (e.g. unit tests)
  }

  // 1. Zod Validation
  const validation = ScheduleTestDriveSchema.safeParse(input);
  if (!validation.success) {
    const errors: Record<string, string> = {};
    validation.error.issues.forEach((err) => {
      if (err.path[0]) {
        errors[err.path[0].toString()] = err.message;
      }
    });
    return {
      success: false,
      errors,
    };
  }

  const data = validation.data;
  const confirmationCode = generateConfirmationCode();

  // 2. Persist to Leads Repository
  const lead = saveLead({
    name: data.name,
    email: data.email,
    phone: data.phone,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    message: data.message,
    vehicleId: data.vehicleId,
    vehicleVin: data.vehicleVin,
    vehicleTitle: data.vehicleTitle,
    confirmationCode,
    source: "web_test_drive_modal",
  });

  // 3. Dispatch Notification Email (Resend / SendGrid / Fallback)
  await sendLeadNotificationEmail({ lead });

  // 4. Optionally trigger CRM Webhook
  await triggerCRMWebhook(lead);

  return {
    success: true,
    confirmationCode,
    message: `Your VIP Private Viewing has been reserved. Reference Code: ${confirmationCode}`,
  };
}
