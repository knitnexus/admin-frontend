import React, { useState } from "react";
import { MultiEnumSelect } from "../Common/MultiEnumSelect";
interface DyeingMachineData {
  DyeingMachineType:
    | "Jigger"
    | "Soft FLow"
    | "Jet"
    | "Winch"
    | "Beam"
    | "Air Flow"
    | "Pad Stream";
  minimumCapacity?: number;
  maximumCapacity?: number;
  typeOfFabric: string[];
  Maker?: string;
  noOfMachines: number;
}

interface Props {
    machinery?: DyeingMachineData;
    setMachinery: (machine: DyeingMachineData) => void;
    onCancel: () => void;
}

const machineTypes: DyeingMachineData["DyeingMachineType"][] = [
    "Jigger",
    "Soft FLow",
    "Jet",
    "Winch",
    "Beam",
    "Air Flow",
    "Pad Stream",
];

const fabricTypes = ["Tubular", "open width"];

const DyeingMachineForm: React.FC<Props> = ({ machinery, setMachinery, onCancel }) => {
    const [formData, setFormData] = useState<DyeingMachineData>(
        machinery || {
            DyeingMachineType: "Jigger",
            typeOfFabric: [],
            noOfMachines: 1,
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange =<K extends keyof DyeingMachineData> (field: K, value: DyeingMachineData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.DyeingMachineType) newErrors.DyeingMachineType = "Machine type is required";
        if (!formData.noOfMachines || formData.noOfMachines < 1)
            newErrors.noOfMachines = "At least 1 machine required";
        if (formData.DyeingMachineType !== "Jigger" && !formData.typeOfFabric)
            newErrors.typeOfFabric = "Fabric type is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            setMachinery(formData);
            setFormData({
                DyeingMachineType: "Jigger",

  minimumCapacity: 0,
  maximumCapacity: 0,
  typeOfFabric: [],
  Maker: "",
  noOfMachines: 1
            })
            onCancel();
        }
    };

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Add Dyeing Machine
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
              value={formData.DyeingMachineType}
              onChange={(e) =>
                handleChange(
                  "DyeingMachineType",
                  e.target.value as DyeingMachineData["DyeingMachineType"]
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
            {errors.DyeingMachineType && (
              <p className="text-sm text-red-500">{errors.DyeingMachineType}</p>
            )}
          </div>

          {/* Maker */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Maker
            </label>
            <input
              type="text"
              value={formData.Maker || ""}
              onChange={(e) => handleChange("Maker", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter machine maker"
            />
          </div>

          {/* Min Capacity */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Minimum Capacity
            </label>
            <input
              min={0}
              type="number"
              value={formData.minimumCapacity ?? ""}
              onChange={(e) =>
                handleChange(
                  "minimumCapacity",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter min capacity"
            />
          </div>

          {/* Max Capacity */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Maximum Capacity
            </label>
            <input
              type="number"
              value={formData.maximumCapacity ?? ""}
              onChange={(e) =>
                handleChange(
                  "maximumCapacity",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter max capacity"
            />
          </div>

          {/* Fabric type (required if not Jigger) */}

          <div className="space-y-2">
            <MultiEnumSelect
              label="Type of Fabrice*"
              options={fabricTypes}
              value={formData.typeOfFabric}
              onChange={(newValue) => handleChange("typeOfFabric", newValue)}
            />
            {errors.typeOfYarn && (
              <p className="text-sm   text-red-500">{errors.typeOfYarn}</p>
            )}
          </div>

          {/* No of Machines */}
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
              placeholder="Enter number of machines"
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

export default DyeingMachineForm;
