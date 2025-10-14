// app/dashboard/onboard-company/page.tsx
"use client";

import React, {useEffect, useRef, useState} from "react";
import { Toaster, toast } from "sonner";
import CompanyStep from "../../../components/CompanyStep";
import MachineryStep, {MachineData} from "../../../components/MachineryStep";
import ServiceStep from "../../../components/ServiceStep";

import { useRouter } from "next/navigation";
const   BACKEND_SERVICE_URL=process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL||"";
type Step = "company" | "machinery" | "service";

interface LocationData {

    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    pincode?: string;
    address?: string;
}

export interface FormDataType {
    name: string;
    contactNumber: string;
    gstNumber: string;
    aboutCompany: string;
    workType: string;
    unitType: string;
    unitSqFeet: string;
    certifications: string[];
    companyLogo: File | null;
    unitImages: File[];
    location: LocationData | null;
    machinery: MachineData[] // you can type more strictly later
    services: { title: string; description: string }[];
}
const initialFormData: FormDataType = {
    name: "",
    contactNumber: "",
    gstNumber: "",
    aboutCompany: "",
    workType: "",
    unitType: "",
    unitSqFeet: "",
    certifications: [],
    companyLogo: null,
    unitImages: [],
    location: null,
    machinery: [],
    services: [],
}

export default function OnboardCompanyPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("company");
    const [form, setForm] = useState<FormDataType>(initialFormData);
    const [loading, setLoading] = useState(false);
    const prevUnitTypeRef = useRef<string>("");

    // Effect to reset machinery when unitType changes
    useEffect(() => {
        if (prevUnitTypeRef.current && prevUnitTypeRef.current !== form.unitType && form.machinery.length > 0) {
            // UnitType has changed and there's existing machinery data
            setForm(prev => ({
                ...prev,
                machinery: []
            }));

            // Show a toast notification to inform the user
            toast.info("Unit type changed - machinery data has been reset");
        }

        // Update the previous unitType reference
        prevUnitTypeRef.current = form.unitType;
    }, [form.unitType, form.machinery.length]);
    const nextStep = () => {

        if (step === "company") setStep("machinery");
        else if (step === "machinery") setStep("service");
    };

    const prevStep = () => {
        if (step === "service") setStep("machinery");
        else if (step === "machinery") setStep("company");
    };

    const handleSubmit = async () => {
        // optionally validate final requirement

        if (!form.name || !form.contactNumber || !form.unitType || !form.workType) {
            toast.error("Please fill all required company details");
            setStep("company");
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("name", form.name);
            fd.append("contactNumber", form.contactNumber);
            fd.append("gstNumber", form.gstNumber);
            fd.append("aboutCompany", form.aboutCompany);
            fd.append("workType", form.workType);
            fd.append("unitType", form.unitType);
            fd.append("unitSqFeet", form.unitSqFeet);

            form.certifications.forEach((c) => {
                fd.append("certifications", c);
            });

            if (form.companyLogo) {
                fd.append("companyLogo", form.companyLogo);
            }

            form.unitImages.forEach((file) => {
                fd.append("unitImages", file);
            });

            if (form.location) {
                fd.append("location", JSON.stringify(form.location));
            }

            fd.append("machinery", JSON.stringify(form.machinery));
            fd.append("services", JSON.stringify(form.services));


            const resp = await fetch(`${BACKEND_SERVICE_URL}/companies/onboard`, {
                method: "POST",
                credentials: "include",
                body: fd,
            });

            const data = await resp.json();
            if (resp.ok) {
                toast.success("Company onboarded successfully");
                setStep("company")
                setForm(initialFormData)
                router.refresh()

                // maybe reset or redirect
            } else {
                toast.error(data.message || "Failed to onboard");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Toaster richColors />
            <div className="mb-4">
                <p>Step {step === "company" ? 1 : step === "machinery" ? 2 : 3} / 3</p>
            </div>
            {step === "company" && (
                <CompanyStep
                    form={form}
                    setForm={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
                    onNext={nextStep}
                />
            )}
            {step === "machinery" && (
                <MachineryStep
                    form={form}
                    setForm={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
                    onBack={prevStep}
                    onNext={nextStep}
                />
            )}
            {step === "service" && (
                <ServiceStep
                    form={form}
                    setForm={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
                    onBack={prevStep}
                    onSubmit={handleSubmit}
                />
            )}

            {loading && <p className="mt-4 text-center">Submitting...</p>}
        </div>
    );
}
