import { z } from "zod";

export const ScheduleTestDriveSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Please provide a valid contact phone number")
    .max(25, "Phone number is too long"),
  preferredDate: z
    .string()
    .min(1, "Please select a preferred date for your private viewing"),
  preferredTime: z
    .string()
    .min(1, "Please select a preferred time slot"),
  message: z
    .string()
    .trim()
    .min(5, "Message must contain at least 5 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
  vehicleId: z.string().optional(),
  vehicleVin: z.string().optional(),
  vehicleTitle: z.string().optional(),
});

export type ScheduleTestDriveInput = z.infer<typeof ScheduleTestDriveSchema>;
