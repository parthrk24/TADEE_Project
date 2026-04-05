// src/components/ui/SelectField.tsx
"use client";

interface Option {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  options: Option[];
  hint?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-purple-100">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-purple-500/30
                   bg-white/10 text-white px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-purple-500
                   focus:border-transparent transition
                   [&>option]:bg-gray-900 [&>option]:text-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-purple-300/50">{hint}</p>}
    </div>
  );
}
