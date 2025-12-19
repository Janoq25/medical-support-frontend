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
      <span className="block text-sm font-bold text-sage-700 ml-1">{label}</span>
      <div className="w-full flex items-stretch p-1 bg-sage-50 rounded-full border border-sage-200">
        {options.map((option, index) => (
          <div key={option.value} className="flex-1">
            <button
              className={`w-full px-4 py-2 text-xs md:text-sm font-medium transition-all duration-300 focus:outline-none rounded-full
              ${selectedValue === option.value
                  ? "bg-sage-600 text-white shadow-md transform scale-105"
                  : "text-sage-600 hover:text-sage-800 hover:bg-sage-100/50"} cursor-pointer`}
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