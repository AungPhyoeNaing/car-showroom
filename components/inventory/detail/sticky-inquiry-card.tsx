"use client";

import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { Vehicle } from "@/types/inventory";
import { InquirySchema, InquiryInput } from "@/lib/validations/inquiry";

interface StickyInquiryCardProps {
  vehicle: Vehicle;
}

export function StickyInquiryCard({ vehicle }: StickyInquiryCardProps) {
  const [formData, setFormData] = useState<InquiryInput>({
    fullName: "",
    email: "",
    phone: "",
    carId: vehicle.id,
    inquiryType: "test-drive",
    preferredDate: "",
    message: `Inquiring on ${vehicle.year} ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin}).`,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  // Approximate luxury finance estimate (60 months, 20% down, 5.9% APR)
  const downPayment = vehicle.price * 0.2;
  const loanAmount = vehicle.price - downPayment;
  const monthlyRate = 0.059 / 12;
  const estimatedMonthly = Math.round(
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, 60))) /
      (Math.pow(1 + monthlyRate, 60) - 1)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setConfirmationCode(null);

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

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Submission failed");
      }

      setConfirmationCode(resData.inquiryId || "APX-CONFIRMED");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        carId: vehicle.id,
        inquiryType: "test-drive",
        preferredDate: "",
        message: "",
      });
    } catch (err: unknown) {
      setErrors({ form: err instanceof Error ? err.message : "Error submitting request" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#121214] border border-[rgba(237,232,223,0.1)] p-6 shadow-2xl space-y-6">
      {/* Price Header */}
      <div className="space-y-2 border-b border-[rgba(237,232,223,0.08)] pb-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#a39e93]">
            Acquisition Valuation
          </span>
          <span className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border ${
            vehicle.status === "available"
              ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/20"
              : "border-[#c5a880]/30 text-[#c5a880] bg-[#c5a880]/10"
          }`}>
            {vehicle.status}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl sm:text-4xl font-mono font-bold text-[#c5a880]">
            ${vehicle.price.toLocaleString()}
          </div>
          <span className="text-xs text-[#a39e93] font-mono uppercase">{vehicle.currency}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#a39e93] pt-1 font-mono">
          <span className="flex items-center gap-1 text-[11px]">
            <DollarSign className="w-3 h-3 text-[#c5a880]" />
            <span>Estimated Lease/Loan:</span>
          </span>
          <span className="text-[#ede8df] font-semibold text-[11px]">
            ${estimatedMonthly.toLocaleString()}/mo*
          </span>
        </div>
      </div>

      {/* Dealer Direct Contact Section */}
      <div className="space-y-3 py-1 text-xs text-[#a39e93]">
        <h4 className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880]">
          Private Client Concierge
        </h4>

        <div className="space-y-2 font-mono text-[11px]">
          <a
            href="tel:+18005552739"
            className="flex items-center gap-2.5 p-2.5 bg-[#09090a] hover:bg-[#18181b] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/30 transition-colors group"
          >
            <div className="w-6 h-6 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Phone className="w-3 h-3" />
            </div>
            <div>
              <p className="font-semibold text-[#ede8df]">+1 (800) 555-APEX</p>
              <p className="text-[9px] text-[#a39e93]">Direct Salon Desk</p>
            </div>
          </a>

          <a
            href="mailto:curator@apexmotors.com"
            className="flex items-center gap-2.5 p-2.5 bg-[#09090a] hover:bg-[#18181b] border border-[rgba(237,232,223,0.08)] hover:border-[#c5a880]/30 transition-colors group"
          >
            <div className="w-6 h-6 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Mail className="w-3 h-3" />
            </div>
            <div>
              <p className="font-semibold text-[#ede8df]">curator@apexmotors.com</p>
              <p className="text-[9px] text-[#a39e93]">Confidential Dispatch</p>
            </div>
          </a>

          <div className="flex items-center gap-2 p-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.06)] text-[#a39e93]">
            <MapPin className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
            <p className="text-[10px]">Beverly Hills Flagship Atelier &bull; Vault Suite</p>
          </div>
        </div>
      </div>

      <hr className="border-[rgba(237,232,223,0.08)]" />

      {/* Embedded Test Drive & Private Viewing Form */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-serif text-[#ede8df] flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Schedule Private Viewing</span>
          </h4>
          <p className="text-[11px] text-[#a39e93] font-light mt-0.5">
            Arranged at our salon or delivered via enclosed vault transport to your private estate.
          </p>
        </div>

        {confirmationCode ? (
          <div className="p-4 bg-[#09090a] border border-[#c5a880]/40 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#c5a880] mx-auto" />
            <p className="text-xs font-serif font-bold text-[#ede8df]">Private Appointment Requested</p>
            <p className="text-[10px] text-[#a39e93] font-mono">
              Ref: <span className="text-[#c5a880] font-bold">{confirmationCode}</span>
            </p>
            <p className="text-[10px] text-[#a39e93]">Our private acquisitions advisor will contact you within 2 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
            {errors.form && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <div>
              <input
                type="text"
                placeholder="Full Legal Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-[#ede8df] placeholder-[#6e695f] focus:outline-none focus:border-[#c5a880] transition-colors text-xs"
              />
              {errors.fullName && <p className="text-rose-400 text-[10px] mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <input
                type="email"
                placeholder="Direct Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-[#ede8df] placeholder-[#6e695f] focus:outline-none focus:border-[#c5a880] transition-colors text-xs"
              />
              {errors.email && <p className="text-rose-400 text-[10px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Direct Telephone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-[#ede8df] placeholder-[#6e695f] focus:outline-none focus:border-[#c5a880] transition-colors text-xs"
              />
              {errors.phone && <p className="text-rose-400 text-[10px] mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-[#ede8df] focus:outline-none focus:border-[#c5a880] transition-colors text-xs"
              />
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.08)] text-[10px] text-[#a39e93]">
                <Clock className="w-3 h-3 text-[#c5a880]" />
                <span>10:00 AM Session</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-mono font-semibold text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-50"
            >
              {submitting ? "Transmitting Reservation..." : "Request Salon Viewing"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
