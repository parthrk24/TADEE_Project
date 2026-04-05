// src/components/steps/Step4_LineModel.tsx
"use client";

import { useTransmission } from "@/context/TransmissionContext";
import { LineModel } from "@/types/transmission";

const MODELS: {
  value: LineModel;
  label: string;
  desc: string;
  range: string;
}[] = [
  {
    value: "short",
    label: "Short Line",
    desc: "Capacitance neglected. Only series R and L.",
    range: "< 80 km",
  },
  {
    value: "nominal-pi",
    label: "Nominal π Model",
    desc: "Shunt capacitance split equally at both ends.",
    range: "80 – 250 km",
  },
  {
    value: "distributed",
    label: "Distributed Parameter",
    desc: "Exact model using hyperbolic functions (γl).",
    range: "> 250 km",
  },
];

export default function Step4_LineModel() {
  const { state, updateInput } = useTransmission();
  const { inputs } = state;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">
          Step 4 — Line Model
        </h2>
        <p className="text-xs text-purple-300/50 mt-0.5">
          Select the model based on line length
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {MODELS.map((model) => (
          <button
            key={model.value}
            onClick={() => updateInput({ lineModel: model.value })}
            className={`w-full text-left rounded-xl border-2 px-4 py-3 
                        transition
                        ${
                          inputs.lineModel === model.value
                            ? "border-purple-500 bg-purple-500/20"
                            : "border-purple-500/20 bg-white/5 hover:bg-white/10"
                        }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-semibold text-sm
                                ${
                                  inputs.lineModel === model.value
                                    ? "text-purple-200"
                                    : "text-purple-300/70"
                                }`}
              >
                {model.label}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full
                                ${
                                  inputs.lineModel === model.value
                                    ? "bg-purple-500/30 text-purple-200"
                                    : "bg-white/10 text-purple-300/50"
                                }`}
              >
                {model.range}
              </span>
            </div>
            <p
              className={`text-xs mt-1
                           ${
                             inputs.lineModel === model.value
                               ? "text-purple-300/70"
                               : "text-purple-300/40"
                           }`}
            >
              {model.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
