"use client";

import React, {useEffect, useState} from "react";

import {MachineryForms} from "@/components/Forms";
export type MachineData = string | number | boolean | MachineData[] | { [key: string]: MachineData };
type Props = {
    form: {
        unitType: string;
        machinery: MachineData[];
    };
    setForm: (updates: Partial<{ machinery: MachineData[] }>) => void;
    onNext: () => void;
    onBack: () => void;
};

// Simple machine preview component
const MachinePreview = ({ machine, index, onDelete }: {
    machine: MachineData;
    index: number;
    onDelete: (index: number) => void;
}) => {
    // Get random subset of fields to display
    const getDisplayFields = () => {
        if (typeof machine === "object" && machine !== null && !Array.isArray(machine)) {
            const entries = Object.entries(machine);
            const displayItems: string[] = [];

            // Take up to 3-4 fields for display
            entries.slice(0, 4).forEach(([key, value]) => {
                // Format the key nicely
                const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/_/g, ' ')
                    .trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');

                // Format the value
                let formattedValue = String(value);
                if (typeof value === 'object' && value !== null) {
                    formattedValue = Array.isArray(value) ? `[${value.length} items]` : '{...}';
                }

                // Add to display items
                if (formattedValue && formattedValue !== 'null' && formattedValue !== 'undefined') {
                    displayItems.push(`${formattedKey}: ${formattedValue}`);
                }
            });

            return displayItems.join(' • ');
        }
        return `Machine ${index + 1}`;
    };

    return (
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                        {getDisplayFields()}
                    </p>
                </div>
            </div>
            <button
                onClick={() => onDelete(index)}
                className="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                title="Remove machine"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export default function MachineryStep({ form, setForm, onNext, onBack }: Props) {
    const [errors, setErrors] = useState<string>("");
    const [machineCardOpen, setMachineCardOpen] = useState(false);

    const onNextClicked = () => {
        setErrors("");
        onNext();
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */

    const handleAddMachine = (machine: any) => {
        setForm({ machinery: [...form.machinery, machine] });
        setMachineCardOpen(false);
    };

    const handleDeleteMachine = (index: number) => {
        const updatedMachinery = form.machinery.filter((_, i) => i !== index);
        setForm({ machinery: updatedMachinery });
    };



    const onCancel = () => setMachineCardOpen(false);

    const MachineForm = MachineryForms[form.unitType];

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">
                Add {form.unitType.replace(/_/g, ' ')} Machines
            </h2>

            <button
                onClick={() => setMachineCardOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Add Machine
            </button>

            {machineCardOpen && MachineForm && (
                <MachineForm onCancel={onCancel} setMachinery={handleAddMachine} />
            )}

            {errors && <p className="text-red-500 text-sm">{errors}</p>}


            {form.machinery.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">Machines Added ({form.machinery.length})</h4>
                    </div>
                    <div className="space-y-2">
                        {form.machinery.map((machine, i) => (
                            <MachinePreview
                                key={i}
                                machine={machine}
                                index={i}
                                onDelete={handleDeleteMachine}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-between pt-6">
                <button
                    onClick={onBack}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                    Back
                </button>
                <button
                    onClick={onNextClicked}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Next
                </button>
            </div>
        </div>
    );
}