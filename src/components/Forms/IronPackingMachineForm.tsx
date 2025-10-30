import React, { useState } from "react";

interface IronPackingMachineData {
  noOfTables?: number;
  noOfMachines?: number;
}

interface IronPackingMachineProps {
  machinery?: IronPackingMachineData;
  setMachinery: (machine: IronPackingMachineData) => void;
  onCancel: () => void;
}

const IronPackingMachine: React.FC<IronPackingMachineProps> = ({
  machinery,
  setMachinery,
  onCancel,
}) => {
  const [formData, setFormData] = useState<IronPackingMachineData>(
    machinery || {
      noOfTables: 0,
      noOfMachines: 0,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (formData.noOfTables !== undefined && formData.noOfTables < 0) {
      newErrors.noOfTables = "Number of tables cannot be negative";
    }

    if (formData.noOfMachines !== undefined && formData.noOfMachines < 0) {
      newErrors.noOfMachines = "Number of machines cannot be negative";
    }

    // At least one field should have a value greater than 0
    if (
      (!formData.noOfTables || formData.noOfTables === 0) &&
      (!formData.noOfMachines || formData.noOfMachines === 0)
    ) {
      newErrors.general = "Please enter at least one table or machine";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = <K extends keyof IronPackingMachineData>(
    field: K,
    value: IronPackingMachineData[K]
  ) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field] || errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      setMachinery(formData);
      setFormData({
        noOfTables: 0,
        noOfMachines: 0,
      });
      onCancel();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          Add Iron & Packing Setup
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

      {/* General Error Message */}
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Number of Tables */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Number of Tables
          </label>
          <input
            type="number"
            min="0"
            value={formData.noOfTables || ""}
            onChange={(e) =>
              handleChange(
                "noOfTables",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter number of tables"
          />
          {errors.noOfTables && (
            <p className="text-sm text-red-500">{errors.noOfTables}</p>
          )}
        </div>

        {/* Number of Machines */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Number of Machines
          </label>
          <input
            type="number"
            min="0"
            value={formData.noOfMachines || ""}
            onChange={(e) =>
              handleChange(
                "noOfMachines",
                e.target.value ? Number(e.target.value) : 0
              )
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter number of machines"
          />
          {errors.noOfMachines && (
            <p className="text-sm text-red-500">{errors.noOfMachines}</p>
          )}
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">Note:</span> Enter the number of
          ironing tables and/or packing machines available in your facility.
        </p>
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
          Add Setup
        </button>
      </div>
    </div>
  );
};

export default IronPackingMachine;
