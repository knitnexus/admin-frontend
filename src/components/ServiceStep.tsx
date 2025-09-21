"use client";

import React, { useState, ChangeEvent } from "react";

type Service = {
    title: string;
    description: string;
};

type Props = {
    form: {
        services: Service[];
    };
    setForm: (updates: Partial<{ services: Service[] }>) => void;
    onBack: () => void;
    onSubmit: () => void;
};

export default function ServiceStep({ form, setForm, onBack, onSubmit }: Props) {
    const [service, setService] = useState<Service>({ title: "", description: "" });
    const [errors, setErrors] = useState<string>("");
    const [showAddForm, setShowAddForm] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setService({ ...service, [name]: value });
        if (errors) setErrors(""); // Clear errors when user starts typing
    };

    const addService = () => {
        if (!service.title?.trim()) {
            setErrors("Service title is required");
            return;
        }
        setForm({ services: [...form.services, service] });
        setService({ title: "", description: "" });
        setErrors("");
        setShowAddForm(false);
    };

    const removeService = (indexToRemove: number) => {
        const updatedServices = form.services.filter((_, index) => index !== indexToRemove);
        setForm({ services: updatedServices });
    };

    const editService = (indexToEdit: number) => {
        const serviceToEdit = form.services[indexToEdit];
        setService(serviceToEdit);
        removeService(indexToEdit);
        setShowAddForm(true);
    };

    const cancelAdd = () => {
        setService({ title: "", description: "" });
        setErrors("");
        setShowAddForm(false);
    };

    return (
        <div className="max-w-4xl p-10 rounded-lg mx-auto bg-white">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Services Offered</h2>
                        <p className="text-sm text-gray-600 mt-1">Add the services your company provides to clients</p>
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        Step 3 / 3
                    </div>
                </div>
            </div>

            {/* Add Service Button */}
            {!showAddForm && (
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Service
                    </button>
                </div>
            )}

            {/* Add Service Form */}
            {showAddForm && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Add New Service</h3>
                        <button
                            type="button"
                            onClick={cancelAdd}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Service Title */}
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Service Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={service.title || ""}
                                onChange={handleChange}
                                placeholder="e.g., Custom Knitting, Yarn Dyeing"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-gray-400 text-xs">(optional)</span>
                            </label>
                            <textarea
                                name="description"
                                value={service.description || ""}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Brief description of the service..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {errors && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errors}
                            </p>
                        </div>
                    )}

                    {/* Add Service Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={cancelAdd}
                            className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={addService}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                        >
                            Add Service
                        </button>
                    </div>
                </div>
            )}

            {/* Services Added Section */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Services Added: <span className="text-blue-600 ml-1">({form.services.length})</span>
                </h3>

                {form.services.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-gray-500 text-lg mb-2">No services added yet</p>
                        <p className="text-gray-400 text-sm">Click  `&quot; Add Service  `&quot; to get started</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {form.services.map((s, idx) => (
                            <div
                                key={idx}
                                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                            <h4 className="font-semibold text-gray-900 text-lg">{s.title}</h4>
                                        </div>
                                        {s.description && (
                                            <p className="text-gray-600 ml-5 leading-relaxed">{s.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                                        <button
                                            type="button"
                                            onClick={() => editService(idx)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit service"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeService(idx)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove service"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={form.services.length === 0}
                    className={`inline-flex items-center px-8 py-3 text-white font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors shadow-sm ${
                        form.services.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    }`}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Application
                </button>
            </div>
        </div>
    );
}