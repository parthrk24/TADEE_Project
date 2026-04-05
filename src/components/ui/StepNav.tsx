// src/components/ui/StepNav.tsx
"use client";

import { useTransmission } from "@/context/TransmissionContext";

const STEPS = [
  { id: 1, label: "Conductor" },
  { id: 2, label: "Geometry" },
  { id: 3, label: "System" },
  { id: 4, label: "Model" },
];

interface StepNavProps {
  onCalculate?: () => void;
}

export default function StepNav({ onCalculate }: StepNavProps) {
  const { state, setStep } = useTransmission();
  const { currentStep } = state;

  return (
    <div className="flex flex-col gap-4">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Circle */}
            <button
              onClick={() => setStep(step.id)}
              className={`w-8 h-8 rounded-full text-sm font-semibold 
                          flex items-center justify-center transition
                          ${
                            currentStep === step.id
                              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40"
                              : currentStep > step.id
                                ? "bg-purple-700 text-purple-200"
                                : "bg-white/10 text-purple-300/50"
                          }`}
            >
              {currentStep > step.id ? "✓" : step.id}
            </button>

            {/* Label */}
            <span
              className={`ml-1 text-xs hidden sm:block
                              ${
                                currentStep === step.id
                                  ? "text-purple-300 font-semibold"
                                  : "text-purple-300/40"
                              }`}
            >
              {step.label}
            </span>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full
                              ${
                                currentStep > step.id
                                  ? "bg-purple-500/60"
                                  : "bg-white/10"
                              }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Back / Next / Calculate */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={() => setStep(currentStep - 1)}
          disabled={currentStep === 1}
          className="px-4 py-2 rounded-lg border border-purple-500/30
                     text-purple-200 text-sm font-medium
                     hover:bg-purple-500/10 transition
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>

        {currentStep < 4 ? (
          <button
            onClick={() => setStep(currentStep + 1)}
            className="px-4 py-2 rounded-lg bg-purple-600 text-white 
                       text-sm font-medium hover:bg-purple-500 
                       transition shadow-lg shadow-purple-500/30"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onCalculate}
            className="px-6 py-2 rounded-lg bg-purple-500 text-white 
                       text-sm font-semibold hover:bg-purple-400 transition
                       shadow-lg shadow-purple-500/40"
          >
            Calculate
          </button>
        )}
      </div>
    </div>
  );
}
