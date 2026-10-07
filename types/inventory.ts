/**
 * Complete TypeScript Type Definitions for Automotive Inventory System
 */

// ==========================================
// Enums & Literal Unions
// ==========================================

export type VehicleCondition = "new" | "used" | "certified";

export type VehicleStatus = "available" | "sold" | "reserved" | "pending";

export type FuelType = 
  | "gasoline" 
  | "diesel" 
  | "electric" 
  | "hybrid" 
  | "plug_in_hybrid" 
  | "hydrogen";

export type Transmission = 
  | "automatic" 
  | "manual" 
  | "dual_clutch" 
  | "cvt" 
  | "direct_drive";

export type Drivetrain = "awd" | "fwd" | "rwd" | "4wd";

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "JPY" | "CHF";

export type UserRole = "admin" | "sales" | "viewer";

export type LeadType = "test_drive" | "general_inquiry" | "purchase_offer" | "financing";

export type LeadStatus = 
  | "new" 
  | "contacted" 
  | "appointment_scheduled" 
  | "completed" 
  | "cancelled";

// ==========================================
// Vehicle Specifications (JSONB)
// ==========================================

export interface VehicleSpecs {
  engine: {
    type: string;             // e.g. "4.0L Twin-Turbo V8"
    displacementLiters?: number; // e.g. 4.0
    cylinders?: number;       // e.g. 8
    configuration?: string;   // e.g. "V", "Inline", "Boxer", "Electric Motor"
    forcedInduction?: "Twin-Turbo" | "Single-Turbo" | "Supercharged" | "Naturally Aspirated" | "None";
  };
  performance: {
    horsepower: number;       // e.g. 740
    torqueFtLbs: number;      // e.g. 590
    zeroToSixtyMph?: number;  // e.g. 2.7
    topSpeedMph?: number;     // e.g. 206
  };
  efficiency: {
    mpgCity?: number;         // e.g. 15
    mpgHighway?: number;      // e.g. 22
    mpgCombined?: number;     // e.g. 18
    electricRangeMiles?: number; // for EV/PHEV e.g. 320
    batteryCapacityKWh?: number; // e.g. 95.0
  };
  dimensions?: {
    curbWeightLbs?: number;
    wheelbaseInches?: number;
    lengthInches?: number;
    seatingCapacity?: number;
  };
}

// ==========================================
// Vehicle Entity
// ==========================================

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string | null;
  mileage: number;
  price: number;
  currency: Currency;
  fuelType: FuelType;
  transmission: Transmission;
  drivetrain: Drivetrain;
  exteriorColor: string;
  interiorColor: string;
  condition: VehicleCondition;
  status: VehicleStatus;
  features: string[];
  imageUrls: string[];
  primaryImageIndex: number;
  specs: VehicleSpecs;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional when populated)
  leads?: Lead[];
}

// ==========================================
// User Entity (Role-Based Access Control)
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // Excluded from frontend payloads
  role: UserRole;
  isActive: boolean;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  assignedLeads?: Lead[];
}

// Safe User representation for UI/Client
export type SafeUser = Omit<User, "passwordHash">;

// ==========================================
// Lead Entity (Test Drive & Inquiries)
// ==========================================

export interface Lead {
  id: string;
  vehicleId: string | null;
  assignedToUserId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leadType: LeadType;
  status: LeadStatus;
  preferredDate: Date | null;
  preferredTimeSlot: string | null; // e.g. "10:00 AM - 12:00 PM"
  hasValidDriverLicense: boolean;
  message: string | null;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations (optional when populated)
  vehicle?: Vehicle | null;
  assignedTo?: SafeUser | null;
}

// ==========================================
// Filter and Pagination Helpers
// ==========================================

export interface VehicleFilterParams {
  search?: string;
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  condition?: VehicleCondition | "all";
  status?: VehicleStatus | "all";
  fuelType?: FuelType | "all";
  transmission?: Transmission | "all";
  drivetrain?: Drivetrain | "all";
  minHp?: number;
  page?: number;
  pageSize?: number;
  sortBy?: "price" | "year" | "mileage" | "createdAt";
  sortOrder?: "asc" | "desc";
}
