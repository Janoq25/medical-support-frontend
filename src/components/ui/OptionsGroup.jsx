"use client";
import { useEffect, useState } from "react";

export default function OptionsGroup({ options, defaultValue, onSelect, label }) {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? options?.[0]?.value ?? null);

  useEffect(() => {
    if (defaultValue !== undefined) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div className="w-full space-y-2">
      <span className="block text-sm text-clinical-gray-700">{label}</span>
      <div className="w-full flex items-stretch">
        {options.map((option, index, array) => (
          <div key={option.value} className="flex-1">
            <button
              className={`w-full px-4 py-2 text-xs md:text-sm font-medium transition-colors duration-300 focus:outline-none
              ${index === 0 ? "rounded-l-lg" : ""} ${index === array.length - 1 ? "rounded-r-lg" : ""}
              border border-clinical-gray-300 ${index > 0 ? "border-l-0" : ""}
              ${selectedValue === option.value ? "bg-clinical-blue-600 text-white" : "bg-white text-clinical-blue-700 hover:bg-clinical-blue-50"} cursor-pointer`}
              onClick={() => {
                setSelectedValue(option.value);
                onSelect(option.value);
              }}
            >
              {option.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
