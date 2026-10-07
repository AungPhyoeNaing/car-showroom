"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MapPin,
  Lock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { InquirySchema, InquiryInput } from "@/lib/validations/inquiry";
import { EditorialBadge } from "@/components/ui/editorial-badge";

function ContactContent() {
  const searchParams = useSearchParams();
  const carIdParam = searchParams.get("carId") || "";
  const salonParam = searchParams.get("salon") || "";

  const [formData, setFormData] = useState<InquiryInput>({
    fullName: "",
    email: "",
    phone: "",
    carId: carIdParam,
    inquiryType: "test-drive",
    preferredDate: "",
    message: salonParam ? `Inquiring for private consultation at the ${salonParam} Salon.` : "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmittedSuccess(null);

    // Client-side Zod Validation
    const validation = InquirySchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmittedSuccess(data.message || "Viewing scheduled successfully.");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        carId: "",
        inquiryType: "test-drive",
        preferredDate: "",
        message: "",
      });
    } catch (err: unknown) {
      setErrors({ form: err instanceof Error ? err.message : "An unexpected error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090a] text-[#ede8df] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 selection:bg-[#c5a880] selection:text-[#09090a]">
      {/* Editorial Header */}
      <div className="max-w-4xl space-y-6">
        <EditorialBadge variant="brass">
          PRIVATE CLIENT SERVICES • DOSSIER DE LIAISON
        </EditorialBadge>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal tracking-tight text-[#ede8df] leading-tight">
          Initiate confidential <span className="italic text-[#c5a880]">consultation</span> or private viewing.
        </h1>
        <p className="font-serif text-lg text-[#a39e93] leading-relaxed max-w-2xl">
          Direct liaison with the acquisitions desk. Consultations may be arranged at our 
          Beverly Hills, Mayfair, or Monaco salons, or conducted on-site at your private residence or hangar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-[#121214] border border-[rgba(237,232,223,0.12)] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-[rgba(237,232,223,0.08)] pb-4 font-mono text-xs text-[#a39e93]">
            <span className="text-[#c5a880] uppercase tracking-wider">[ ENQUIRY DISPATCH ]</span>
            <span>SECURE 256-BIT ENCRYPTION</span>
          </div>

          {submittedSuccess ? (
            <div className="p-8 text-center space-y-4 bg-[#09090a] border border-[#c5a880]/40">
              <CheckCircle2 className="w-12 h-12 text-[#c5a880] mx-auto" />
              <h3 className="font-serif text-2xl text-[#ede8df]">Dossier Received</h3>
              <p className="text-xs text-[#a39e93] max-w-md mx-auto leading-relaxed">
                {submittedSuccess}. A dedicated acquisitions principal will contact you 
                via your preferred channel within two business hours.
              </p>
              <button
                onClick={() => setSubmittedSuccess(null)}
                className="mt-4 px-6 py-2.5 bg-[#121214] hover:bg-[#18181b] border border-[rgba(237,232,223,0.15)] text-[#c5a880] font-mono text-xs uppercase tracking-wider transition-colors"
              >
                Dispatch Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.form && (
                <div className="p-4 bg-rose-950/20 border border-rose-800/40 text-xs text-rose-300 flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errors.form}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#a39e93] mb-2">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Lord Sterling"
                    className="w-full px-4 py-3 bg-[#09090a] border border-[rgba(237,232,223,0.12)] text-sm text-[#ede8df] placeholder-[#a39e93]/50 focus:outline-none focus:border-[#c5a880] transition-colors font-mono"
                  />
                  {errors.fullName && <p className="font-mono text-[10px] text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#a39e93] mb-2">
                    Confidential Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@sanctuary.com"
                    className="w-full px-4 py-3 bg-[#09090a] border border-[rgba(237,232,223,0.12)] text-sm text-[#ede8df] placeholder-[#a39e93]/50 focus:outline-none focus:border-[#c5a880] transition-colors font-mono"
                  />
                  {errors.email && <p className="font-mono text-[10px] text-rose-400 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#a39e93] mb-2">
                    Direct Phone / Signal *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-4 py-3 bg-[#09090a] border border-[rgba(237,232,223,0.12)] text-sm text-[#ede8df] placeholder-[#a39e93]/50 focus:outline-none focus:border-[#c5a880] transition-colors font-mono"
                  />
                  {errors.phone && <p className="font-mono text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#a39e93] mb-2">
                    Nature of Inquiry
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value as InquiryInput["inquiryType"] })}
                    className="w-full px-4 py-3 bg-[#09090a] border border-[rgba(237,232,223,0.12)] text-xs text-[#ede8df] focus:outline-none focus:border-[#c5a880] transition-colors font-mono uppercase"
                  >
                    <option value="test-drive">Private Dynamometer &amp; Test Drive</option>
                    <option value="purchase">Acquisition &amp; Escrow Settlement</option>
                    <option value="bespoke-order">Off-Market Sourcing Commission</option>
                    <option value="financing">Private Client Structured Financing</option>
                    <option value="general">Portfolio Consignment / Valuation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#a39e93] mb-2">
                    Lot or Marque of Interest
                  </label>
                  <input
                    type="text"
                    value={formData.carId || ""}
                    onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
                    placeholder="e.g. LOT 01 / Ferrari Roma"
                    className="w-full px-4 py-3 bg-[#09090a] border border-[rgba(237,232,223,0.12)] text-sm text-[#ede8df] placeholder-[#a39e93]/50 focus:outline-none focus:border-[#c5a880] transition-colors font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#a39e93] mb-2">
                    Preferred Date of Appointment
                  </label>
                  <input
                    type="date"
                    min="2026-01-01"
                    value={formData.preferredDate || ""}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 bg-[#09090a] border border-[rgba(237,232,223,0.12)] text-xs text-[#ede8df] focus:outline-none focus:border-[#c5a880] transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase tracking-wider text-[#a39e93] mb-2">
                  Confidential Brief &amp; Special Protocols *
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Detail your requirements, security clearance protocols, air transit needs, or portfolio considerations..."
                  className="w-full px-4 py-3 bg-[#09090a] border border-[rgba(237,232,223,0.12)] text-sm text-[#ede8df] placeholder-[#a39e93]/50 focus:outline-none focus:border-[#c5a880] transition-colors font-mono"
                />
                {errors.message && <p className="font-mono text-[10px] text-rose-400 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#c5a880] hover:bg-[#d4b890] text-[#09090a] font-mono text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? "TRANSMITTING ENCRYPTED DOSSIER..." : "TRANSMIT CONFIDENTIAL INQUIRY"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Right Information & Protocol Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* VIP Concierge Desk */}
          <div className="p-8 bg-[#121214] border border-[rgba(237,232,223,0.12)] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] bg-[#09090a]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#ede8df]">Concierge Direct Desk</h3>
                <p className="font-mono text-[10px] text-[#c5a880] uppercase tracking-wider">
                  24/7 Accredited Liaison
                </p>
              </div>
            </div>

            <p className="text-xs text-[#a39e93] leading-relaxed">
              For immediate off-market transactions or private hangar delivery coordinates, 
              contact our principal desk directly.
            </p>

            <div className="space-y-3 pt-4 border-t border-[rgba(237,232,223,0.08)] font-mono text-xs">
              <div className="flex items-center gap-3 text-[#ede8df]">
                <Phone className="w-4 h-4 text-[#c5a880] shrink-0" />
                <span>+1 (800) 555-APEX (USA)</span>
              </div>
              <div className="flex items-center gap-3 text-[#ede8df]">
                <Phone className="w-4 h-4 text-[#c5a880] shrink-0" />
                <span>+44 20 7946 0912 (UK / EMEA)</span>
              </div>
              <div className="flex items-center gap-3 text-[#ede8df]">
                <Mail className="w-4 h-4 text-[#c5a880] shrink-0" />
                <span>concierge@lecurie-concours.com</span>
              </div>
              <div className="flex items-center gap-3 text-[#ede8df]">
                <Clock className="w-4 h-4 text-[#c5a880] shrink-0" />
                <span>Average Response: &lt; 45 Minutes</span>
              </div>
            </div>
          </div>

          {/* Strict Non-Disclosure & Security Protocol */}
          <div className="p-6 bg-[#121214] border border-[rgba(237,232,223,0.12)] space-y-3">
            <div className="flex items-center gap-2 text-[#c5a880] font-mono text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Privileged Non-Disclosure Guarantee</span>
            </div>
            <p className="text-xs text-[#a39e93] leading-relaxed">
              L&apos;Écurie Concours operates under bilateral non-disclosure protocols before any vehicle 
              inspection or financial transaction. We never disclose client identities, storage locations, 
              or settlement sums to auction syndicates or media publications.
            </p>
          </div>

          {/* Quick link to catalogue */}
          <div className="p-6 bg-[#09090a] border border-[rgba(237,232,223,0.08)] flex items-center justify-between font-mono text-xs">
            <span className="text-[#a39e93]">Review current exhibition lots:</span>
            <Link
              href="/inventory"
              className="text-[#c5a880] hover:text-[#ede8df] inline-flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Exhibition</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#09090a] flex items-center justify-center text-[#c5a880] font-mono text-xs">
          INITIALIZING CONCIERGE TERMINAL...
        </div>
      }
    >
      <ContactContent />
    </Suspense>
  );
}
