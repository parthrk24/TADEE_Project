// src/components/CalculatorContent.tsx
"use client";

import { useTransmission } from "@/context/TransmissionContext";
import { calculate } from "@/lib/calculations";
import Step1_ConductorParams from "@/components/steps/Step1_ConductorParams";
import Step2_LineGeometry from "@/components/steps/Step2_LineGeometry";
import Step3_SystemParams from "@/components/steps/Step3_SystemParams";
import Step4_LineModel from "@/components/steps/Step4_LineModel";
import StepNav from "@/components/ui/StepNav";
import Results from "@/components/Results";

export default function CalculatorContent() {
  const { state, setResults, reset } = useTransmission();
  const { currentStep, results } = state;

  function handleCalculate() {
    try {
      const res = calculate(state.inputs);
      setResults(res);
    } catch (e) {
      alert("Calculation error. Please check your inputs.");
      console.error(e);
    }
  }

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1_ConductorParams />,
    2: <Step2_LineGeometry />,
    3: <Step3_SystemParams />,
    4: <Step4_LineModel />,
  };

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Transmission Line Analyser
          </h1>
          <p className="text-sm text-purple-300/70 mt-1">
            EEPC17 — NIT Tiruchirappalli
          </p>
        </div>
        <button
          onClick={reset}
          className="text-xs text-purple-300/50 hover:text-red-400 transition mt-1"
        >
          ↺ Reset
        </button>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-4">
        <div
          className="bg-black/40 backdrop-blur-md rounded-2xl
                        border border-purple-500/20 p-6 flex flex-col gap-6"
        >
          {results ? (
            <Results />
          ) : (
            <>
              {stepComponents[currentStep]}
              <StepNav onCalculate={handleCalculate} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
