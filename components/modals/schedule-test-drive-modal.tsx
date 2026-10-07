"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useTestDriveModal } from "@/lib/modal/test-drive-modal-context";
import { ScheduleTestDriveSchema } from "@/lib/validations/test-drive";
import { scheduleTestDriveAction } from "@/app/actions/schedule-test-drive";

export function ScheduleTestDriveModal() {
  const { isOpen, targetVehicle, closeTestDriveModal } = useTestDriveModal();
  const [isPending, startTransition] = useTransition();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("10:00 AM - Morning VIP Session");
  const [message, setMessage] = useState(
    targetVehicle
      ? `I would like to schedule a private test drive & inspection of the ${targetVehicle.title}.`
      : "I would like to schedule a private showroom consultation."
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      message,
      vehicleId: targetVehicle?.id,
      vehicleVin: targetVehicle?.vin,
      vehicleTitle: targetVehicle?.title,
    };

    // Client-side Zod validation
    const validation = ScheduleTestDriveSchema.safeParse(formData);
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

    // Submit via Server Action
    startTransition(async () => {
      try {
        const result = await scheduleTestDriveAction(validation.data);
        if (result.success && result.confirmationCode) {
          setConfirmationCode(result.confirmationCode);
        } else if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ form: "Could not schedule viewing. Please retry." });
        }
      } catch (err) {
        setErrors({
          form: err instanceof Error ? err.message : "Submission encountered an error.",
        });
      }
    });
  };

  const handleResetAndClose = () => {
    setConfirmationCode(null);
    setErrors({});
    closeTestDriveModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#121214] border border-[rgba(237,232,223,0.15)] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[#09090a] border-b border-[rgba(237,232,223,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] bg-[#121214]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-serif text-[#ede8df] tracking-tight">
                VIP Salon Consultation &amp; Test Drive
              </h2>
              <p className="text-[10px] font-mono text-[#a39e93] uppercase tracking-wider">
                White-glove trackside or salon protocol
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 border border-white/10 hover:border-white/30 text-[#a39e93] hover:text-[#ede8df] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Vehicle Card Preview (if launched for specific vehicle) */}
        {targetVehicle && !confirmationCode && (
          <div className="px-6 py-3 bg-[#09090a]/60 border-b border-[rgba(237,232,223,0.08)] flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              {targetVehicle.image && (
                <div className="relative w-12 h-8 overflow-hidden bg-black border border-[rgba(237,232,223,0.08)] shrink-0">
                  <Image
                    src={targetVehicle.image}
                    alt={targetVehicle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <span className="font-serif font-bold text-[#ede8df] block text-sm">
                  {targetVehicle.title}
                </span>
                {targetVehicle.vin && (
                  <span className="text-[10px] text-[#a39e93]">
                    VIN: ...{targetVehicle.vin.slice(-8)}
                  </span>
                )}
              </div>
            </div>

            {targetVehicle.price && (
              <span className="font-mono font-bold text-[#c5a880]">
                ${targetVehicle.price.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-7">
          {confirmationCode ? (
            /* ==========================================
               SUCCESS CONFIRMATION SCREEN
               ========================================== */
            <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 border border-[#c5a880]/50 flex items-center justify-center text-[#c5a880] mx-auto bg-[#09090a]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#c5a880]">
                  RESERVATION VERIFIED
                </span>
                <h3 className="text-2xl font-serif text-[#ede8df]">
                  Salon Appointment Confirmed
                </h3>
                <p className="text-xs text-[#a39e93] font-light max-w-sm mx-auto leading-relaxed">
                  Our private acquisitions concierge is preparing the chassis. A senior specialist will reach out to confirm logistic details.
                </p>
              </div>

              {/* Code Banner */}
              <div className="p-4 bg-[#09090a] border border-[rgba(237,232,223,0.12)] inline-block w-full max-w-sm font-mono">
                <span className="text-[9px] uppercase tracking-widest text-[#a39e93] block">
                  PASS CODE REFERENCE
                </span>
                <span className="text-xl font-bold text-[#c5a880] tracking-wider mt-1 block select-all">
                  {confirmationCode}
                </span>
                <span className="text-[10px] text-[#a39e93] mt-1 block">
                  {preferredDate} • {preferredTime}
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-[#18181b] hover:bg-[#242220] text-[#ede8df] font-mono text-xs uppercase tracking-wider border border-[rgba(237,232,223,0.1)] transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* ==========================================
               BOOKING FORM
               ========================================== */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              {errors.form && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#a39e93] mb-1">
                    Full Name <span className="text-[#c5a880]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6e695f]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sterling Archer"
                      className="w-full pl-8 pr-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] focus:border-[#c5a880] text-[#ede8df] outline-none transition-colors"
                    />
                  </div>
                  {errors.name && <p className="text-rose-400 text-[10px] mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#a39e93] mb-1">
                    Phone Number <span className="text-[#c5a880]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6e695f]" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-8 pr-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] focus:border-[#c5a880] text-[#ede8df] outline-none transition-colors"
                    />
                  </div>
                  {errors.phone && <p className="text-rose-400 text-[10px] mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#a39e93] mb-1">
                  Email Address <span className="text-[#c5a880]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6e695f]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@luxuryestate.com"
                    className="w-full pl-8 pr-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] focus:border-[#c5a880] text-[#ede8df] outline-none transition-colors"
                  />
                </div>
                {errors.email && <p className="text-rose-400 text-[10px] mt-1">{errors.email}</p>}
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#a39e93] mb-1">
                    Preferred Date <span className="text-[#c5a880]">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6e695f]" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min="2026-01-01"
                      className="w-full pl-8 pr-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] focus:border-[#c5a880] text-[#ede8df] outline-none transition-colors [color-scheme:dark]"
                    />
                  </div>
                  {errors.preferredDate && (
                    <p className="text-rose-400 text-[10px] mt-1">{errors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#a39e93] mb-1">
                    Time Slot
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6e695f]" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] focus:border-[#c5a880] text-[#ede8df] outline-none transition-colors cursor-pointer"
                    >
                      <option value="10:00 AM - Morning VIP Session">10:00 AM - Morning VIP Session</option>
                      <option value="01:30 PM - Afternoon Track Session">01:30 PM - Afternoon Track Session</option>
                      <option value="04:30 PM - Golden Hour Viewing">04:30 PM - Golden Hour Viewing</option>
                      <option value="07:00 PM - Evening Private Gallery">07:00 PM - Evening Private Gallery</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#a39e93] mb-1">
                  Private Curatorial Note <span className="text-[#c5a880]">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6e695f]" />
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about requirements, trade-in considerations, or transport preferences."
                    className="w-full pl-8 pr-3 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] focus:border-[#c5a880] text-[#ede8df] outline-none transition-colors resize-none"
                  />
                </div>
                {errors.message && <p className="text-rose-400 text-[10px] mt-1">{errors.message}</p>}
              </div>

              {/* Showroom Guarantee Notice */}
              <div className="p-3 bg-[#09090a] border border-[rgba(237,232,223,0.08)] flex items-start gap-2 text-[10px] text-[#a39e93]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880] shrink-0 mt-0.5" />
                <span>
                  Discretion assured. Private viewing appointments are conducted one client at a time in our climate-sealed salon.
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-[#a39e93] hover:text-[#ede8df] transition-colors uppercase tracking-wider text-[11px]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#d8bf9a] text-[#09090a] font-mono font-semibold uppercase tracking-[0.2em] text-xs transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#09090a]" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Confirm Reservation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
