export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  vehicleId?: string;
  vehicleVin?: string;
  vehicleTitle?: string;
  confirmationCode: string;
  status: "new" | "contacted" | "appointment_scheduled" | "completed";
  source: "web_test_drive_modal" | "vdp_direct" | "api_lead";
  createdAt: Date;
}

// In-memory persistent lead repository with initial VIP records
const leadsRepository: LeadRecord[] = [
  {
    id: "lead-seed-1",
    name: "Lord Alistair Sterling",
    email: "sterling@mayfair-holdings.co.uk",
    phone: "+44 20 7946 0881",
    preferredDate: "2026-10-14",
    preferredTime: "14:00 PM - Private Session",
    message: "Requesting private viewing at London Mayfair Suite. Looking to add Ferrari Roma to collection before autumn rally.",
    vehicleVin: "ZFF90ALB7P0298101",
    vehicleTitle: "2024 Ferrari Roma",
    confirmationCode: "APX-TD-STR1001",
    status: "new",
    source: "web_test_drive_modal",
    createdAt: new Date("2026-10-06T14:30:00Z"),
  },
  {
    id: "lead-seed-2",
    name: "Baroness Helene von Berg",
    email: "helene@geneva-trust.ch",
    phone: "+41 22 731 4400",
    preferredDate: "2026-10-18",
    preferredTime: "11:30 AM - Morning Briefing",
    message: "Inquiring about Porsche 911 GT3 RS Weissach Package. Seeking transport coordinates to Zurich airport hangar.",
    vehicleVin: "WP0AF2A97RS194821",
    vehicleTitle: "2024 Porsche 911 GT3 RS",
    confirmationCode: "APX-TD-VBG2002",
    status: "contacted",
    source: "vdp_direct",
    createdAt: new Date("2026-10-05T09:15:00Z"),
  },
  {
    id: "lead-seed-3",
    name: "Julian Vance, Esq.",
    email: "jvance@beverlyhills-partners.com",
    phone: "+1 (310) 555-8832",
    preferredDate: "2026-10-22",
    preferredTime: "16:00 PM - Sunset Inspection",
    message: "Aston Martin DBS 770 Ultimate inspection. Arranging private escrow appraisal with client counsel.",
    vehicleVin: "SCFRMFAW7PGL09341",
    vehicleTitle: "2023 Aston Martin DBS 770 Ultimate",
    confirmationCode: "APX-TD-JVE3003",
    status: "appointment_scheduled",
    source: "api_lead",
    createdAt: new Date("2026-10-04T16:45:00Z"),
  },
];

export function saveLead(data: Omit<LeadRecord, "id" | "createdAt" | "status">): LeadRecord {
  const newLead: LeadRecord = {
    ...data,
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    status: "new",
    createdAt: new Date(),
  };

  leadsRepository.unshift(newLead);
  return newLead;
}

export function getAllLeads(): LeadRecord[] {
  return [...leadsRepository];
}

export function getLeadById(id: string): LeadRecord | undefined {
  return leadsRepository.find((l) => l.id === id);
}

export function updateLeadStatus(id: string, status: LeadRecord["status"]): LeadRecord | null {
  const lead = leadsRepository.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  return lead;
}

export function generateConfirmationCode(): string {
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `APX-TD-${randomChars}${timestamp}`;
}
