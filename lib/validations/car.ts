import { z } from "zod";

export const CarStatusEnum = z.enum(["available", "reserved", "sold"]);

export const CarSchema = z.object({
  id: z.string().min(1, "Vehicle ID is required"),
  make: z.string().min(2, "Make must be at least 2 characters"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1950).max(new Date().getFullYear() + 2),
  price: z.number().positive("Price must be a positive number"),
  mileage: z.number().min(0, "Mileage cannot be negative"),
  transmission: z.enum(["Automatic", "Dual-Clutch", "Manual", "Direct-Drive"]),
  fuelType: z.enum(["Petrol", "Hybrid", "Plug-in Hybrid", "Electric"]),
  engine: z.string().min(1, "Engine details are required"),
  horsepower: z.number().positive("Horsepower must be positive"),
  acceleration: z.string().min(1, "0-60 time is required"),
  topSpeed: z.string().min(1, "Top speed is required"),
  exteriorColor: z.string().min(2, "Exterior color is required"),
  interiorColor: z.string().min(2, "Interior color is required"),
  vin: z.string().length(17, "VIN must be exactly 17 characters"),
  status: CarStatusEnum.default("available"),
  featured: z.boolean().default(false),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string().url("Must be valid URL")).min(1, "At least one image is required"),
  category: z.enum(["Supercar", "Grand Tourer", "Luxury SUV", "Hypercar", "Executive Sedan"]),
});

export const CreateCarSchema = CarSchema.omit({ id: true });
export const UpdateCarSchema = CarSchema.partial().omit({ id: true });

export type Car = z.infer<typeof CarSchema>;
export type CreateCarInput = z.infer<typeof CreateCarSchema>;
export type UpdateCarInput = z.infer<typeof UpdateCarSchema>;
export type CarStatus = z.infer<typeof CarStatusEnum>;
