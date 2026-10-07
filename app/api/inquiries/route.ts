import { NextResponse } from "next/server";
import { InquirySchema } from "@/lib/validations/inquiry";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = InquirySchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const inquiry = result.data;
    const inquiryId = `INQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return NextResponse.json(
      {
        success: true,
        message: "Your private viewing request has been received. Our concierge will contact you within 2 hours.",
        inquiryId,
        data: inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process inquiry",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
