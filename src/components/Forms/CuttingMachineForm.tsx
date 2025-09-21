import React, { useState } from "react";

interface CuttingMachineData {
    machineType: "Hand Cutting" | "Straight Knife" | "Band Knife" | "Automatic Cutting";
    noOfMachines: number;
}

interface CuttingMachineProps {
    machinery?: CuttingMachineData;
    setMachinery: (machine: CuttingMachineData) => void;
    onCancel: () => void;
}

const CuttingMachineForm: React.FC<CuttingMachineProps> = ({
                                                               machinery,
                                                               setMachinery,
                                                               onCancel,
                                                           }) => {
    const [formData, setFormData] = useState<CuttingMachineData>(
        machinery || {
            machineType: "Hand Cutting",
            noOfMachines: 1,
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});
    const machineTypes = ["Hand Cutting", "Straight Knife", "Band Knife","Automatic Cutting"];

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.machineType) newErrors.machineType = "Required";
        if (!formData.noOfMachines || formData.noOfMachines <= 0) {
            newErrors.noOfMachines = "Machines must be positive";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange =<K extends keyof CuttingMachineData> (field: K, value: CuttingMachineData[K]) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = () => {
        if (validate()) {
            setMachinery(formData);
            setFormData({
                machineType: "Hand Cutting",
                noOfMachines: 1,
            });
            onCancel();
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                    Add Cutting Machine
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    title="Cancel"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Machine Type */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Machine Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={formData.machineType}
                        onChange={(e) =>
                            handleChange(
                                "machineType",
                                e.target.value as CuttingMachineData["machineType"]
                            )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        {machineTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    {errors.machineType && (
                        <p className="text-sm text-red-500">{errors.machineType}</p>
                    )}
                </div>

                {/* Number of Machines */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Number of Machines <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={formData.noOfMachines}
                        onChange={(e) =>
                            handleChange("noOfMachines", Number(e.target.value))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {errors.noOfMachines && (
                        <p className="text-sm text-red-500">{errors.noOfMachines}</p>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                    Add Machine
                </button>
            </div>
        </div>
    );
};

export default CuttingMachineForm;
