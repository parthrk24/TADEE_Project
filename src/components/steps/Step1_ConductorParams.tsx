// src/components/steps/Step1_ConductorParams.tsx
"use client";

import { useTransmission } from "@/context/TransmissionContext";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectField";

export default function Step1_ConductorParams() {
  const { state, updateInput } = useTransmission();
  const { inputs } = state;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">
          Step 1 — Conductor Parameters
        </h2>
        <p className="text-xs text-purple-300/50 mt-0.5">
          Define the ACSR sub-conductor properties
        </p>
      </div>

      <SelectField
        label="Number of Strands per Sub-conductor"
        value={inputs.numStrands}
        onChange={(v) =>
          updateInput({ numStrands: Number(v) as 1 | 7 | 19 | 37 | 61 | 91 })
        }
        options={[
          { label: "1", value: 1 },
          { label: "7", value: 7 },
          { label: "19", value: 19 },
          { label: "37", value: 37 },
          { label: "61", value: 61 },
          { label: "91", value: 91 },
        ]}
      />

      <InputField
        label="Diameter of Each Strand"
        value={inputs.strandDiameter}
        onChange={(v) => updateInput({ strandDiameter: Number(v) })}
        unit="mm"
        min={0.1}
        step={0.1}
        hint="Same diameter assumed for all strands"
      />

      <InputField
        label="Resistance of Each Sub-conductor"
        value={inputs.subConductorResistance}
        onChange={(v) => updateInput({ subConductorResistance: Number(v) })}
        unit="Ω/km"
        min={0.001}
        step={0.001}
        hint="AC resistance at operating temperature"
      />

      <SelectField
        label="Number of Sub-conductors per Bundle"
        value={inputs.numSubConductors}
        onChange={(v) =>
          updateInput({ numSubConductors: Number(v) as 2 | 3 | 4 })
        }
        options={[
          { label: "2 sub-conductors", value: 2 },
          { label: "3 sub-conductors", value: 3 },
          { label: "4 sub-conductors", value: 4 },
        ]}
      />

      <InputField
        label="Spacing Between Sub-conductors"
        value={inputs.bundleSpacing}
        onChange={(v) => updateInput({ bundleSpacing: Number(v) })}
        unit="mm"
        min={1}
        hint="Centre-to-centre distance between adjacent sub-conductors"
      />
    </div>
  );
}
