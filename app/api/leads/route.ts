import { NextResponse } from "next/server";
import { ScheduleTestDriveSchema } from "@/lib/validations/test-drive";
import { saveLead, getAllLeads, generateConfirmationCode, updateLeadStatus } from "@/lib/data/leads-store";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { sendLeadNotificationEmail } from "@/lib/email/email-service";
import { triggerCRMWebhook } from "@/lib/crm/crm-webhook";

export async function GET() {
  const leads = getAllLeads();
  return NextResponse.json({
    success: true,
    count: leads.length,
    data: leads,
  });
}

export async function POST(request: Request) {
  // 1. IP / Client Rate Limiting (5 requests per 10 minutes)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  const rateCheck = checkRateLimit(`lead-submit-${clientIp}`, 5, 10 * 60 * 1000);
  if (!rateCheck.success) {
    const retrySec = Math.ceil(rateCheck.resetMs / 1000);
    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded. Please wait before scheduling another viewing.",
        retryAfterSeconds: retrySec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retrySec.toString(),
          "X-RateLimit-Limit": rateCheck.limit.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // 2. Validate Request Body
  try {
    const json = await request.json();
    const validation = ScheduleTestDriveSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const confirmationCode = generateConfirmationCode();

    // 3. Persist Lead in Database Store
    const newLead = saveLead({
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
      source: "api_lead",
    });

    // 4. Send Notification Email via Resend / SendGrid
    await sendLeadNotificationEmail({ lead: newLead });

    // 5. Trigger CRM Webhook
    await triggerCRMWebhook(newLead);

    return NextResponse.json(
      {
        success: true,
        message: "VIP Test drive request accepted and logged.",
        confirmationCode,
        data: newLead,
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Limit": rateCheck.limit.toString(),
          "X-RateLimit-Remaining": rateCheck.remaining.toString(),
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: "Malformed request payload",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing lead id or status" },
        { status: 400 }
      );
    }

    const updated = updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Lead status updated to ${status}`,
      data: updated,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update lead",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

