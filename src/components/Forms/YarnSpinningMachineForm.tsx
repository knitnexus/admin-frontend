import React from 'react';

interface YarnSpinningData {
    [key: string]: unknown;
}

interface YarnSpinningProps {
    machinery?: YarnSpinningData;
    setMachinery: (machine: YarnSpinningData) => void;
    onCancel: () => void;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const YarnSpinningMachine: React.FC<YarnSpinningProps> = ({machinery, setMachinery, onCancel,
                                                         }) => {


    return (

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
                Checking Machine Setup
            </h3>
            <p className="text-gray-600">
                The <span className="font-medium">Yarn Spinning Machine</span> form is still
                under development. You can skip this step for now and continue with
                other configurations.
            </p>
        </div>
    );
};

export default YarnSpinningMachine;