import React from "react";

// Define a loose shape for the props instead of using `any`
interface CheckingMachineData {
    // Add real fields later when the form is developed
    [key: string]: unknown;
}

interface CheckingMachineProps {
    machinery?: CheckingMachineData;
    setMachinery: (machine: CheckingMachineData) => void;
    onCancel: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CheckingMachine: React.FC<CheckingMachineProps> = ({machinery, setMachinery, onCancel}) => {
    return (

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
                Checking Machine Setup
            </h3>
            <p className="text-gray-600">
                The <span className="font-medium">Checking Machine</span> form is still
                under development. You can skip this step for now and continue with
                other configurations.
            </p>
        </div>
    );
};

export default CheckingMachine;
