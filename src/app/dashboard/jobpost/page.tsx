// app/dashboard/create-job/page.tsx
"use client";

import React, { ChangeEvent, useState } from "react";
import ImagePreview from "@/components/Dashboard/ImagePreview";
import {availableCertifications,unitTypes} from "@/lib/types/forms";
import {toast} from "sonner";
const   BACKEND_SERVICE_URL=process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL;


interface JobPostingForm {
    unitType: string;
    orderQuantity: string;
    shortDescription: string;
    certifications: string[];
    detailedDescription: string;
    jobImages: File[];
    location: string;
}




export default function CreateJobPage() {
    const [form, setForm] = useState<JobPostingForm>({
        unitType: "",
        orderQuantity: "",
        shortDescription: "",
        certifications: [],
        detailedDescription: "",
        jobImages: [],
        location: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof JobPostingForm, string>>>({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const errs: typeof errors = {};

        if (!form.unitType.trim()) errs.unitType = "Unit Type is required";

        const quantity = Number(form.orderQuantity);
        if (isNaN(quantity) || quantity <= 0) {
            errs.orderQuantity = "Order quantity must be a positive number";
        }

        if (!form.shortDescription.trim()) {
            errs.shortDescription = "Short description is required";
        } else if (form.shortDescription.trim().length < 10) {
            errs.shortDescription = "Short description must be at least 10 characters";
        }

        if (form.detailedDescription && form.detailedDescription.trim().length < 20) {
            errs.detailedDescription = "Detailed description must be at least 20 characters";
        }

        if (!form.location) {
            errs.location = "Location is required";
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!files) return;
        setForm(prev => ({ ...prev, jobImages: Array.from(files) }));
    };

    const handleCertToggle = (cert: string) => {
        const certs = form.certifications ?? [];
        const has = certs.includes(cert);
        const newCerts = has ? certs.filter((c) => c !== cert) : [...certs, cert];
        setForm(prev => ({ ...prev, certifications: newCerts }));
    };



    const handleSubmit = async () => {


        if (!validate()) return;

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("unitType", form.unitType);
            formData.append("orderQuantity", form.orderQuantity);
            formData.append("shortDescription", form.shortDescription);
            formData.append("location", form.location.toLowerCase() );
            if (form.detailedDescription) {
                formData.append("detailedDescription", form.detailedDescription);
            }

            form.certifications.forEach(cert => {
                formData.append("certifications", cert);
            });

            form.jobImages.forEach(file => {
                formData.append("jobImages", file);
            });
            const response = await fetch(`${BACKEND_SERVICE_URL}/jobs/create`, {
                method: "POST",
                credentials: "include",
                body: formData,

            });


            const result = await response.json();

            if (result.success) {
                toast.success('Job posted successfully!', {
                    description: 'Your job posting is now live and visible to suppliers.',
                    duration: 5000,
                });
                // Reset form
                setForm({
                    unitType: "",
                    orderQuantity: "",
                    shortDescription: "",
                    certifications: [],
                    detailedDescription: "",
                    jobImages: [],
                    location: "",
                });
            } else {
                // Show validation errors if present
                if (result.errors) {
                    const errorMessages = Object.entries(result.errors)
                    
                      .map(([field, msgs]: [string, any]) => {
                        const messages = Array.isArray(msgs) ? msgs : [msgs];
                        return `${field}: ${messages.join(", ")}`;
                      })
                      .join(" | ");

                    toast.error('Validation failed', {
                        description: errorMessages,
                        duration: 7000,
                    });
                } else {
                    toast.error('Failed to post job', {
                        description: result.message || 'Please check your inputs and try again.',
                    });
                }
            }
        } catch (error) {
            console.error("Error posting job:", error);
            toast.error('An error occurred', {
                description: 'Unable to post job. Please try again later.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Post a Job</h2>
                    <p className="text-gray-600">Share your manufacturing requirements and connect with suppliers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Unit Type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Unit Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="unitType"
                            value={form.unitType}
                            onChange={handleChange}
                            disabled={submitting}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Select unit type needed</option>
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

                    {/* Order Quantity */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Order Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="orderQuantity"
                            value={form.orderQuantity}
                            onChange={handleChange}
                            placeholder="Enter order quantity"
                            min="1"
                            disabled={submitting}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {errors.orderQuantity && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.orderQuantity}
                            </p>
                        )}
                    </div>
                </div>

                {/* Short Description */}
                <div className="mt-8 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="shortDescription"
                        value={form.shortDescription}
                        onChange={handleChange}
                        placeholder="Brief overview of your job requirement (min 10 characters)..."
                        rows={3}
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                            {form.shortDescription.length} characters (minimum 10 required)
                        </p>
                    </div>
                    {errors.shortDescription && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.shortDescription}
                        </p>
                    )}
                </div>

                {/* Detailed Description */}
                <div className="mt-8 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Detailed Description
                    </label>
                    <textarea
                        name="detailedDescription"
                        value={form.detailedDescription}
                        onChange={handleChange}
                        placeholder="Provide detailed specifications, quality requirements, delivery timelines, and any other relevant information (optional, min 20 characters if provided)..."
                        rows={6}
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {form.detailedDescription && (
                        <p className="text-xs text-gray-500">
                            {form.detailedDescription.length} characters
                        </p>
                    )}
                    {errors.detailedDescription && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.detailedDescription}
                        </p>
                    )}
                </div>

                {/* Certifications */}
                <div className="mt-8 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Required Certifications (Optional)
                    </label>
                    <p className="text-sm text-gray-500">Select certifications you require from the supplier</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {availableCertifications.map((cert) => (
                            <label
                                key={cert}
                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={form.certifications?.includes(cert) ?? false}
                                    onChange={() => handleCertToggle(cert)}
                                    disabled={submitting}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span className="text-sm text-gray-700 font-medium">{cert}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Job Images */}
                <div className="mt-8 space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Job Reference Images (Optional)
                    </label>
                    <p className="text-sm text-gray-500 mb-2">Upload images showing design, samples, or specifications</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                        <input
                            type="file"
                            name="jobImages"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            disabled={submitting}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <p className="mt-2 text-xs text-gray-500">Multiple images, PNG or JPG up to 5MB each</p>
                    </div>
                    {form.jobImages?.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {form.jobImages.map((file, idx) => (
                                <ImagePreview
                                    key={idx}
                                    file={file}
                                    size="w-24 h-24"
                                    onRemove={() => {
                                        const updated = form.jobImages.filter((_, i) => i !== idx);
                                        setForm(prev => ({ ...prev, jobImages: updated }));
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Location */}
                <div className="mt-8 space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Job Location <span className="text-red-500">*</span>
                    </label>

                    <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="Enter a city "
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />

                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-12 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all transform hover:scale-105 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Posting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Post Job
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}