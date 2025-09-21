import React, { useState } from "react";

type AllowedType = string | number;

interface MultiEnumSelectProps<T extends AllowedType> {
    label: string;
    options: T[];
    value: T[];
    onChange: (newValue: T[]) => void;
}

export function MultiEnumSelect<T extends AllowedType>({
                                                           label,
                                                           options,
                                                           value,
                                                           onChange,
                                                       }: MultiEnumSelectProps<T>) {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleAdd = (item: T) => {
        if (!value.includes(item)) {
            onChange([...value, item]);
        }
        setInput("");
        setIsOpen(false);
    };

    const handleRemove = (item: T) => {
        onChange(value.filter((v) => v !== item));
    };

    // Filter based on input, but show all when input is empty
    const filteredOptions = options.filter(
        (opt) =>
            opt.toString().toLowerCase().includes(input.toLowerCase()) &&
            !value.includes(opt)
    );

    return (
        <div className="space-y-2 relative">
            <label className="block text-sm font-semibold text-gray-700">{label}</label>

            {/* Selected chips */}
            <div className="flex flex-wrap gap-2 mb-2">
                {value.map((item) => (
                    <span
                        key={item.toString()}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm"
                    >
            {item}
                        <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="text-red-500 hover:text-red-700"
                        >
              ×
            </button>
          </span>
                ))}
            </div>

            {/* Input */}
            <input
                type="text"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 150)} // delay to allow click
                placeholder="Type or select..."
                className="w-full border px-3 py-2 rounded-lg"
            />

            {/* Dropdown */}
            {isOpen && (
                <ul className="absolute z-10 w-full border rounded-lg mt-1 bg-white shadow max-h-40 overflow-y-auto">
                    {filteredOptions.map((opt) => (
                        <li
                            key={opt.toString()}
                            onClick={() => handleAdd(opt)}
                            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                            {opt}
                        </li>
                    ))}
                    {filteredOptions.length === 0 && (
                        <li className="px-3 py-2 text-gray-400">No matches</li>
                    )}
                </ul>
            )}
        </div>
    );
}
