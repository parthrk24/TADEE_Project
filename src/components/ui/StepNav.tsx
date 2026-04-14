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

function validateStep(
  step: number,
  inputs: ReturnType<typeof useTransmission>["state"]["inputs"],
): string | null {
  switch (step) {
    case 1:
      if (inputs.numStrands < 1) return "Number of strands must be at least 1.";
      if (inputs.strandDiameter <= 0)
        return "Strand diameter must be greater than 0.";
      if (inputs.subConductorResistance <= 0)
        return "Resistance must be greater than 0.";
      if (inputs.bundleSpacing <= 0)
        return "Bundle spacing must be greater than 0.";
      return null;
    case 2:
      if (inputs.spacingAB <= 0) return "Spacing D_AB must be greater than 0.";
      if (inputs.spacingType === "unsymmetrical") {
        if (inputs.spacingBC <= 0)
          return "Spacing D_BC must be greater than 0.";
        if (inputs.spacingCA <= 0)
          return "Spacing D_CA must be greater than 0.";
      }
      return null;
    case 3:
      if (inputs.lineLength <= 0) return "Line length must be greater than 0.";
      if (inputs.receivingEndLoad <= 0)
        return "Receiving end load must be greater than 0.";
      if (inputs.powerFactor <= 0 || inputs.powerFactor > 1)
        return "Power factor must be between 0 and 1.";
      if (inputs.nominalVoltage <= 0)
        return "Nominal voltage must be greater than 0.";
      if (inputs.frequency <= 0) return "Frequency must be greater than 0.";
      return null;
    default:
      return null;
  }
}

export default function StepNav({ onCalculate }: StepNavProps) {
  const { state, setStep } = useTransmission();
  const { currentStep, inputs } = state;

  function handleNext() {
    const error = validateStep(currentStep, inputs);
    if (error) {
      alert(error);
      return;
    }
    setStep(currentStep + 1);
  }

  function handleStepClick(targetStep: number) {
    // Validate all steps between current and target when jumping forward
    if (targetStep > currentStep) {
      for (let s = currentStep; s < targetStep; s++) {
        const error = validateStep(s, inputs);
        if (error) {
          alert(`Step ${s}: ${error}`);
          return;
        }
      }
    }
    setStep(targetStep);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => handleStepClick(step.id)}
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
            onClick={handleNext}
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
