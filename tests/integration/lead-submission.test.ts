import { describe, it, expect, beforeEach } from "vitest";
import { ScheduleTestDriveSchema, ScheduleTestDriveInput } from "@/lib/validations/test-drive";
import { scheduleTestDriveAction } from "@/app/actions/schedule-test-drive";
import { getAllLeads } from "@/lib/data/leads-store";
import { checkRateLimit, resetRateLimitStore } from "@/lib/security/rate-limiter";
import { POST as leadsPostHandler, GET as leadsGetHandler } from "@/app/api/leads/route";

describe("Lead Submission & VIP Booking Integration Tests", () => {
  beforeEach(() => {
    resetRateLimitStore();
  });

  describe("ScheduleTestDriveSchema Zod Validation", () => {
    it("should validate valid test drive booking payload", () => {
      const validPayload: ScheduleTestDriveInput = {
        name: "Lady Eleanor Vance",
        email: "eleanor@vance-holdings.co.uk",
        phone: "+44 20 7946 0912",
        preferredDate: "2026-11-15",
        preferredTime: "10:00 AM - Morning VIP Session",
        message: "Requesting private viewing of the Ferrari SF90 XX Stradale.",
        vehicleId: "veh-001",
        vehicleVin: "ZFF90ALB7P0298101",
        vehicleTitle: "2024 Ferrari SF90 XX Stradale",
      };

      const result = ScheduleTestDriveSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject payload with invalid email address", () => {
      const invalidPayload = {
        name: "Arthur Pendelton",
        email: "invalid-email-address",
        phone: "+1 555 123 4567",
        preferredDate: "2026-10-20",
        preferredTime: "02:00 PM",
        message: "Inquiring about Chiron.",
      };

      const result = ScheduleTestDriveSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("email"))).toBe(true);
      }
    });

    it("should reject payload when required fields are missing", () => {
      const emptyPayload = {};
      const result = ScheduleTestDriveSchema.safeParse(emptyPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((i) => i.path[0]);
        expect(paths).toContain("name");
        expect(paths).toContain("email");
        expect(paths).toContain("phone");
        expect(paths).toContain("preferredDate");
        expect(paths).toContain("preferredTime");
        expect(paths).toContain("message");
      }
    });
  });

  describe("Server Action scheduleTestDriveAction", () => {
    it("should execute server action and persist lead record with confirmation code", async () => {
      const payload: ScheduleTestDriveInput = {
        name: "Lord Harrison Sterling",
        email: "h.sterling@mayfaircapital.com",
        phone: "+44 20 7123 4567",
        preferredDate: "2026-12-01",
        preferredTime: "04:30 PM - Golden Hour Viewing",
        message: "Interested in trade-in evaluation alongside test drive.",
        vehicleVin: "ZFF90ALB7P0298101",
        vehicleTitle: "2024 Ferrari SF90 XX Stradale",
      };

      const result = await scheduleTestDriveAction(payload);
      expect(result.success).toBe(true);
      expect(result.confirmationCode).toBeDefined();
      expect(result.confirmationCode).toMatch(/^APX-TD-[A-Z0-9]{4}\d{4}$/);

      // Verify persistence in Leads repository
      const allLeads = getAllLeads();
      const saved = allLeads.find((l) => l.confirmationCode === result.confirmationCode);
      expect(saved).toBeDefined();
      expect(saved?.name).toBe("Lord Harrison Sterling");
      expect(saved?.email).toBe("h.sterling@mayfaircapital.com");
    });
  });

  describe("Rate Limiting Security Verification", () => {
    it("should permit requests up to limit and throttle subsequent attempts", () => {
      const testIp = "192.168.1.100";
      const limit = 3;
      const windowMs = 60000;

      // 1st request
      const r1 = checkRateLimit(testIp, limit, windowMs);
      expect(r1.success).toBe(true);
      expect(r1.remaining).toBe(2);

      // 2nd request
      const r2 = checkRateLimit(testIp, limit, windowMs);
      expect(r2.success).toBe(true);
      expect(r2.remaining).toBe(1);

      // 3rd request
      const r3 = checkRateLimit(testIp, limit, windowMs);
      expect(r3.success).toBe(true);
      expect(r3.remaining).toBe(0);

      // 4th request (exceeds limit)
      const r4 = checkRateLimit(testIp, limit, windowMs);
      expect(r4.success).toBe(false);
      expect(r4.remaining).toBe(0);
      expect(r4.resetMs).toBeGreaterThan(0);
    });
  });

  describe("API Route /api/leads End-to-End Handling", () => {
    it("should return 201 and persist lead on valid POST request", async () => {
      const req = new Request("http://localhost:3000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "10.0.0.1",
        },
        body: JSON.stringify({
          name: "Baron Alexander Cross",
          email: "alexander.cross@atelier.luxury",
          phone: "+1 310 555 9821",
          preferredDate: "2026-11-20",
          preferredTime: "01:30 PM - Afternoon Track Session",
          message: "Requesting track telemetry technician present during test drive.",
          vehicleVin: "WP0AF2A97RS194821",
          vehicleTitle: "2024 Porsche 911 GT3 RS",
        }),
      });

      const response = await leadsPostHandler(req);
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.confirmationCode).toBeDefined();
      expect(data.data.name).toBe("Baron Alexander Cross");
    });

    it("should return 400 when body fails Zod validation", async () => {
      const req = new Request("http://localhost:3000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "10.0.0.2",
        },
        body: JSON.stringify({
          name: "J", // Too short
          email: "not-valid",
        }),
      });

      const response = await leadsPostHandler(req);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.issues).toBeDefined();
    });

    it("should return 429 Too Many Requests when rate limit is exceeded", async () => {
      const ip = "10.0.0.99";

      const createReq = () =>
        new Request("http://localhost:3000/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": ip,
          },
          body: JSON.stringify({
            name: "Spam Bot",
            email: "bot@spam.com",
            phone: "+1 555 000 0000",
            preferredDate: "2026-11-01",
            preferredTime: "10:00 AM",
            message: "Spam message testing limit.",
          }),
        });

      // Submit 5 requests to consume rate limit
      for (let i = 0; i < 5; i++) {
        const res = await leadsPostHandler(createReq());
        expect(res.status).toBe(201);
      }

      // 6th request must be rejected with 429
      const blockedRes = await leadsPostHandler(createReq());
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.headers.get("Retry-After")).toBeDefined();
      const body = await blockedRes.json();
      expect(body.success).toBe(false);
      expect(body.error).toContain("Rate limit exceeded");
    });

    it("should return all leads on GET request", async () => {
      const getRes = await leadsGetHandler();
      expect(getRes.status).toBe(200);
      const data = await getRes.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });
  });
});
