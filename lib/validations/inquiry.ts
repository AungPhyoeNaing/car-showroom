import { z } from "zod";

export const InquirySchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().min(7, "Please provide a valid contact number"),
  carId: z.string().optional(),
  inquiryType: z.enum(["test-drive", "purchase", "bespoke-order", "financing", "general"]).default("test-drive"),
  preferredDate: z.string().optional(),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

export type InquiryInput = z.infer<typeof InquirySchema>;
