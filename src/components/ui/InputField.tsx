// src/components/ui/InputField.tsx
"use client";

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (val: string) => void;
  type?: "number" | "text";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  type = "number",
  unit,
  min,
  max,
  step,
  hint,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-purple-100">
        {label}
        {unit && (
          <span className="ml-1 text-xs text-purple-300/60">({unit})</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-purple-500/30 
                   bg-white/10 text-white px-3 py-2 text-sm
                   placeholder:text-purple-300/50
                   focus:outline-none focus:ring-2 focus:ring-purple-500
                   focus:border-transparent transition"
      />
      {hint && <p className="text-xs text-purple-300/50">{hint}</p>}
    </div>
  );
}
