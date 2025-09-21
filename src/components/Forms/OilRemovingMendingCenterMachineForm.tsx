import React from "react";
interface OilRemovingMendingCenterData {
    [key: string]: unknown;
}
interface OilRemovingMendingCenterProps {
    machinery?: OilRemovingMendingCenterData; // optional because schema is empty
    setMachinery: (machine: OilRemovingMendingCenterData) => void;
    onCancel: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const OilRemovingMendingCenterMachine: React.FC<OilRemovingMendingCenterProps> = ({machinery, setMachinery, onCancel,}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
                Checking Machine Setup
            </h3>
            <p className="text-gray-600">
                The <span className="font-medium">Oil Removing/ Mending Center</span> form is still
                under development. You can skip this step for now and continue with
                other configurations.
            </p>
        </div>
    );
};

export default OilRemovingMendingCenterMachine;
