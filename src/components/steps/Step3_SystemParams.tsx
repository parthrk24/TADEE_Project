// src/components/steps/Step3_SystemParams.tsx
"use client";

import { useTransmission } from "@/context/TransmissionContext";
import InputField from "@/components/ui/InputField";

export default function Step3_SystemParams() {
  const { state, updateInput } = useTransmission();
  const { inputs } = state;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">
          Step 3 — System Parameters
        </h2>
        <p className="text-xs text-purple-300/50 mt-0.5">
          Define the load and system voltage
        </p>
      </div>

      <InputField
        label="Length of Line"
        value={inputs.lineLength}
        onChange={(v) => updateInput({ lineLength: Number(v) })}
        unit="km"
        min={1}
        hint="Total length of the transmission line"
      />

      <InputField
        label="Receiving End Load"
        value={inputs.receivingEndLoad}
        onChange={(v) => updateInput({ receivingEndLoad: Number(v) })}
        unit="MW"
        min={0.1}
        step={0.1}
      />

      {/* Power Factor + Lag/Lead toggle */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-purple-100">
          Power Factor
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={inputs.powerFactor}
            onChange={(e) =>
              updateInput({ powerFactor: Number(e.target.value) })
            }
            min={0.1}
            max={1}
            step={0.01}
            className="flex-1 rounded-lg border border-purple-500/30
                       bg-white/10 text-white px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-purple-500
                       transition"
          />
          {/* Lag / Lead toggle */}
          <div
            className="flex rounded-lg border border-purple-500/30 
                          overflow-hidden text-sm"
          >
            <button
              onClick={() => updateInput({ pfLag: true })}
              className={`px-3 py-2 transition font-medium
                          ${
                            inputs.pfLag
                              ? "bg-purple-600 text-white"
                              : "bg-white/5 text-purple-300 hover:bg-white/10"
                          }`}
            >
              Lag
            </button>
            <button
              onClick={() => updateInput({ pfLag: false })}
              className={`px-3 py-2 transition font-medium
                          ${
                            !inputs.pfLag
                              ? "bg-purple-600 text-white"
                              : "bg-white/5 text-purple-300 hover:bg-white/10"
                          }`}
            >
              Lead
            </button>
          </div>
        </div>
        <p className="text-xs text-purple-300/50">
          Enter value between 0.1 and 1.0
        </p>
      </div>

      <InputField
        label="Nominal System Voltage"
        value={inputs.nominalVoltage}
        onChange={(v) => updateInput({ nominalVoltage: Number(v) })}
        unit="kV"
        min={1}
        hint="Line-to-line voltage"
      />

      <InputField
        label="Power Frequency"
        value={inputs.frequency}
        onChange={(v) => updateInput({ frequency: Number(v) })}
        unit="Hz"
        min={1}
        hint="50 Hz (India) or 60 Hz"
      />
    </div>
  );
}
