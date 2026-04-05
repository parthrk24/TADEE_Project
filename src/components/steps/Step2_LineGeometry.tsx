// src/components/steps/Step2_LineGeometry.tsx
"use client";

import { useTransmission } from "@/context/TransmissionContext";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

export default function Step2_LineGeometry() {
  const { state, updateInput } = useTransmission();
  const { inputs } = state;

  const isUnsym = inputs.spacingType === "unsymmetrical";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">
          Step 2 — Line Geometry
        </h2>
        <p className="text-xs text-purple-300/50 mt-0.5">
          Define the phase conductor spacing
        </p>
      </div>

      <SelectField
        label="Spacing Configuration"
        value={inputs.spacingType}
        onChange={(v) =>
          updateInput({ spacingType: v as "symmetrical" | "unsymmetrical" })
        }
        options={[
          { label: "Symmetrical (Equilateral)", value: "symmetrical" },
          { label: "Unsymmetrical (Transposed)", value: "unsymmetrical" },
        ]}
      />

      {/* Symmetrical */}
      {!isUnsym && (
        <InputField
          label="Spacing Between Phase Conductors (D)"
          value={inputs.spacingAB}
          onChange={(v) => updateInput({ spacingAB: Number(v) })}
          unit="m"
          min={0.1}
          step={0.1}
          hint="Equal spacing between all three phases"
        />
      )}

      {/* Unsymmetrical */}
      {isUnsym && (
        <>
          <div
            className="rounded-lg bg-purple-500/10 border border-purple-500/20
                          px-4 py-3 text-sm text-purple-200"
          >
            GMD will be calculated as ∛(D_AB × D_BC × D_CA)
          </div>

          <InputField
            label="Spacing D_AB (Phase A to B)"
            value={inputs.spacingAB}
            onChange={(v) => updateInput({ spacingAB: Number(v) })}
            unit="m"
            min={0.1}
            step={0.1}
          />

          <InputField
            label="Spacing D_BC (Phase B to C)"
            value={inputs.spacingBC}
            onChange={(v) => updateInput({ spacingBC: Number(v) })}
            unit="m"
            min={0.1}
            step={0.1}
          />

          <InputField
            label="Spacing D_CA (Phase C to A)"
            value={inputs.spacingCA}
            onChange={(v) => updateInput({ spacingCA: Number(v) })}
            unit="m"
            min={0.1}
            step={0.1}
          />
        </>
      )}
    </div>
  );
}
