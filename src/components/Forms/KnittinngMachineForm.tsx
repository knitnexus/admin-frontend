import React, {useEffect, useState} from 'react';
import {MultiEnumSelect} from "../Common/MultiEnumSelect"
interface KnittingMachineData {
    diameter: number;
    gauge: number[];
    machineType: string;
    specialFeatures?: string[];
    machineCylinderTrack: number;
    takedownRollerType: string;
    typeOfYarn: string[];
    machineBrand: string;
    noOfMachines: number;
}

interface KnittingMachineProps {
    machinery?: KnittingMachineData;
    setMachinery: (machine: KnittingMachineData) => void;
    onCancel: () => void;
}

const KnittingMachine: React.FC<KnittingMachineProps> = ({
                                                             machinery,
                                                             setMachinery,
                                                             onCancel,
                                                         }) => {
    const [formData, setFormData] = useState<KnittingMachineData>(machinery || {
        diameter: 0,
        gauge: [],
        machineType: '',
        specialFeatures: [],
        machineCylinderTrack: 0,
        takedownRollerType: '',
        typeOfYarn: [],
        machineBrand: '',
        noOfMachines: 1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
const [customBrand, setCustomBrand] = useState("");
const [showCustomBrandInput, setShowCustomBrandInput] = useState(false);

    const diameterOptions = [
        "6", "7", "8", "9", "10", "11", "12", "13", "14", "15",
        "16", "17", "18", "19", "20", "21", "22", "23", "24", "25",
        "26", "27", "28", "29", "30", "32", "34", "36", "38", "40",
        "42", "44"
    ];

    const guageOptions = [
        "5", "7", "9", "12", "14", "16", "18", "20", "24", "28",
        "30", "32", "34", "36", "40", "44", "48", "52", "56", "60"
    ];

    const machineTypes = [
        "Single Jersey",
        "Double Jersey - Rib",
        "Double Jersey - Interlock",
        "3 Thread Fleece",
        "Wrapper",
        "Terry",
        "Seamless",
        "Garment Length",
    ];

    const specialFunctionalities = [
        "Single Feeder",
        "Auto-striper",
        "Full Jacquard",
        "Mini Jacquard",
        "Wrapper",
        "Pointel Mini Jacquard",
        "Pointel Jacquard",
        "Denim Knit",
        "Double Side Terry",
        "Matress",
        "Polar Fleece",
        "Poly Fleece",
        "Quilt Design",
        "Spacer",
        "Sweater",
    ];

    const cylinderTrackOptions = ["1", "2", "3", "4", "5", "6", "7"];
    const takedownRollerTypes = ["Tubular", "open width"];
    const yarnTypes = ["cotton", "viscose/Spun", "polyester/filament"];
    const machineBrands = [
        "Mayer & Cie", "Unitex", "Year China", "Terrot", "Lakshmi Terrot",
        "CMS", "Falmac", "FUKURAHA", "FUKUHAMA", "Buiyuan", "Liski",
        "Pailung", "Santoni", "Smart", "Vilike", "Other",
    ];

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.diameter || formData.diameter === 0) {
            newErrors.diameter = 'Diameter is required';
        }
        if (!formData.gauge || formData.gauge.length === 0) {
            newErrors.guage = 'At least one gauge must be selected';
        }
        if (!formData.machineType) {
            newErrors.machineType = 'Machine type is required';
        }
        if (!formData.machineCylinderTrack || formData.machineCylinderTrack === 0) {
            newErrors.machineCylinderTrack = 'Cylinder track is required';
        }
        if (!formData.takedownRollerType) {
            newErrors.takedownRollerType = 'Takedown roller type is required';
        }
        if (!formData.typeOfYarn) {
            newErrors.typeOfYarn = 'Yarn type is required';
        }
        if (!formData.machineBrand) {
            newErrors.machineBrand = 'Machine brand is required';
        }
        if (!formData.noOfMachines || formData.noOfMachines < 1) {
            newErrors.noOfMachines = 'Number of machines must be at least 1';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
     const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
       const value = e.target.value;

       if (value === "Other") {
         setShowCustomBrandInput(true);
         handleChange("machineBrand", "");
       } else {
         setShowCustomBrandInput(false);
         setCustomBrand("");
         handleChange("machineBrand", value);
       }
     };


    const handleChange =<K extends keyof KnittingMachineData> (field: K, value: KnittingMachineData[K]) => {

        const newData = { ...formData, [field]: value };
        setFormData(newData);

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

    };

   const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     setCustomBrand(value);
     handleChange("machineBrand", value);
   };

   useEffect(() => {
     // Initialize custom brand input if existing machinery has a custom brand
     if (
       machinery?.machineBrand &&
       !machineBrands.includes(machinery.machineBrand)
     ) {
       setShowCustomBrandInput(true);
       setCustomBrand(machinery.machineBrand);
     }
   }, []);
    const handleSubmit = () => {
        if (validate()) {
            setMachinery(formData);
            // reset form for next entry
            setFormData({
                diameter: 0,
                gauge: [],
                machineType: '',
                specialFeatures: [],
                machineCylinderTrack: 0,
                takedownRollerType: '',
                typeOfYarn: [],
                machineBrand: '',
                noOfMachines: 1,
            });
               setCustomBrand("");
               setShowCustomBrandInput(false);
            onCancel();
        }
    };


    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Add Knitting Machine
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
          {/* Diameter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Diameter <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.diameter || ""}
              onChange={(e) => handleChange("diameter", Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select diameter</option>
              {diameterOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.diameter && (
              <p className="text-sm text-red-500">{errors.diameter}</p>
            )}
          </div>

          {/* Machine Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Machine Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.machineType}
              onChange={(e) => handleChange("machineType", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select machine type</option>
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

          {/* Machine Brand */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Machine Brand <span className="text-red-500">*</span>
            </label>
            <select
              value={showCustomBrandInput ? "Other" : formData.machineBrand}
              onChange={handleBrandChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select machine brand</option>
              {machineBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            {errors.machineBrand && (
              <p className="text-sm text-red-500">{errors.machineBrand}</p>
            )}
          </div>

          {/* Custom Brand Input - Shows when "Other" is selected */}
          {showCustomBrandInput && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Enter Custom Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customBrand}
                onChange={handleCustomBrandChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter brand name"
              />
              {errors.machineBrand && (
                <p className="text-sm text-red-500">{errors.machineBrand}</p>
              )}
            </div>
          )}

          {/* Number of Machines */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Number of Machines <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.noOfMachines || ""}
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

          {/* Cylinder Track */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Machine Cylinder Track <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.machineCylinderTrack || ""}
              onChange={(e) =>
                handleChange("machineCylinderTrack", Number(e.target.value))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select cylinder track</option>
              {cylinderTrackOptions.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
            {errors.machineCylinderTrack && (
              <p className="text-sm text-red-500">
                {errors.machineCylinderTrack}
              </p>
            )}
          </div>

          {/* Takedown Roller Type */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Takedown Roller Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.takedownRollerType}
              onChange={(e) =>
                handleChange("takedownRollerType", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Select roller type</option>
              {takedownRollerTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.takedownRollerType && (
              <p className="text-sm text-red-500">
                {errors.takedownRollerType}
              </p>
            )}
          </div>

          {/* Yarn Type */}
          <div className="space-y-2">
            <MultiEnumSelect
              label="Type of Yarns *"
              options={yarnTypes}
              value={formData.typeOfYarn}
              onChange={(newValue) => handleChange("typeOfYarn", newValue)}
            />
            {errors.typeOfYarn && (
              <p className="text-sm   text-red-500">{errors.typeOfYarn}</p>
            )}
          </div>

          <div className={""}>
            <MultiEnumSelect
              label="Special Features"
              options={specialFunctionalities}
              value={formData.specialFeatures ?? []}
              onChange={(newValue) => handleChange("specialFeatures", newValue)}
            />
          </div>
        </div>

        <div className="space-y-2 o">
          <MultiEnumSelect
            label="Gauge *"
            options={guageOptions.map(Number)} // convert to numbers
            value={formData.gauge}
            onChange={(newValue) => handleChange("gauge", newValue)}
          />
          {errors.guage && (
            <p className="text-sm text-red-500">{errors.guage}</p>
          )}
        </div>
        {/* Gauge Selection */}

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

export default KnittingMachine;