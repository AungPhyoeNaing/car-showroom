"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  UploadCloud, 
  Trash2, 
  Star, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from "lucide-react";
import { CreateVehicleInputSchema } from "@/lib/validations/inventory";
import { VehicleCondition, VehicleStatus, FuelType, Transmission, Drivetrain, Currency } from "@/types/inventory";

interface AddVehicleWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_LUXURY_IMAGES = [
  "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
];

export function AddVehicleWizard({ isOpen, onClose, onSuccess }: AddVehicleWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [vin, setVin] = useState("ZFF92WMB8P0394812");
  const [make, setMake] = useState("Ferrari");
  const [model, setModel] = useState("296 GTB");
  const [year, setYear] = useState<number>(2024);
  const [trim, setTrim] = useState("Assetto Fiorano");
  const [condition, setCondition] = useState<VehicleCondition>("certified");
  const [currency, setCurrency] = useState<Currency>("USD");

  // Specs & Powertrain
  const [fuelType, setFuelType] = useState<FuelType>("hybrid");
  const [transmission, setTransmission] = useState<Transmission>("dual_clutch");
  const [drivetrain, setDrivetrain] = useState<Drivetrain>("rwd");
  const [engineType, setEngineType] = useState("3.0L Twin-Turbo V6 Hybrid");
  const [horsepower, setHorsepower] = useState<number>(819);
  const [torque, setTorque] = useState<number>(546);
  const [zeroToSixty, setZeroToSixty] = useState<number>(2.9);
  const [topSpeed, setTopSpeed] = useState<number>(205);
  const [displacement, setDisplacement] = useState<number>(3.0);
  const [cylinders, setCylinders] = useState<number>(6);

  // Aesthetics & Features
  const [exteriorColor, setExteriorColor] = useState("Rosso Imola");
  const [interiorColor, setInteriorColor] = useState("Cuoio Alcantara");
  const [mileage, setMileage] = useState<number>(850);
  const [features, setFeatures] = useState<string[]>([
    "Carbon Ceramic Braking Matrix",
    "Assetto Fiorano Aerodynamics Package",
    "Carbon Fiber Racing Seats",
    "Titanium Exhaust System",
    "Front Suspension Lift",
  ]);
  const [featureInput, setFeatureInput] = useState("");

  // Media & Uploads
  const [imageUrls, setImageUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80",
  ]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
  const [customImageUrl, setCustomImageUrl] = useState("");

  // Valuation & Status
  const [price, setPrice] = useState<number>(379000);
  const [status, setStatus] = useState<VehicleStatus>("available");

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateFileUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateFileUpload(Array.from(e.target.files));
    }
  };

  const simulateFileUpload = (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            const sample = SAMPLE_LUXURY_IMAGES[Math.floor(Math.random() * SAMPLE_LUXURY_IMAGES.length)];
            setImageUrls((prevUrls) => [...prevUrls, sample]);
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures((prev) => [...prev, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    if (customImageUrl.trim()) {
      setImageUrls((prev) => [...prev, customImageUrl.trim()]);
      setCustomImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (primaryImageIndex >= next.length) {
        setPrimaryImageIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!vin || vin.trim().length !== 17) {
        newErrors.vin = "VIN must be exactly 17 characters.";
      }
      if (!make.trim()) newErrors.make = "Marque name is required.";
      if (!model.trim()) newErrors.model = "Model is required.";
      if (!year || year < 1900) newErrors.year = "Valid year is required.";
    }

    if (step === 2) {
      if (!engineType.trim()) newErrors.engineType = "Engine blueprint is required.";
      if (!horsepower || horsepower <= 0) newErrors.horsepower = "Horsepower must be > 0.";
      if (!torque || torque <= 0) newErrors.torque = "Torque must be > 0.";
    }

    if (step === 3) {
      if (!exteriorColor.trim()) newErrors.exteriorColor = "Exterior paint is required.";
      if (!interiorColor.trim()) newErrors.interiorColor = "Interior upholstery is required.";
      if (features.length === 0) newErrors.features = "Add at least one bespoke feature.";
    }

    if (step === 4) {
      if (imageUrls.length === 0) newErrors.images = "At least one vehicle image is required.";
    }

    if (step === 5) {
      if (!price || price <= 0) newErrors.price = "Enter a valid positive valuation.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrors({});

    const payload = {
      vin: vin.trim().toUpperCase(),
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      trim: trim.trim() || undefined,
      mileage: Number(mileage),
      price: Number(price),
      currency,
      fuelType,
      transmission,
      drivetrain,
      exteriorColor: exteriorColor.trim(),
      interiorColor: interiorColor.trim(),
      condition,
      status,
      features,
      imageUrls,
      primaryImageIndex,
      specs: {
        engine: {
          type: engineType.trim(),
          displacement: displacement || undefined,
          cylinders: cylinders || undefined,
        },
        performance: {
          horsepower: Number(horsepower),
          torque: Number(torque),
          zeroToSixty: zeroToSixty || undefined,
          topSpeed: topSpeed || undefined,
        },
      },
    };

    const validation = CreateVehicleInputSchema.safeParse(payload);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register vehicle");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Submission failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: "Identity", subtitle: "VIN & Marque" },
    { number: 2, title: "Powertrain", subtitle: "Engine & Specs" },
    { number: 3, title: "Aesthetics", subtitle: "Colors & Options" },
    { number: 4, title: "Media", subtitle: "S3 Dropzone" },
    { number: 5, title: "Valuation", subtitle: "Pricing & Review" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#09090a]/85 backdrop-blur-md overflow-y-auto selection:bg-[#c5a880] selection:text-[#09090a]">
      <div className="relative w-full max-w-4xl bg-[#121214] border border-[rgba(237,232,223,0.15)] shadow-2xl overflow-hidden my-8 font-mono">
        {/* Header */}
        <div className="px-6 py-5 bg-[#09090a] border-b border-[rgba(237,232,223,0.08)] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a880]">
                Curatorial Accession Protocol
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-[#c5a880]/15 border border-[#c5a880]/30 text-[#c5a880]">
                Step {currentStep} of 5
              </span>
            </div>
            <h2 className="font-serif text-2xl text-[#ede8df] tracking-tight mt-1">
              Commission New Collection Lot
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 bg-[#121214] hover:bg-[#18181b] border border-[rgba(237,232,223,0.12)] text-[#a39e93] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="px-6 py-3 bg-[#09090a]/70 border-b border-[rgba(237,232,223,0.08)]">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((s) => {
              const isDone = currentStep > s.number;
              const isCurrent = currentStep === s.number;
              return (
                <div key={s.number} className="flex flex-col gap-1">
                  <div
                    className={`h-1 transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-500"
                        : isCurrent
                        ? "bg-[#c5a880]"
                        : "bg-white/10"
                    }`}
                  />
                  <div className="hidden sm:flex items-center justify-between text-[10px]">
                    <span
                      className={`uppercase tracking-wider ${
                        isCurrent
                          ? "text-[#c5a880] font-bold"
                          : isDone
                          ? "text-emerald-400"
                          : "text-[#a39e93]/60"
                      }`}
                    >
                      [{s.number}] {s.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          {errors.form && (
            <div className="p-4 bg-rose-950/20 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* STEP 1: IDENTITY & PROVENANCE */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-[rgba(237,232,223,0.08)] pb-3">
                <h3 className="font-serif text-xl text-[#ede8df]">Chassis Identity &amp; Marque Designation</h3>
                <p className="text-xs text-[#a39e93] mt-0.5">
                  Input verified factory chassis VIN, manufacturer provenance, model classification, and condition.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    17-Character Chassis VIN <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder="e.g. ZFF92WMB8P0394812"
                    maxLength={17}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs uppercase transition-colors outline-none"
                  />
                  {errors.vin && <p className="text-rose-400 text-[10px] mt-1">{errors.vin}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Marque / Manufacturer <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Ferrari, Bugatti, Porsche"
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                  {errors.make && <p className="text-rose-400 text-[10px] mt-1">{errors.make}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Model Designation <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. 296 GTB, Chiron, 911 GT3 RS"
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                  {errors.model && <p className="text-rose-400 text-[10px] mt-1">{errors.model}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Production Year <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min={1920}
                    max={2026}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                  {errors.year && <p className="text-rose-400 text-[10px] mt-1">{errors.year}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Trim / Bespoke Edition
                  </label>
                  <input
                    type="text"
                    value={trim}
                    onChange={(e) => setTrim(e.target.value)}
                    placeholder="e.g. Assetto Fiorano, Weissach Package"
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Condition Tier
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as VehicleCondition)}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none cursor-pointer uppercase"
                  >
                    <option value="certified">Concours Certified Provenance</option>
                    <option value="new">Brand New Acquisition</option>
                    <option value="used">Curated Historic / Pre-Owned</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Valuation Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none cursor-pointer uppercase"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: POWERTRAIN & TECHNICAL BLUEPRINT */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-[rgba(237,232,223,0.08)] pb-3">
                <h3 className="font-serif text-xl text-[#ede8df]">Powertrain Architecture &amp; Telemetry</h3>
                <p className="text-xs text-[#a39e93] mt-0.5">
                  Configure engine blueprint, transmission dynamics, verified horsepower, and performance envelope.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Engine Architecture <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="text"
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    placeholder="e.g. 4.0L Twin-Turbo V8 or Tri-Motor EV"
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                  {errors.engineType && <p className="text-rose-400 text-[10px] mt-1">{errors.engineType}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Fuel &amp; Propulsion Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as FuelType)}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none cursor-pointer uppercase"
                  >
                    <option value="gasoline">Gasoline / Naturally Aspirated</option>
                    <option value="hybrid">Hybrid (F1 Kinetic KERS)</option>
                    <option value="plug_in_hybrid">Plug-in Hybrid (PHEV)</option>
                    <option value="electric">Full Electric (EV)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Transmission
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as Transmission)}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none cursor-pointer uppercase"
                  >
                    <option value="dual_clutch">Dual-Clutch F1 Paddle Shift</option>
                    <option value="automatic">Automatic Transmission</option>
                    <option value="manual">Gated Manual Transmission</option>
                    <option value="direct_drive">Direct-Drive EV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Drivetrain
                  </label>
                  <select
                    value={drivetrain}
                    onChange={(e) => setDrivetrain(e.target.value as Drivetrain)}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none cursor-pointer uppercase"
                  >
                    <option value="awd">All-Wheel Drive (AWD)</option>
                    <option value="rwd">Rear-Wheel Drive (RWD)</option>
                    <option value="fwd">Front-Wheel Drive (FWD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Peak Output (HP) <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="number"
                    value={horsepower}
                    onChange={(e) => setHorsepower(Number(e.target.value))}
                    min={50}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                  {errors.horsepower && <p className="text-rose-400 text-[10px] mt-1">{errors.horsepower}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Peak Torque (LB-FT) <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="number"
                    value={torque}
                    onChange={(e) => setTorque(Number(e.target.value))}
                    min={50}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                  {errors.torque && <p className="text-rose-400 text-[10px] mt-1">{errors.torque}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    0–60 MPH Acceleration (sec)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={zeroToSixty}
                    onChange={(e) => setZeroToSixty(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Top Speed (MPH)
                  </label>
                  <input
                    type="number"
                    value={topSpeed}
                    onChange={(e) => setTopSpeed(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AESTHETICS & BESPOKE FEATURES */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-[rgba(237,232,223,0.08)] pb-3">
                <h3 className="font-serif text-xl text-[#ede8df]">Aesthetic Specifications &amp; Appointments</h3>
                <p className="text-xs text-[#a39e93] mt-0.5">
                  Exterior livery, interior upholstery, verified odometer mileage, and bespoke options ledger.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Exterior Paint Livery <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="text"
                    value={exteriorColor}
                    onChange={(e) => setExteriorColor(e.target.value)}
                    placeholder="e.g. Rosso Corsa, Grigio Silverstone"
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                  {errors.exteriorColor && <p className="text-rose-400 text-[10px] mt-1">{errors.exteriorColor}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Interior Upholstery <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="text"
                    value={interiorColor}
                    onChange={(e) => setInteriorColor(e.target.value)}
                    placeholder="e.g. Nero Leather with Contrast Stitching"
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                  {errors.interiorColor && <p className="text-rose-400 text-[10px] mt-1">{errors.interiorColor}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Odometer Mileage (miles) <span className="text-[#c5a880]">*</span>
                  </label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    min={0}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none"
                  />
                </div>
              </div>

              {/* Bespoke Features List */}
              <div className="space-y-3 pt-2">
                <label className="block text-[11px] uppercase tracking-wider text-[#a39e93]">
                  Bespoke Appointments &amp; Equipment <span className="text-[#c5a880]">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                    placeholder="e.g. Carbon Ceramic Brakes, Front Lift System"
                    className="flex-1 px-4 py-2 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-[#121214] hover:bg-[#18181b] border border-[rgba(237,232,223,0.15)] text-[#ede8df] hover:text-[#c5a880] text-xs font-semibold flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4 text-[#c5a880]" />
                    <span>Append</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] text-xs text-[#ede8df]"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-[#a39e93] hover:text-rose-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                {errors.features && <p className="text-rose-400 text-[10px]">{errors.features}</p>}
              </div>
            </div>
          )}

          {/* STEP 4: MEDIA & DRAG-AND-DROP UPLOAD */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-[rgba(237,232,223,0.08)] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl text-[#ede8df]">Curatorial Photography &amp; Assets</h3>
                  <p className="text-xs text-[#a39e93] mt-0.5">
                    Drag and drop photography for museum-grade resolution, or link verified asset URLs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setImageUrls((prev) => [...prev, ...SAMPLE_LUXURY_IMAGES])}
                  className="px-3 py-1.5 bg-[#09090a] border border-[#c5a880]/30 text-[#c5a880] hover:bg-[#c5a880]/10 text-xs font-semibold transition-colors flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preset Imagery</span>
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-[#c5a880] bg-[#c5a880]/10"
                    : "border-[rgba(237,232,223,0.15)] bg-[#09090a] hover:border-[#c5a880]/60"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 border border-[#c5a880]/40 flex items-center justify-center text-[#c5a880] bg-[#121214]">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-[#ede8df]">
                      Drop high-resolution photographs here, or <span className="text-[#c5a880] underline">browse local drive</span>
                    </p>
                    <p className="text-[10px] text-[#a39e93] mt-1">
                      Direct cloud storage pipeline (JPEG, PNG, WebP up to 10MB each)
                    </p>
                  </div>
                </div>

                {isUploading && (
                  <div className="mt-4 max-w-xs mx-auto space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-[#a39e93]">
                      <span>Processing asset ledger...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1 bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#c5a880] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Direct URL Input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Or paste direct image URL (https://...)"
                  className="flex-1 px-4 py-2 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-4 py-2 bg-[#121214] hover:bg-[#18181b] border border-[rgba(237,232,223,0.15)] text-[#ede8df] text-xs uppercase tracking-wider transition-colors"
                >
                  Link URL
                </button>
              </div>

              {/* Uploaded Photos Grid & Primary Selector */}
              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#a39e93]">
                    <span>Configured Gallery ({imageUrls.length} assets)</span>
                    <span className="text-[#c5a880]">★ Star sets primary catalogue lot image</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {imageUrls.map((url, idx) => {
                      const isPrimary = idx === primaryImageIndex;
                      return (
                        <div
                          key={idx}
                          className={`group relative h-28 overflow-hidden border bg-[#09090a] ${
                            isPrimary ? "border-[#c5a880]" : "border-[rgba(237,232,223,0.1)]"
                          }`}
                        >
                          <Image
                            src={url}
                            alt={`Upload ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPrimaryImageIndex(idx)}
                              title="Set as Primary"
                              className={`p-1.5 ${
                                isPrimary
                                  ? "bg-[#c5a880] text-[#09090a]"
                                  : "bg-[#09090a] text-[#c5a880] hover:bg-[#c5a880] hover:text-[#09090a]"
                              } transition-colors`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              title="Remove"
                              className="p-1.5 bg-[#09090a] text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {isPrimary && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#c5a880] text-[#09090a] text-[8px] font-bold uppercase tracking-wider">
                              Primary
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {errors.images && <p className="text-rose-400 text-[10px]">{errors.images}</p>}
            </div>
          )}

          {/* STEP 5: VALUATION, STATUS & CONFIRMATION */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="border-b border-[rgba(237,232,223,0.08)] pb-3">
                <h3 className="font-serif text-xl text-[#ede8df]">Valuation &amp; Final Catalog Dossier</h3>
                <p className="text-xs text-[#a39e93] mt-0.5">
                  Confirm asking acquisition valuation, showroom inventory availability status, and review parameters.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Acquisition Asking Valuation <span className="text-[#c5a880]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c5a880] font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      min={1000}
                      step={5000}
                      className="w-full pl-8 pr-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#c5a880] text-sm font-bold transition-colors outline-none"
                    />
                  </div>
                  {errors.price && <p className="text-rose-400 text-[10px] mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#a39e93] mb-1.5">
                    Lot Availability Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                    className="w-full px-4 py-2.5 bg-[#09090a] border border-[rgba(237,232,223,0.12)] focus:border-[#c5a880] text-[#ede8df] text-xs transition-colors outline-none cursor-pointer uppercase"
                  >
                    <option value="available">Showroom Ready (Available)</option>
                    <option value="reserved">Reserved / Deposit Escrow</option>
                    <option value="pending">Pending Forensic Inspection</option>
                    <option value="sold">De-accessioned / Sold Out</option>
                  </select>
                </div>
              </div>

              {/* Review Card */}
              <div className="p-5 bg-[#09090a] border border-[rgba(237,232,223,0.1)] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#c5a880] uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Curatorial Dossier Summary</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[#a39e93] text-[9px] uppercase tracking-wider block">Motorcar</span>
                    <span className="font-serif text-sm text-[#ede8df]">
                      {year} {make} {model}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#a39e93] text-[9px] uppercase tracking-wider block">VIN</span>
                    <span className="text-[#c5a880] text-[11px]">{vin}</span>
                  </div>
                  <div>
                    <span className="text-[#a39e93] text-[9px] uppercase tracking-wider block">Powertrain</span>
                    <span className="text-[#ede8df]">
                      {horsepower} HP • {drivetrain.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#a39e93] text-[9px] uppercase tracking-wider block">Valuation</span>
                    <span className="font-bold text-[#c5a880]">
                      ${price.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-[#a39e93] border-t border-[rgba(237,232,223,0.06)]">
                  {features.length} bespoke options catalogued • {imageUrls.length} high-res media assets confirmed.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-[#09090a] border-t border-[rgba(237,232,223,0.08)] flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-[#121214] hover:bg-[#18181b] border border-[rgba(237,232,223,0.12)] text-[#ede8df] text-xs transition-colors flex items-center gap-1.5 uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-[#a39e93] hover:text-white text-xs uppercase tracking-wider transition-colors"
            >
              Cancel
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-[#c5a880] hover:bg-[#d4b890] text-[#09090a] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#c5a880] hover:bg-[#d4b890] text-[#09090a] font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#09090a]" />
                    <span>Archiving Lot...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Commission to Catalogue</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
