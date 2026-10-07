import { z } from "zod";

// ==========================================
// Shared Helpers & Regex Patterns
// ==========================================

// Standard ISO 3779 17-character VIN pattern (alphanumeric, excluding I, O, Q)
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i;

// Phone number regex (international / North American formats)
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$|^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

// ==========================================
// Enums
// ==========================================

export const VehicleConditionEnum = z.enum(["new", "used", "certified"]);

export const VehicleStatusEnum = z.enum(["available", "sold", "reserved", "pending"]);

export const FuelTypeEnum = z.enum([
  "gasoline",
  "diesel",
  "electric",
  "hybrid",
  "plug_in_hybrid",
  "hydrogen",
]);

export const TransmissionEnum = z.enum([
  "automatic",
  "manual",
  "dual_clutch",
  "cvt",
  "direct_drive",
]);

export const DrivetrainEnum = z.enum(["awd", "fwd", "rwd", "4wd"]);

export const CurrencyEnum = z.enum(["USD", "EUR", "GBP", "CAD", "JPY", "CHF"]);

export const UserRoleEnum = z.enum(["admin", "sales", "viewer"]);

export const LeadTypeEnum = z.enum([
  "test_drive",
  "general_inquiry",
  "purchase_offer",
  "financing",
]);

export const LeadStatusEnum = z.enum([
  "new",
  "contacted",
  "appointment_scheduled",
  "completed",
  "cancelled",
]);

// ==========================================
// Vehicle Specifications Schema (JSONB)
// ==========================================

export const VehicleSpecsFormSchema = z.object({
  engine: z.object({
    type: z.string().min(2, "Engine type is required (e.g. 4.0L Twin-Turbo V8)"),
    displacementLiters: z.coerce.number().positive("Displacement must be positive").optional(),
    cylinders: z.coerce.number().int().positive("Cylinders must be a positive integer").optional(),
    configuration: z.string().optional(),
    forcedInduction: z.enum([
      "Twin-Turbo",
      "Single-Turbo",
      "Supercharged",
      "Naturally Aspirated",
      "None",
    ]).optional(),
  }),
  performance: z.object({
    horsepower: z.coerce.number().int().positive("Horsepower must be greater than 0"),
    torqueFtLbs: z.coerce.number().int().positive("Torque must be greater than 0"),
    zeroToSixtyMph: z.coerce.number().positive("0-60 time must be a positive number").optional(),
    topSpeedMph: z.coerce.number().int().positive("Top speed must be positive").optional(),
  }),
  efficiency: z.object({
    mpgCity: z.coerce.number().min(0, "City MPG cannot be negative").optional(),
    mpgHighway: z.coerce.number().min(0, "Highway MPG cannot be negative").optional(),
    mpgCombined: z.coerce.number().min(0, "Combined MPG cannot be negative").optional(),
    electricRangeMiles: z.coerce.number().min(0, "Electric range cannot be negative").optional(),
    batteryCapacityKWh: z.coerce.number().positive("Battery capacity must be positive").optional(),
  }).optional().default({}),
  dimensions: z.object({
    curbWeightLbs: z.coerce.number().positive().optional(),
    wheelbaseInches: z.coerce.number().positive().optional(),
    lengthInches: z.coerce.number().positive().optional(),
    seatingCapacity: z.coerce.number().int().positive().optional(),
  }).optional(),
});

// ==========================================
// Vehicle Form Schema
// ==========================================

export const BaseVehicleFormSchema = z.object({
  vin: z
    .string()
    .trim()
    .length(17, "VIN must be exactly 17 characters")
    .regex(VIN_REGEX, "Invalid VIN: standard VIN cannot contain letters I, O, or Q")
    .transform((val) => val.toUpperCase()),
  make: z.string().trim().min(2, "Make must have at least 2 characters").max(64),
  model: z.string().trim().min(1, "Model is required").max(64),
  year: z.coerce
    .number()
    .int("Year must be an integer")
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 2, "Year cannot be more than 2 years into the future"),
  trim: z.string().trim().max(64).optional().nullable(),
  mileage: z.coerce
    .number()
    .int("Mileage must be an integer")
    .min(0, "Mileage cannot be negative"),
  price: z.coerce
    .number()
    .positive("Price must be a positive number"),
  currency: CurrencyEnum.default("USD"),
  fuelType: FuelTypeEnum,
  transmission: TransmissionEnum,
  drivetrain: DrivetrainEnum,
  exteriorColor: z.string().trim().min(2, "Exterior color is required").max(64),
  interiorColor: z.string().trim().min(2, "Interior color is required").max(64),
  condition: VehicleConditionEnum,
  status: VehicleStatusEnum.default("available"),
  features: z
    .array(z.string().trim().min(1, "Feature description cannot be empty"))
    .min(1, "At least one feature is required"),
  imageUrls: z
    .array(z.string().trim().url("Must be a valid image URL"))
    .min(1, "At least one vehicle image is required"),
  primaryImageIndex: z.coerce
    .number()
    .int()
    .min(0, "Primary image index cannot be negative")
    .default(0),
  specs: VehicleSpecsFormSchema,
});

export const VehicleFormSchema = BaseVehicleFormSchema.refine(
  (data) => {
    if (data.imageUrls.length === 0) return true;
    return data.primaryImageIndex < data.imageUrls.length;
  },
  {
    message: "Primary image index must point to a valid index in the imageUrls list",
    path: ["primaryImageIndex"],
  }
);

export const CreateVehicleInputSchema = VehicleFormSchema;

export const UpdateVehicleInputSchema = BaseVehicleFormSchema.partial();

// ==========================================
// Lead / Test Drive Form Schema
// ==========================================

export const LeadFormSchema = z.object({
  vehicleId: z.string().uuid("Invalid vehicle ID format").optional().nullable(),
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(64),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(64),
  email: z.string().trim().email("Please provide a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 digits")
    .regex(PHONE_REGEX, "Please provide a valid telephone number"),
  leadType: LeadTypeEnum.default("test_drive"),
  preferredDate: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const selected = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today;
      },
      { message: "Preferred test drive date must be today or in the future" }
    ),
  preferredTimeSlot: z.string().max(64).optional().nullable(),
  hasValidDriverLicense: z.boolean().default(true).refine(
    (val) => val === true,
    { message: "A valid driver's license is required to schedule a test drive" }
  ),
  message: z.string().trim().max(2000).optional().nullable(),
});

export const AdminLeadUpdateSchema = z.object({
  status: LeadStatusEnum.optional(),
  assignedToUserId: z.string().uuid().optional().nullable(),
  internalNotes: z.string().max(4000).optional().nullable(),
});

// ==========================================
// User Form & Auth Schemas
// ==========================================

export const CreateUserFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(128),
  email: z.string().trim().email("Please provide a valid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit"),
  role: UserRoleEnum.default("viewer"),
  isActive: z.boolean().default(true),
  avatarUrl: z.string().url("Must be a valid URL").optional().nullable(),
  phoneNumber: z.string().regex(PHONE_REGEX, "Invalid phone number").optional().nullable(),
});

export const UpdateUserRoleSchema = z.object({
  role: UserRoleEnum,
  isActive: z.boolean().optional(),
});

export const LoginFormSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ==========================================
// Inferred TypeScript Types
// ==========================================

export type VehicleFormData = z.infer<typeof VehicleFormSchema>;
export type CreateVehicleInput = z.infer<typeof CreateVehicleInputSchema>;
export type UpdateVehicleInput = z.infer<typeof UpdateVehicleInputSchema>;
export type VehicleSpecsFormData = z.infer<typeof VehicleSpecsFormSchema>;

export type LeadFormData = z.infer<typeof LeadFormSchema>;
export type AdminLeadUpdateInput = z.infer<typeof AdminLeadUpdateSchema>;

export type CreateUserFormData = z.infer<typeof CreateUserFormSchema>;
export type UpdateUserRoleInput = z.infer<typeof UpdateUserRoleSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
