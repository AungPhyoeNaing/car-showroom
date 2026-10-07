import { NextResponse } from "next/server";
import { filterAndSortVehicles } from "@/lib/data/vehicles-service";
import { MOCK_VEHICLES } from "@/lib/data/mock-vehicles";
import { Vehicle } from "@/types/inventory";
import { CreateVehicleInputSchema } from "@/lib/validations/inventory";

// In-memory vehicle store initialized with mock vehicles
const vehicleStore: Vehicle[] = [...MOCK_VEHICLES];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const search = searchParams.get("search") || undefined;
  const makesParam = searchParams.get("makes") || searchParams.get("make") || undefined;
  const fuelType = searchParams.get("fuelType") || undefined;
  const condition = searchParams.get("condition") || undefined;
  const status = searchParams.get("status") || undefined;
  const sortBy = searchParams.get("sortBy") || "featured";
  
  const minYear = searchParams.get("minYear") ? Number(searchParams.get("minYear")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 6;

  const result = filterAndSortVehicles(
    {
      search,
      makes: makesParam,
      fuelType,
      condition,
      status,
      sortBy,
      minYear,
      maxPrice,
      page,
      pageSize,
    },
    vehicleStore
  );

  return NextResponse.json({
    success: true,
    count: result.data.length,
    ...result,
  });
}

// Role authorization helper
function verifyAdminRole(request: Request): boolean {
  const roleHeader = request.headers.get("x-user-role");
  const cookieHeader = request.headers.get("cookie") || "";
  const roleFromCookie = cookieHeader.includes("apex_user_role=sales")
    ? "sales"
    : cookieHeader.includes("apex_user_role=viewer")
    ? "viewer"
    : undefined;

  const role = roleHeader || roleFromCookie;
  if (role && role !== "admin") {
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  if (!verifyAdminRole(request)) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Administrator role required" },
      { status: 403 }
    );
  }
  try {
    const json = await request.json();
    const validationResult = CreateVehicleInputSchema.safeParse(json);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const newVehicle: Vehicle = {
      ...validationResult.data,
      trim: validationResult.data.trim ?? null,
      id: `veh-${Date.now().toString().slice(-4)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vehicleStore.unshift(newVehicle);

    return NextResponse.json(
      {
        success: true,
        message: "Vehicle registered successfully into showroom inventory",
        data: newVehicle,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request payload",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  if (!verifyAdminRole(request)) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Administrator role required" },
      { status: 403 }
    );
  }
  try {
    const json = await request.json();

    // Bulk status update
    if (json.action === "bulk_status" && Array.isArray(json.ids)) {
      const { ids, status } = json;
      let updatedCount = 0;
      for (const id of ids) {
        const found = vehicleStore.find((v) => v.id === id || v.vin === id);
        if (found) {
          found.status = status;
          found.updatedAt = new Date();
          updatedCount++;
        }
      }
      return NextResponse.json({
        success: true,
        message: `Updated status to "${status}" for ${updatedCount} vehicle(s).`,
        updatedCount,
      });
    }

    // Single item update (e.g. inline editing of price and status)
    const { id, vin, price, status } = json;
    const target = vehicleStore.find((v) => (id && v.id === id) || (vin && v.vin === vin));
    if (!target) {
      return NextResponse.json({ success: false, error: "Vehicle not found" }, { status: 404 });
    }

    if (typeof price === "number" && price > 0) {
      target.price = price;
    }
    if (status) {
      target.status = status;
    }
    target.updatedAt = new Date();

    return NextResponse.json({
      success: true,
      message: "Vehicle updated successfully",
      data: target,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update vehicle",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  if (!verifyAdminRole(request)) {
    return NextResponse.json(
      { success: false, error: "Forbidden: Administrator role required" },
      { status: 403 }
    );
  }
  try {
    const json = await request.json();
    const ids: string[] = Array.isArray(json.ids) ? json.ids : json.id ? [json.id] : [];
    if (ids.length === 0) {
      return NextResponse.json({ success: false, error: "No vehicle IDs provided" }, { status: 400 });
    }

    const initialLength = vehicleStore.length;
    for (const id of ids) {
      const idx = vehicleStore.findIndex((v) => v.id === id || v.vin === id);
      if (idx !== -1) {
        vehicleStore.splice(idx, 1);
      }
    }
    const deletedCount = initialLength - vehicleStore.length;

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} vehicle(s) successfully`,
      deletedCount,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete vehicle",
      },
      { status: 500 }
    );
  }
}
