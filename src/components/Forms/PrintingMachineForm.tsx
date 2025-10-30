import React, { useState } from "react";

interface PrintingMachineData {
    PrintingMachineType:
        | "Wooden Table"
        | "Manual M/c"
        | "Automatic M/c"
        | "Glass Table"
        | "Rotary M/c"
        | "Sublimation Print"
        | "Heat Transfers"
        | "Emboss Print"
        | "Digital Sticker Print (DTF)"
        | "Digital Print (DTG)"
        | "Burnout";
    PalletSize: string;
    noOfMachines?: number;
}

interface PrintingMachineProps {
    machinery?: PrintingMachineData;
    setMachinery: (machine: PrintingMachineData) => void;
    onCancel: () => void;
}

const PrintingMachine: React.FC<PrintingMachineProps> = ({
                                                             machinery,
                                                             setMachinery,
                                                             onCancel,
                                                         }) => {
    const [formData, setFormData] = useState<PrintingMachineData>(
        machinery || {
            PrintingMachineType: "Wooden Table",
            PalletSize: "",
            noOfMachines:1
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const machineTypes: PrintingMachineData["PrintingMachineType"][] = [
        "Wooden Table",
        "Manual M/c",
        "Automatic M/c",
        "Glass Table",
        "Rotary M/c",
        "Sublimation Print",
        "Heat Transfers",
        "Emboss Print",
        "Digital Sticker Print (DTF)",
        "Digital Print (DTG)",
        "Burnout",
    ];

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.PrintingMachineType)
            newErrors.PrintingMachineType = "Required";
        if (formData.PalletSize.length <=1 )
            newErrors.PalletSize = "Enter Correct Pallet Length and breadth";
         if (!formData.noOfMachines || formData.noOfMachines <= 0) {
           newErrors.noOfMachines = "Number of machines must be greater than 0";
         }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange =<K extends keyof PrintingMachineData> (field: K, value: PrintingMachineData[K]) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = () => {
        if (validate()) {
            setMachinery(formData);
            setFormData({
                PrintingMachineType: "Wooden Table",
                PalletSize: "",
                noOfMachines:1
            });
            onCancel();
        }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Add Printing Machine
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
              value={formData.PrintingMachineType}
              onChange={(e) =>
                handleChange(
                  "PrintingMachineType",
                  e.target.value as PrintingMachineData["PrintingMachineType"]
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
            {errors.PrintingMachineType && (
              <p className="text-sm text-red-500">
                {errors.PrintingMachineType}
              </p>
            )}
          </div>

          {/* Pallet Size */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Pallet Size <span className="text-red-500">*</span>
            </label>
            <input
              placeholder="Length x Breadth (in inches)"
              type="text"
              value={formData.PalletSize}
              onChange={(e) => handleChange("PalletSize", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {errors.PalletSize && (
              <p className="text-sm text-red-500">{errors.PalletSize}</p>
            )}
          </div>
        </div>

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
          {errors.typeOfYarn && (
            <p className="text-sm text-red-500">{errors.typeOfYarn}</p>
          )}
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
            className="px-6 py-3  bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Add Machine
          </button>
        </div>
      </div>
    );
};

export default PrintingMachine;
