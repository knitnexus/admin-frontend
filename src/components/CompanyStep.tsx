// app/dashboard/onboard-company/components/CompanyStep.tsx
"use client";

import React, { ChangeEvent, useState } from "react";
import ImagePreview from "@/components/Dashboard/ImagePreview";

type LocationData = {
    latitude: number;
    longitude: number;
};

interface FormProps {
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
}

type Props = {
    form: FormProps;
    setForm: (updates: Partial<FormProps>) => void;
    onNext: () => void;
};

const availableCertifications = [
    "Import Export Certificate",
    "ISO 9001",
    "GOTS",
    "Fair Trade",
    "OEKO-TEX",
    "SA8000",
    "RCS",
    "BCI Cotton",
    "Sedex",
    "OCS",
    "GRS",
];

const workTypes = ["DOMESTIC_WORK", "EXPORT_WORK"];
const unitTypes = [
    "YARN_SPINNING",
    "YARN_PROCESSING",
    "WEAVING_UNIT",
    "KNITTING_UNIT",
    "DYEING_UNIT",
    "FABRIC_PROCESSING_UNIT",
    "FABRIC_FINISHING_UNIT",
    "WASHING_UNIT",
    "CUTTING_UNIT",
    "COMPUTERIZED_EMBROIDERY_UNIT",
    "MANUAL_EMBROIDERY_UNIT",
    "FUSING_UNIT",
    "PRINTING_UNIT",
    "STITCHING_UNIT",
    "CHECKING_UNIT",
    "IRONING_PACKING_UNIT",
    "KAJA_BUTTON_UNIT",
    "MULTI_NEEDLE_DOUBLE_CHAIN_UNIT",
    "OIL_REMOVING_MENDING_CENTER",
    "PATTERN_MAKING_CENTER",
    "FILM_SCREEN_MAKING_CENTER",
];

export default function CompanyStep({ form, setForm, onNext }: Props) {
    const [errors, setErrors] = useState<Partial<Record<keyof FormProps, string>>>({});

    const validate = () => {

        const errs: typeof errors = {};
        if (!form.name.trim()) errs.name = "Company name is required";
        if (!form.contactNumber.trim()) errs.contactNumber = "Contact number required";
        if (!form.unitType.trim()) errs.unitType = "Unit Type required";
        if (!form.workType.trim()) errs.workType = "Work Type required";
        const sq = Number(form.unitSqFeet);
        if (isNaN(sq) || sq <= 0) errs.unitSqFeet = "Unit sq feet must be positive";

        if (!form.location) errs.location = "Location is required";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm({
            [name]: value,
        } as Partial<FormProps>);

        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files) return;
        if (name === "companyLogo") {
            setForm({ companyLogo: files[0] });
        } else if (name === "unitImages") {
            setForm({ unitImages: Array.from(files) });
        }
    };

    function handleCertToggle(cert: string) {
        // Ensure form.certifications exists and is array
        const certs = form.certifications ?? [];
        const has = certs.includes(cert);

        const newCerts = has
            ? certs.filter((c) => c !== cert)
            : [...certs, cert];

        // Pass the object directly to setForm, not a function
        setForm({ certifications: newCerts });
    }
    const handlePickLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm({ location: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } });
                setErrors((prev) => ({ ...prev, location: undefined }));
            },
            (err) => {
                console.error("Location error", err);
                alert("Could not fetch location");
            }
        );
    };

    const onNextClicked = () => {
        if (validate()) {
            onNext();
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Company Information</h2>
                <p className="text-gray-600">Tell us about your company and manufacturing capabilities</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your company name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        name="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        placeholder="Enter contact number"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {errors.contactNumber && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.contactNumber}
                        </p>
                    )}
                </div>

                {/* GST Number */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">GST Number</label>
                    <input
                        name="gstNumber"
                        value={form.gstNumber}
                        onChange={handleChange}
                        placeholder="Enter GST number (optional)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Unit Sq Feet */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Unit Area (Sq Feet) <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="unitSqFeet"
                        type="number"
                        min="1"
                        value={form.unitSqFeet}
                        onChange={handleChange}
                        placeholder="Enter unit area in square feet"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {errors.unitSqFeet && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.unitSqFeet}
                        </p>
                    )}
                </div>

                {/* Unit Type */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Unit Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="unitType"
                        value={form.unitType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                        <option value="">Select your unit type</option>
                        {unitTypes.map((u) => (
                            <option key={u} value={u}>
                                {u.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                    {errors.unitType && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.unitType}
                        </p>
                    )}
                </div>

                {/* Work Type */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Work Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="workType"
                        value={form.workType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                        <option value="">Select work type</option>
                        {workTypes.map((w) => (
                            <option key={w} value={w}>
                                {w.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                    {errors.workType && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.workType}
                        </p>
                    )}
                </div>
            </div>

            {/* About Company - Full Width */}
            <div className="mt-8 space-y-2">
                <label className="block text-sm font-semibold text-gray-700">About Company</label>
                <textarea
                    name="aboutCompany"
                    value={form.aboutCompany}
                    onChange={handleChange}
                    placeholder="Tell us about your company, manufacturing capabilities, and experience..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                />
            </div>

            {/* Certifications */}
            {form.workType=="EXPORT_WORK"&&
            <div className="mt-8 space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                    Certifications & Standards
                </label>
                <p className="text-sm text-gray-500">Select all certifications your company holds</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {availableCertifications.map((cert) => (
                        <label key={cert} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={form.certifications?.includes(cert) ?? false}
                                onChange={() => handleCertToggle(cert)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 font-medium">{cert}</span>
                        </label>
                    ))}
                </div>
            </div>
            }
            {/* File Uploads */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Company Logo */}

                <div className="space-y-2">


                    {/*Handling image upload*/}
                    <label className="block text-sm font-semibold text-gray-700">Company Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                        <input
                            type="file"
                            name="companyLogo"

                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="mt-2 text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                    {form.companyLogo && (
                        <div className="mt-4">
                            <ImagePreview
                                size="w-24 h-24"
                                file={form.companyLogo}
                                onRemove={() => setForm({ ...form, companyLogo: null })}
                            />
                        </div>
                    )}
                </div>

                {/* Unit Images */}
                <div className="space-y-2">
                    {/*preview images */}

                    {/*handliing image upload */}
                    <label className="block text-sm font-semibold text-gray-700">Unit Images</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                        <input
                            type="file"
                            name="unitImages"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="mt-2 text-xs text-gray-500">Multiple images, PNG or JPG up to 5MB </p>
                    </div>
                    {form.unitImages?.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            {form.unitImages.map((file, idx) => (
                                <ImagePreview
                                    key={idx}
                                    file={file}
                                    size="w-24 h-24"
                                    onRemove={() => {
                                        const updated = form.unitImages.filter((_, i) => i !== idx);
                                        setForm({ ...form, unitImages: updated });
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>

            {/* Location */}
            <div className="mt-8 space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                    Location <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        onClick={handlePickLocation}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Pick Current Location
                    </button>
                    {form.location && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-green-700 font-medium">
                            Location: {form.location.latitude.toFixed(6)}, {form.location.longitude.toFixed(6)}
                        </span>
                        </div>
                    )}
                </div>
                {errors.location && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.location}
                    </p>
                )}
            </div>

            {/* Next Button */}
            <div className="flex justify-end mt-12 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onNextClicked}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                    Continue to Next Step
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
